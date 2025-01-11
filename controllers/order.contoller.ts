import { OrderTypes } from "../constants";
import { TypedRequestBody } from "../models/interfaces";
import Order from "../models/order.model";
import { Response } from "express";

interface IOrder {
  user: string;
  totalAmount: number;
  items: object[];
  paymentStatus: string;
  orderStatus: string;
}
const addOrder = async (req: TypedRequestBody<IOrder>, res: Response) => {
  try {
    const { user, totalAmount, items } = req.body;
    const order = await Order.create({ user, totalAmount, items });
    res.status(201).json({ message: "order placed!" });
  } catch (error) {}
};

const getUserOrders = async (
  req: TypedRequestBody<{ user: string }>,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    const orders = await Order.find({ user });
    res.status(200).json({ orders });
  } catch (error) {}
};

const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ orders });
  } catch (error) {}
};

const updateOrderStatus = async (
  req: TypedRequestBody<IOrder>,
  res: Response
): Promise<void> => {
  try {
    const { paymentStatus, orderStatus, user } = req.body;
    const order = await Order.findByIdAndUpdate(
      { user, orderStatus: OrderTypes.ORDERED },
      { $set: { paymentStatus, orderStatus } }
    );
  } catch (error) {}
};
export { addOrder, getUserOrders, updateOrderStatus, getAllOrders };
