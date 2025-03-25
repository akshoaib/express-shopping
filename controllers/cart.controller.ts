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
    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated" });
    }
    const user = req.user._id;
    const productExists: IProduct | null = await Product.findById(productId);
    console.log({ productExists }, productExists?.quantity);
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
        return res
          .status(201)
          .json({ message: "Cart created successfully", cart: newCart });
      } else {
        const items = cart.cartItems?.find(
          (item) =>
            item.product && item.product.toString() === productId.toString()
        );
        let total = cart.cartItems?.reduce((acc, item) => {
          if (item?.product?.toString() !== productId?.toString()) {
            acc = acc + (item.price ?? 0);
          }

          return acc;
        }, 0);

        console.log({ total });

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
                  "cartItems.$.quantity": quantity,
                  "cartItems.$.price": productExists.price * quantity,
                  totalPrice: total + productExists.price * quantity,
                },
              },
              { new: true }
            );
          }

          return res
            .status(201)
            .json({ message: "Cart updated successfully", updatedCart });
        } else {
          console.log("elsees run");

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

          console.log({ newCart });

          return res
            .status(201)
            .json({ message: "Cart updated successfully", newCart });
        }
      }
    } else {
      return res
        .status(400)
        .json({
          message: "Product not available or insufficient quantity",
          success: true,
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
    console.log({ userId });
    const cart: ICart[] = await Cart.find(
      { user: userId },
      { "cartItems._id": 0 }
    );
    console.log(cart);
    return res
      .status(200)
      .json({ cart: cart[0]?.cartItems || [], total: cart[0]?.totalPrice });
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
    console.log({ updatedCart });

    return res.status(200).json({ message: "Items removed", updatedCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addToCart, removeCartItems, getCartItems };
