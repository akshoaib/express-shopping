import express, { Request, Response } from "express";
import Product from "../models/product.model";
import { IProduct, TypedRequestBody } from "../models/interfaces";

const createProduct = async (
  req: TypedRequestBody<IProduct>,
  res: Response
) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ message: "product created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (
  req: TypedRequestBody<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }>,
  res: Response
) => {
  try {
    const { category, minPrice = 0, maxPrice, page = 1, limit = 10 } = req.body;
    const filter: any = {};
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
      .limit(Number(limit))
      .populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (
  req: TypedRequestBody<{ name?: string; price?: number; category?: string }>,
  res: Response
) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    console.log("heyy", req.body);
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
