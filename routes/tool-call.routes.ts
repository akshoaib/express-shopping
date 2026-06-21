import express from "express";
import { toolCalling } from "../controllers/tool-call.controller";

const router = express.Router();

// ensure the controller matches Express's RequestHandler signature
router.post("/tool-call", toolCalling as express.RequestHandler);
export default router;
