import { Request, Response } from "express";
import Category from "../models/category.model";

const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const categoryExists = await Category.findOne({ name });
    console.log({ categoryExists });

    if (categoryExists) {
      res.json({ message: "category already exists" });
      return;
    }
    const category = await Category.create({
      name,
    });
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;
    console.log(req.body);
    const filter = {
      name: { $eq: name },
      $and: [{ onSale: true }, { rating: { $gte: 4.5 } }],
    };
    const category = await Category.find(filter);

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createCategory, getCategoryByName, getAllCategories };
