import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  CartItem,
  ICart,
  IProduct,
  TypedRequestBody,
} from "../models/interfaces"; // Assuming you have these interfaces defined

import Cart from "../models/cart.model";
import Product from "../models/product.model";

const addToCart = async (
  req: TypedRequestBody<CartItem>,
  res: Response
): Promise<Response> => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res
        .status(400)
        .json({ message: "product is required to add in the cart" });
    }
    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated" });
    }
    const user = req.user._id;
    const productExists: IProduct | null = await Product.findById(productId);
    if (productExists && productExists.quantity >= quantity) {
      const cart: ICart | null = await Cart.findOne({ user });
      if (!cart) {
        const newCart = await Cart.create({
          user,
          cartItems: [
            {
              product: productId,
              quantity,
              price: productExists.price * quantity,
            },
          ],
          totalPrice: productExists.price * quantity,
        });
        return res.status(201).json({
          success: true,
          message: "Cart created successfully",
          data: { cart: newCart },
        });
      } else {
        const items = cart.cartItems?.find(
          (item) =>
            item.product && item.product.toString() === productId.toString()
        );

        let total = cart?.totalPrice;

        if (items) {
          let updatedCart;
          if (quantity === 0) {
            updatedCart = await Cart.findOneAndUpdate(
              { user: user },
              {
                $pull: {
                  cartItems: {
                    product: productId,
                  },
                },
                totalPrice: total,
              },
              { new: true }
            );
          } else {
            updatedCart = await Cart.findOneAndUpdate(
              {
                user,
                "cartItems.product": productId,
              },
              {
                $set: {
                  "cartItems.$.quantity": quantity + Number(items.quantity),
                  "cartItems.$.price":
                    (Number(items.price) || 0) +
                    Number(productExists.price) * quantity,
                  totalPrice:
                    Number(total) + Number(productExists.price) * quantity,
                },
              },
              { new: true }
            );
          }

          return res.status(201).json({
            success: true,
            message: "Cart updated successfully",
            data: updatedCart,
          });
        } else {
          const newCart = await Cart.findOneAndUpdate(
            { user: user },
            {
              $push: {
                cartItems: {
                  product: productId,
                  quantity,
                  price: productExists.price * quantity,
                },
              },
              totalPrice: total + productExists.price * quantity,
            },
            { new: true }
          );

          return res.status(201).json({
            success: true,
            message: "Cart updated successfully",
            data: newCart,
          });
        }
      }
    } else {
      return res.status(400).json({
        message: "Product not available or insufficient quantity",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCartItems = async (
  req: TypedRequestBody<{}>,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated" });
    }
    const userId = req.user._id;
    const cart: ICart[] = await Cart.find(
      { user: userId },
      { "cartItems._id": 0 }
    ).populate("cartItems.product", "name price description images");

    return res.status(200).json({
      success: true,
      data: { cart: cart[0]?.cartItems || [], total: cart[0]?.totalPrice },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removeCartItems = async (
  req: TypedRequestBody<{ productId: string }>,
  res: Response
): Promise<Response> => {
  const productId = req.query.productId as string;
  try {
    if (!productId) {
      return res.status(400).json({ message: "Product Id is required" });
    }

    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const cart: ICart | null = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    let total = cart.cartItems?.reduce((acc, item) => {
      if (item?.product?.toString() !== productId?.toString()) {
        acc = acc + (item.price ?? 0);
      }

      return acc;
    }, 0);
    const updatedCart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
        totalPrice: total,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Items removed", updatedCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addToCart, removeCartItems, getCartItems };
