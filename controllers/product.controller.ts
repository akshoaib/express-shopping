import { Request, Response } from "express";
import Product from "../models/product.model";
import { IProduct, TypedRequestBody } from "../models/interfaces";
import Order from "../models/order.model";
import { PaymentStatusId } from "../constants";
import Cart from "../models/cart.model";
import { uploadToCloudinary } from "../utils";
import mongoose from "mongoose";

const createProduct = async (
  req: TypedRequestBody<IProduct>,
  res: Response
) => {
  try {
    const { name, description, price, category, quantity, tags } = req.body;
    const io = req.app.get("io");

    let imageURL = "";

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

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity,
      tags,
      images: images ? images : [], // Save the file path
    });

    const product = await newProduct.save();
    res.status(200).json({
      message: "product created successfully",
      product,
      success: true,
    });
    io.emit("new-product", product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductsRecommendation = async (
  req: TypedRequestBody<{}>,
  res: Response
) => {
  try {
    let products;

    products = await Product.find();

    res.status(200).json({
      // data: {
      products,
      // },
      success: true,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (
  req: TypedRequestBody<{
    categories?: number[];
    rating?: number[];
    availability?: boolean[];
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }>,
  res: Response
) => {
  try {
    const {
      categories,
      minPrice = 0,
      maxPrice,
      page = 0,
      limit = 1000,
      rating,
      availability,
    } = req.body;
    const { id, name, tags } = req.query;

    const filter: any = {};
    if (categories && categories.length > 0) {
      filter.category = {
        $in: categories.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
    if (minPrice) {
      filter.price = { $gte: minPrice };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }

    if (rating && rating.length > 0) {
      filter.rating = { $in: rating };
    }
    if (availability && availability.length > 0) {
      if (availability?.length > 1) {
        filter.$or = [{ quantity: { $gt: 0 } }, { quantity: { $lte: 0 } }];
      }
      if (availability?.length === 1 && availability[0] === true) {
        filter.quantity = { $gt: 0 };
      }
      if (availability?.length === 1 && availability[0] === false) {
        filter.quantity = { $lte: 0 };
      }
    }

    let products;

    if (id && Object?.keys(filter)?.length === 0) {
      products = await Product.find(filter);

      if (tags) {
        if (tags) {
          products = products.sort((a: any, b: any) => {
            const aMatches = a.tags?.includes(tags) ? 1 : 0;
            const bMatches = b.tags?.includes(tags) ? 1 : 0;
            return bMatches - aMatches;
          });
        }
      }

      const totalProducts = await Product.countDocuments(filter);

      return res.status(200).json({
        data: {
          products,
          total: totalProducts,
        },
        success: true,
      });
    } else {
      const totalProducts = await Product.countDocuments(filter);
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
    }
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate(
      "reviews.user",
      "-password"
    );
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ data: product, success: true });
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

    const updateData = { ...body };
    const updateOptions: any = { ...updateData };

    if (images && images.length > 0) {
      updateOptions.$push = { images: images };
    }

    const product = await Product.findByIdAndUpdate(id, updateOptions);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const updatedProduct = await Product.findById(id);

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

    const orders = await Order.find({
      items: { $elemMatch: { productId: id } },
      paymentStatus: { $ne: PaymentStatusId.COMPLETED },
    });

    if (carts?.length > 0 || orders?.length > 0) {
      return res.status(400).json({
        message:
          "Product cannot be deleted because it is in someone's cart or someone has ordered it",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({
      data: {
        message: "product deleted successfully",
      },
      success: true,
    });
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

    const order = await Order.findOne({
      items: { $elemMatch: { productId: id } },
    });

    if (!order) {
      return res
        .status(400)
        .json({ message: "You need to purchase the product to rate it" });
    }

    const alreadyRated = product.reviews.find((r) => {
      return r.user?.toString() === req.user?._id?.toString();
    });

    if (alreadyRated) {
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        {
          $pull: {
            reviews: {
              user: req.user?._id,
            },
          },
        }
      );
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
        rating: Math.round(
          (product.rating + rating) / (product.reviews.length + 1)
        ),
      }
    );
    res
      .status(200)
      .json({ data: { message: "Product rated successfully" }, success: true });
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
  getProductsRecommendation,
};
