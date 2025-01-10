const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user._id;
    const productExists = await Product.findById(productId);
    console.log({ productExists }, productExists.quantity);
    if (productExists && productExists.quantity >= quantity) {
      const cart = await Cart.findOne({ user });
      if (!cart) {
        Cart.create({
          user,
          cartItems: [{ product: productId, quantity }],
        });
        return res
          .status(201)
          .json({ message: "Cart created successfully", cart });
      } else {
        const items = cart.cartItems?.find((item) => item.product == productId);
        console.log({ items });

        if (items) {
          let updatedCart = await Cart.findOneAndUpdate(
            {
              user,
              "cartItems.product": productId,
            },
            {
              $set: {
                "cartItems.$.quantity": quantity,
              },
            }
          );

          return res
            .status(201)
            .json({ message: "Cart updated successfully", updatedCart });
        } else {
          console.log("elsees run");

          let newCart = await Cart.findOneAndUpdate(
            { user: user },
            {
              $push: {
                cartItems: {
                  product: productId,
                  quantity,
                },
              },
            }
          );

          console.log({ newCart });

          return res
            .status(201)
            .json({ message: "Cart updated successfully", newCart });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log({ userId });
    const cart = await Cart.find({ user: userId }, { "cartItems._id": 0 });
    console.log(cart);
    res.status(200).json({ cart: cart[0].cartItems });
  } catch (error) {
    console.log(error);
  }
};

const removeCartItems = async (req, res) => {
  const productId = req.query.productId;
  console.log({ productId }, req.user._id);
  try {
    let updatedCart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    );
    console.log({ updatedCart });

    res.status(200).json({ message: "Items removed", updatedCart });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addToCart, removeCartItems, getCartItems };
