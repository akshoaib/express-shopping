import mongoose, { Document, Schema } from "mongoose";

interface OrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  payablePrice: number;
  purchasedQty: number;
}

interface OrderStatus {
  type: "ordered" | "packed" | "shipped" | "delivered";
  date: Date;
  isCompleted: boolean;
}

interface Order extends Document {
  user: mongoose.Schema.Types.ObjectId;
  totalAmount: number;
  items: OrderItem[];
  paymentStatus: "pending" | "completed" | "cancelled" | "refund";
  paymentType: "cod" | "card";
  orderStatus: OrderStatus[];
}

const orderSchema: Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      payablePrice: {
        type: Number,
        required: true,
      },
      purchasedQty: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "cancelled", "refund"],
    required: true,
    default: "pending",
  },
  paymentType: {
    type: String,
    enum: ["cod", "card"],
    required: true,
  },
  orderStatus: [
    {
      type: {
        type: String,
        enum: ["ordered", "packed", "shipped", "delivered"],
        default: "ordered",
      },
      date: {
        type: Date,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Order = mongoose.model<Order>("Order", orderSchema);
export default Order;
