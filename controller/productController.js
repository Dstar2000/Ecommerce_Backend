import productModel from "../models/productModel.js";

// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({ success: false, message: "Only shop owners can create products" });
    }

    const { name, description, price, category, images, stock } = req.body;

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      images,
      stock,
      shopOwner: req.user._id,
    });

    res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR 👉", error);
    res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};

// GET ALL ACTIVE PRODUCTS (Public)
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({ status: "active" }).populate("shopOwner", "name email").lean();
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.log("GET ALL PRODUCTS ERROR 👉", error);
    res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, images, stock, status } = req.body;

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (req.user.role !== 1 || product.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this product" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: { name, description, price, category, images, stock, status } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR 👉", error);
    res.status(500).json({ success: false, message: "Error updating product", error: error.message });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (req.user.role !== 1 || product.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
    }

    await productModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR 👉", error);
    res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
  }
};

// GET SINGLE PRODUCT
export const getProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).populate("shopOwner", "name email").lean();

    if (!product || product.status !== "active") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("GET PRODUCT ERROR 👉", error);
    res.status(500).json({ success: false, message: "Error fetching product", error: error.message });
  }
};

// GET SHOP PRODUCTS (Shop Owner Only)
export const getShopProductsController = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const products = await productModel
      .find({ shopOwner: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log("GET SHOP PRODUCTS ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shop products",
      error: error.message,
    });
  }
};

