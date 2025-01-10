const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/product.controller");
const { adminRoleMiddleware, authMiddleware } = require("../utils");

router.post(
  "/product/create",
  authMiddleware,
  adminRoleMiddleware,
  createProduct
);

router.post("/product/get-all", getProducts);

router.get("/product/get/:id", getProductById);

router.put("/product/update/:id", updateProduct);

router.delete("/product/delete/:id", deleteProduct);

module.exports = router;
