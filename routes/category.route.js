const express = require("express");
const {
  createCategory,
  getCategoryByName,
  getAllCategories,
} = require("../controllers/category.controller");
const router = express.Router();
router.post("/category/create", createCategory);
router.get("/category/get-by-name", getCategoryByName);
router.get("/category/get-all", getAllCategories);

module.exports = router;
