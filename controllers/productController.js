import Product from "../models/Product.js";

// ✅ Create product
export const addProduct = async (req, res) => {
  try {
    const { name, description, imageUrl, rating, ratedCount, addedBy } = req.body;
    console.log(name, description, imageUrl, rating, ratedCount, addedBy)
    if (!name || !addedBy) {

      return res.status(400).json({ message: "Name and addedBy are required" });
    }

    const product = new Product({
      name,
      description,
      imageUrl,
      rating: rating || 0,
      ratedCount: ratedCount || 0,
      addedBy,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "❌ Error adding product", error: err.message });
  }
};

// ✅ Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching products", error: err.message });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product updated successfully", product: updated });
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating product", error: err.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  console.log("delete runned")
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Error deleting product", error: err.message });
  }
};
