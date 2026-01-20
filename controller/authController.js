import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, shopName } = req.body;
    const role = Number(req.body.role); // 0 = Customer, 1 = Shop Owner, 2 = Admin

    // Validate role
    if (![0, 1, 2].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // Shop owner validation
    if (role === 1 && !shopName) {
      return res.status(400).json({
        success: false,
        message: "Shop name is required for shop owners",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user with status active by default
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
      shopName: role === 1 ? shopName : undefined,
      status: "active", 
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("REGISTER CONTROLLER ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Error in Register Controller",
      error: error.message,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Fetch user as plain object for easy status check
    const user = await userModel.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Block login if user is inactive
    if (!user.status || user.status.toLowerCase() !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Contact admin.",
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Determine redirect path based on role
    let redirectPath = "/customer/dashboard"; // default
    if (user.role === 1) redirectPath = "/shop/dashboard";
    if (user.role === 2) redirectPath = "/admin/dashboard";

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        shopName: user.shopName || null,
      },
      token,
      redirectPath,
    });
  } catch (error) {
    console.error("LOGIN CONTROLLER ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: "Error in Login Controller",
      error: error.message,
    });
  }
};

// TEST PROTECTED ROUTE
export const testController = async (req, res) => {
  res.send("Protected Route");
};
