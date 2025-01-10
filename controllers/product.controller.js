const express = require("express");
const Product = require("../models/product.model");

const createProduct = async (req, res) => {
  try {
    console.log("heyyyy", req.body);
    const product = await Product.create(req.body);
    res.status(200).json({ message: "product created successfully" });
  } catch (error) {
    console.log(error);
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, minPrice = 0, maxPrice, page = 1, limit = 10 } = req.body;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice) {
      filter.price = { $gte: minPrice };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }
    console.log("heyy", req.body);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
  }
};

const getProductById = async (req, res) => {
  try {
    console.log("heyy", req.body);
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("heyy", req.body);
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    console.log("heyy", req.body);
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "prouct deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
