import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import { adminRoleMiddleware, authMiddleware } from "../utils";
import {
  addAddress,
  deleteAddress,
  getAddress,
} from "../controllers/address.controller";

router.post(
  "/address/add",
  authMiddleware,
  async (req: Request, res: Response) => {
    await addAddress(req, res);
  }
);

router.delete(
  "/address/delete/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    await deleteAddress(req, res);
  }
);

router.get("/address/get", authMiddleware, (req: Request, res: Response) => {
  getAddress(req, res);
});

export default router;
