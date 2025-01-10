const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.body);
    const categoryExists = await Category.findOne({ name });
    console.log({ categoryExists });

    if (categoryExists) {
      return res.json({ message: "category already exists" });
    }
    const category = await Category.create({
      name,
    });
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      category,
    });
  } catch (error) {}
};

const getCategoryByName = async (req, res) => {
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
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {}
};
module.exports = {
  createCategory,
  getCategoryByName,
  getAllCategories,
};
