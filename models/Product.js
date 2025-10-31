import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  rating: { type: Number, default: 0 },
  ratedCount: { type: Number, default: 0 },
  addedBy: { type: String, required: true }, // admin email
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
