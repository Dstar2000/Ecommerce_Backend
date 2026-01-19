import express from "express";
import { loginController, registerController, testController } from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router Object
const router = express.Router()

// Register Route
router.post("/register", registerController)
// Login Route
router.post("/login", loginController)

// Test Route
router.get("/test", requireSignIn, isAdmin, testController)

export default router