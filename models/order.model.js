const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
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

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
