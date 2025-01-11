import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../controllers/product.controller";
import { adminRoleMiddleware, authMiddleware, uploadImage } from "../utils";

router.post(
  "/product/create",
  authMiddleware,
  adminRoleMiddleware,
  uploadImage.single("image"),
  (req: Request, res: Response, next: NextFunction) => createProduct(req, res)
);

router.post("/product/get-all", (req: Request, res: Response) =>
  getProducts(req, res)
);

router.get("/product/get/:id", (req: Request, res: Response) => {
  getProductById(req, res);
});

router.put("/product/update/:id", (req: Request, res: Response) => {
  updateProduct(req, res);
});

router.delete("/product/delete/:id", (req: Request, res: Response) => {
  deleteProduct(req, res);
});

export default router;
