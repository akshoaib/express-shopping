import express, { Request, Response, NextFunction } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryByName,
  getCategoryDropdown,
} from "../controllers/category.controller";
import { uploadImage } from "../utils";

const router = express.Router();

router.post(
  "/category/create",
  uploadImage.single("image"),
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

router.get(
  "/category/dropdown",
  (req: Request, res: Response, next: NextFunction) => {
    getCategoryDropdown(req, res);
  }
);

export default router;
