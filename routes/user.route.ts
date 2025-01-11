import { Router, Request, Response } from "express";
import { login, userSignup } from "../controllers/user.controller";

const router: Router = Router();

router.post("/user/create", (req: Request, res: Response) => {
  userSignup(req, res);
});
router.post("/user/login", (req: Request, res: Response) => {
  login(req, res);
});

export default router;
