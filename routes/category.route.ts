import express, { Request, Response, NextFunction } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryByName,
} from "../controllers/category.controller";

const router = express.Router();

router.post(
  "/category/create",
  (req: Request, res: Response, next: NextFunction) => {
    createCategory(req, res);
  }
);

router.get(
  "/category/get-by-name",
  (req: Request, res: Response, next: NextFunction) => {
    getCategoryByName(req, res);
  }
);

router.get(
  "/category/get-all",
  (req: Request, res: Response, next: NextFunction) => {
    getAllCategories(req, res);
  }
);

export default router;
