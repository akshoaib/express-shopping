const express = require("express");
const {
  addToCart,
  removeCartItems,
  getCartItems,
} = require("../controllers/cart.controller");
const { authMiddleware } = require("../utils");

const router = express.Router();
router.post("/cart/add-to-cart", authMiddleware, addToCart);
router.put("/cart/remove-cart-items", authMiddleware, removeCartItems);
router.get("/cart/get-cart", authMiddleware, getCartItems);

module.exports = router;
