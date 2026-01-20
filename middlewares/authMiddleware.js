import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

/*
ROLE MAP
0 = Customer
1 = Shop
2 = Admin
*/

/* ===============================
   REQUIRE SIGN IN
================================ */
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {_id, role, email, ...}

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ===============================
   ADMIN ONLY
================================ */
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await userModel.findById(req.user._id).select("role");

    if (!user || user.role !== 2) {
      return res.status(403).send({
        success: false,
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in admin middleware",
    });
  }
};

/* ===============================
   SHOP ONLY (OPTIONAL BUT READY)
================================ */
export const isShop = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id).select("role");

    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Shop access only",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in shop middleware",
    });
  }
};
