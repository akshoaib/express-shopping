import mongoose, { Document, Schema } from "mongoose";

interface CartItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

interface CartDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  cartItems: CartItem[];
}

const cartSchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<CartDocument>("cart", cartSchema);

export default Cart;
