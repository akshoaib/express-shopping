import express, { Request, Response } from "express";
import Product from "../models/product.model";
import { IProduct, TypedRequestBody } from "../models/interfaces";
import Order from "../models/order.model";
import mongoose, { ObjectId } from "mongoose";
import { OrderStatusId, PaymentStatusId } from "../constants";
import Cart from "../models/cart.model";
import { uploadToCloudinary } from "../utils";
const createProduct = async (
  req: TypedRequestBody<IProduct>,
  res: Response
) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    console.log("hello33333333333333", req.file);

    let imageURL = "";
    console.log("request.files", req.files);

    let images =
      Array.isArray(req.files) &&
      (await Promise.all(
        req.files.map(async (file) => {
          if (file.buffer) {
            const imageUrl = await uploadToCloudinary(file.buffer);
            return imageUrl;
          }
          return null;
        })
      ));
    //  if (req.file.buffer) {
    //   imageURL = (await uploadToCloudinary(req.file.buffer)) || "";
    // }

    console.log({ images });

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      images: images ? images : [], // Save the file path
    });

    const product = await newProduct.save();
    res.status(200).json({
      message: "product created successfully",
      product,
      success: true,
    });
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
    const { category, minPrice = 0, maxPrice, page = 0, limit = 10 } = req.body;
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
    console.log({ filter });
    const totalProducts = await Product.countDocuments(filter);
    let products;
    if (page) {
      products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("category");
    } else {
      products = await Product.find(filter).populate("category");
    }

    res.status(200).json({
      data: {
        products,
        total: totalProducts,
      },
      success: true,
    });
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
  req: TypedRequestBody<{
    name?: string;
    description: string;
    price?: number;
    category?: string;
    image?: string;
  }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    let imageURL = "";
    // if (req.file) {
    //   if (req.file.buffer) {
    //     imageURL = (await uploadToCloudinary(req.file.buffer)) || "";
    //   }
    // }

    let images =
      Array.isArray(req.files) &&
      (await Promise.all(
        req.files.map(async (file) => {
          if (file.buffer) {
            const imageUrl = await uploadToCloudinary(file.buffer);
            return imageUrl;
          }
          return null;
        })
      ));
    let body = {
      ...req.body,
      // image: imageURL ? imageURL : req.body?.image,
    };
    console.log({ body });
    const updateData = { ...body };
    const updateOptions: any = { ...updateData };
    console.log("hey images:: ", images);

    if (images && images.length > 0) {
      updateOptions.$push = { images: images };
    }

    console.log({ updateOptions });

    const product = await Product.findByIdAndUpdate(id, updateOptions);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const updatedProduct = await Product.findById(id);
    console.log("get products::", updatedProduct);

    res.status(200).json({ data: updatedProduct, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carts = await Cart.find({
      cartItems: { $elemMatch: { productId: id } },
    });

    console.log("ccccc", carts);
    const orders = await Order.find({
      items: { $elemMatch: { productId: id } },
      paymentStatus: { $ne: PaymentStatusId.COMPLETED },
    });

    if (carts?.length > 0 || orders?.length > 0) {
      return res.status(400).json({ message: "Product is in cart or order" });
    }

    console.log("orders", orders);
    const product = await Product.findByIdAndDelete(id);
    console.log("get products::", product);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rateProduct = async (
  req: TypedRequestBody<{
    rating: number;
    comment: string;
    productId: string;
  }>,
  res: Response
) => {
  try {
    const { rating, comment, productId } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log({ id });

    const order = await Order.findOne({
      items: { $elemMatch: { productId: id } },
    });

    console.log({ order });

    if (!order) {
      return res
        .status(400)
        .json({ message: "You need to purchase the product to rate it" });
    }

    const alreadyRated = product.reviews.find((r) => {
      console.log(r.user, req.user?._id, req.user);

      return r.user?.toString() === req.user?._id?.toString();
    });

    if (alreadyRated) {
      return res.status(400).json({ message: "Product already rated" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          reviews: {
            user: req.user?._id,
            rating,
            comment,
          },
        },
        rating: (product.rating + rating) / (product.reviews.length + 1),
      }
    );
    res.status(200).json({ message: "Product rated successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAllProducts = async (req: Request, res: Response) => {
  try {
    const product = await Product.deleteMany({});

    if (!product) {
      return res.status(404).json({ message: "products not found" });
    }
    res.status(200).json({ message: "products deleted successfully" });
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
  rateProduct,
  deleteAllProducts,
};
