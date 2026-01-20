import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductController,
  updateProductController,
  deleteProductController
} from "../controller/productController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllProductsController);
router.get("/:id", getProductController);

// Shop owner only - Note: No need to add multer middleware here as it's in the controller
router.post("/", requireSignIn, createProductController);
router.put("/:id", requireSignIn, updateProductController);
router.delete("/:id", requireSignIn, deleteProductController);

export default router;