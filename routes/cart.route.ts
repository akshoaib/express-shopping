import express, { Request, Response, NextFunction } from "express";

import { authMiddleware } from "../utils";
import {
  addToCart,
  getCartItems,
  removeCartItems,
} from "../controllers/cart.controller";

const router = express.Router();

router.post(
  "/cart/add-to-cart",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    addToCart(req, res);
  }
);

router.put(
  "/cart/remove-cart-items",
  authMiddleware,
  removeCartItems as unknown as express.RequestHandler
);

router.get(
  "/cart/get-cart",
  authMiddleware,
  getCartItems as unknown as express.RequestHandler
);

export default router;
