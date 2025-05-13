import { Router, Request, Response } from "express";
import {
  getUserReport,
  login,
  userSignup,
} from "../controllers/user.controller";
import { adminRoleMiddleware, authMiddleware } from "../utils";

const router: Router = Router();

router.post("/user/create", (req: Request, res: Response) => {
  userSignup(req, res);
});
router.post("/user/login", (req: Request, res: Response) => {
  login(req, res);
});

router.get("/user/hey", (req: Request, res: Response) => {
  res.send("Hey");
});

router.get(
  "/user/get-user-report",
  authMiddleware,
  adminRoleMiddleware,
  (req: Request, res: Response) => {
    getUserReport(req, res);
  }
);

export default router;
