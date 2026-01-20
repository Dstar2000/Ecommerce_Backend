import express from "express";
import { deleteUserController, getAllUsersController, getUserController, getUserProfileController, updateProfileController, updateUserStatusController } from "../controller/userController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router Object
const router = express.Router()

router.get("/profile", requireSignIn, getUserProfileController);
router.put("/profile", requireSignIn, updateProfileController);

router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);
router.get("/:id", requireSignIn, isAdmin, getUserController);
router.delete("/:id", requireSignIn, isAdmin, deleteUserController);
router.put("/:id", requireSignIn, isAdmin, updateUserStatusController);

export default router