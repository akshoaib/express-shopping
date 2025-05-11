// Mongo schema (models/UserView.js)

import mongoose from "mongoose";

const ProductViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  viewedAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model("ProductView", ProductViewSchema);
const ProductView = mongoose.model("ProductView", ProductViewSchema);
export default ProductView;
