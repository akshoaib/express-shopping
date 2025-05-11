import mongoose, { Document, Schema } from "mongoose";
import { OrderStatusId, PaymentStatusId } from "../constants";

interface OrderItem {
  productId: mongoose.Schema.Types.ObjectId;
  payablePrice: number;
  purchasedQty: number;
}

// interface OrderStatus {
//   type: "ordered" | "packed" | "shipped" | "delivered";
//   date: Date;
//   isCompleted: boolean;
// }

interface Order extends Document {
  user: mongoose.Schema.Types.ObjectId;
  address: mongoose.Schema.Types.ObjectId;

  totalAmount: number;
  items: OrderItem[];
  paymentStatus: number;
  paymentType: "cod" | "card";
  orderStatus: number;
}

const orderSchema: Schema = new mongoose.Schema(
  {
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
      type: Number,
      enum: [
        PaymentStatusId.PENDING,
        PaymentStatusId.COMPLETED,
        PaymentStatusId.REFUND,
      ],
      required: true,
      default: PaymentStatusId.PENDING,
    },
    paymentType: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
      required: true,
    },
    orderStatus: {
      type: Number,
      enum: [
        OrderStatusId.ORDERED,
        OrderStatusId.PACKED,
        OrderStatusId.SHIPPED,
        OrderStatusId.DELIVERED,
        OrderStatusId.CANCELLED,
      ],
      default: OrderStatusId.ORDERED,

      date: {
        type: Date,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<Order>("Order", orderSchema);
export default Order;
