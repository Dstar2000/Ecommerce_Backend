import express from "express";
import { loginController, registerController, testController } from "../controller/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

// Router Object
const router = express.Router()

// Register Route
router.post("/register", registerController)
// Login Route
router.post("/login", loginController)

// Test Route
router.get("/test", requireSignIn, testController)

export default router