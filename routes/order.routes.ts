import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  addOrder,
  updateOrderStatus,
  getAllOrders,
  getUserOrders,
  getOrderStatusDropdown,
  getPaymentStatusDropdown,
  generateReport,
} from "../controllers/order.contoller";

import { adminRoleMiddleware, authMiddleware } from "../utils";

router.post(
  "/order/place-order",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => addOrder(req, res)
);

router.get(
  "/order/order-status-report",
  authMiddleware,
  adminRoleMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await generateReport(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/order/update-order",
  authMiddleware,
  adminRoleMiddleware,
  (req: Request, res: Response) => updateOrderStatus(req, res)
);

router.get(
  "/order/get-user-orders",
  authMiddleware,
  (req: Request, res: Response) => {
    getUserOrders(req, res);
  }
);

router.get(
  "/order/get-all",
  authMiddleware,
  // adminRoleMiddleware,
  getAllOrders as unknown as express.RequestHandler
);

router.get(
  "/order/get-order-dropdown",
  authMiddleware,
  // adminRoleMiddleware,
  getOrderStatusDropdown as unknown as express.RequestHandler
);

router.get(
  "/order/get-payment-dropdown",
  authMiddleware,
  // adminRoleMiddleware,
  getPaymentStatusDropdown as unknown as express.RequestHandler
);

export default router;
