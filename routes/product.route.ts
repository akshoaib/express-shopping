import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
  rateProduct,
  deleteAllProducts,
  getProductsRecommendation,
} from "../controllers/product.controller";
import { adminRoleMiddleware, authMiddleware, uploadImage } from "../utils";

router.post(
  "/product/create",
  authMiddleware,
  adminRoleMiddleware,
  uploadImage.array("images"),
  (req: Request, res: Response, next: NextFunction) => createProduct(req, res)
);

router.post("/product/get-all", async (req: Request, res: Response) => {
  await getProducts(req, res);
});

router.get(
  "/product/get-products-recommendation",
  async (req: Request, res: Response) => {
    await getProductsRecommendation(req, res);
  }
);

// router.get("/product/get/:id", (req: Request, res: Response) => {
//   getProductById(req, res);
// });

router.get("/product/get/:id", (req: Request, res: Response) => {
  getProductById(req, res);
});

router.put(
  "/product/update/:id",
  authMiddleware,
  adminRoleMiddleware,
  uploadImage.array("images"),
  (req: Request, res: Response) => {
    updateProduct(req, res);
  }
);

router.put(
  "/product/rate-product/:id",
  authMiddleware,
  (req: Request, res: Response) => {
    rateProduct(req, res);
  }
);

router.delete("/product/delete/:id", (req: Request, res: Response) => {
  deleteProduct(req, res);
});

router.delete("/product/delete-all", (req: Request, res: Response) => {
  deleteAllProducts(req, res);
});

export default router;
