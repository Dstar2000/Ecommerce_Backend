import { hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";


/*
ROLE MAP
0 = Customer
1 = Shop Owner
2 = Admin
*/

/* ===============================
   GET USER PROFILE (PROTECTED)
================================ */
export const getUserProfileController = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await userModel
      .findById(req.user._id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching profile",
    });
  }
};

/* ===============================
   UPDATE USER PROFILE (PROTECTED)
================================ */
export const updateProfileController = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { name, password, phone, address, shopName } = req.body;

    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const updateData = {
      name,
      phone,
      address,
    };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Only SHOP OWNER can update shopName
    if (req.user.role === 1 && shopName) {
      updateData.shopName = shopName;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true }
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
    });
  }
};

// Admin updates user (status only)
export const updateUserStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).send({ success: false, message: "Invalid status" });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, message: "User status updated", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error updating user status" });
  }
};


/* ===============================
   GET ALL USERS (ADMIN ONLY)
================================ */
export const getAllUsersController = async (req, res) => {
  try {
    if (req.user.role !== 2) {
      return res.status(403).send({
        success: false,
        message: "Admin access only",
      });
    }

    const users = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).send({
      success: true,
      countTotal: users.length,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all users",
    });
  }
};

/* ===============================
   GET SINGLE USER (ADMIN ONLY)
================================ */
export const getUserController = async (req, res) => {
  try {
    if (req.user.role !== 2) {
      return res.status(403).send({
        success: false,
        message: "Admin access only",
      });
    }

    const { id } = req.params;

    const user = await userModel
      .findById(id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting user",
    });
  }
};

/* ===============================
   DELETE USER (ADMIN ONLY)
================================ */
export const deleteUserController = async (req, res) => {
  try {
    if (req.user.role !== 2) {
      return res.status(403).send({
        success: false,
        message: "Admin access only",
      });
    }

    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user",
    });
  }
};
