import mongoose from "mongoose";
import {
  OrderStatusForIds,
  OrderStatusId,
  OrderTypes,
  PaymentTypes,
} from "../constants";
import Cart from "../models/cart.model";
import { TypedRequestBody } from "../models/interfaces";
import Order from "../models/order.model";
import { Request, Response } from "express";
import Address from "../models/address.model";
import Product from "../models/product.model";
import { PaymentStatusId } from "../constants";
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

interface IOrderDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  totalAmount: number;
  items: OrderItem[];
  paymentStatus: 1 | 2 | 3 | 4;
  paymentType: "cod" | "card";
  orderStatus: 1 | 2 | 3 | 4;
  address: mongoose.Schema.Types.ObjectId;
  _id: string;
}
const getUserCartItems = async (_id: string): Promise<any> => {
  const cart = await Cart.findOne({ user: _id });

  let items = cart?.cartItems?.map((itm) => {
    return {
      productId: itm.product,
      payablePrice: itm.price,
      purchasedQty: itm.quantity,
    };
  });
  return { items, total: cart?.totalPrice };
};

const addOrder = async (
  req: TypedRequestBody<any>,
  res: Response
): Promise<any> => {
  try {
    const user = req.user?._id || "";
    let address = req.body.address;
    let cart = await getUserCartItems(user);

    if (cart?.items.length === 0) {
      return res.status(400).json({ message: "cart is empty!" });
    }

    const order = await Order.create({
      user,
      totalAmount: cart?.total,
      items: cart?.items,
      address,
    });

    if (!order) {
      return res.status(400).json({ message: "error placing order!" });
    }
    //clear the cart
    await Cart.findOneAndUpdate(
      { user },
      {
        $set: { totalPrice: 0, cartItems: [] },
      }
    );

    //decrese the quantity of products in the inverntory
    cart.items.forEach(async (item: any) => {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.purchasedQty },
      });
    });

    res.status(201).json({ message: "order placed!", success: true });
  } catch (error) {
    res.status(500).json(error);

    console.log({ error });
  }
};

const getUserOrders = async (
  req: TypedRequestBody<{ user: string }>,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    const orders = await Order.find({ user }).populate("items.productId");
    res.status(200).json({ data: { orders }, success: true });
  } catch (error) {}
};

const getAllOrders = async (
  req: TypedRequestBody<{ user: string }>,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({})
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("user", "-password")
      .lean();

    const addressess = await Address.findOne({ user: req.user?._id });
    let ordersWithAddress;
    if (addressess?.addressList && addressess.addressList.length > 0) {
      ordersWithAddress = orders.map((order) => {
        const address = addressess?.addressList.find(
          (a) => a?._id.toString() === order?.address.toString()
        );
        return {
          ...order,
          address: address || null,
        };
      });
    }

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      data: { orders: ordersWithAddress, total: totalOrders },
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateOrderStatus = async (
  req: TypedRequestBody<IOrderDocument>,
  res: Response
): Promise<void> => {
  try {
    const { _id, paymentStatus, orderStatus } = req.body;
    const order = await Order.findById(_id);
    if (!order) {
      res.status(400).json({ message: "order not found" });
      return;
    }

    if (
      paymentStatus === PaymentStatusId.COMPLETED &&
      orderStatus !== OrderStatusId.DELIVERED
    ) {
      res.status(400).json({
        message: "payment can not be completed without delivering order",
      });
      return;
    }

    // if (
    //   paymentStatus === PaymentStatusId.REFUND &&
    //   (orderStatus !== OrderStatusId.CANCELLED ||
    //     order?.paymentStatus !== PaymentStatusId.COMPLETED ||
    //     order?.orderStatus !== OrderStatusId.CANCELLED)
    // ) {
    if (
      paymentStatus === PaymentStatusId.REFUND &&
      orderStatus !== OrderStatusId.CANCELLED
    ) {
      res.status(400).json({
        message:
          "payment can only be refunded if order is cancelled and payment is completed",
      });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id },
      { $set: { paymentStatus, orderStatus } }
    );

    res.status(200).json({ message: "order updated", success: true });
  } catch (error) {
    console.log(error);
  }
};

const getOrderStatusDropdown = async (
  req: Request,
  res: Response
): Promise<void> => {
  let statusNameKeys = Object.values(OrderTypes);
  let statusIdKeys = Object.values(OrderStatusId);

  let mapped = statusIdKeys.map((id, index) => {
    return {
      _id: id,
      name: statusNameKeys[index],
    };
  });

  res
    .status(200)
    .json({ data: { orderStatusDropdown: mapped }, success: true });
};

const getPaymentStatusDropdown = async (
  req: Request,
  res: Response
): Promise<void> => {
  let statusNameKeys = Object.values(PaymentTypes);
  let statusIdKeys = Object.values(PaymentStatusId);

  let mapped = statusIdKeys.map((id, index) => {
    return {
      _id: id,
      name: statusNameKeys[index],
    };
  });

  res
    .status(200)
    .json({ data: { paymentStatusDropdown: mapped }, success: true });
};
const generateReport = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start and end dates are required" });
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);
  end.setUTCHours(23, 59, 59, 999); // include full day
  try {
    const result = await Order.aggregate([
      {
        $match: {
          updatedAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Structure result for frontend graphing
    const defaultStatuses = [1, 2, 3, 4, 5];
    const counts = Object.fromEntries(
      defaultStatuses.map((status) => [status, 0])
    );

    result.forEach((r) => {
      counts[r._id] = r.count;
    });

    let data = Object.entries(counts).map(([key, value]) => {
      const Key = String(key) as keyof typeof OrderStatusForIds;
      const label = OrderStatusForIds[Key];
      return {
        status: label,
        count: counts[Key],
      };
    });

    return res.json({ data: data, success: true }); // e.g., { 1: 3, 2: 5, 3: 2, 4: 0 }
  } catch (error) {
    console.log(error);
  }
};

export {
  addOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderStatusDropdown,
  getPaymentStatusDropdown,
  generateReport,
};
