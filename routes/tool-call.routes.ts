import express from "express";
import { toolCalling } from "../controllers/tool-call.controller";

const router = express.Router();

router.post("/tool-call", toolCalling);
export default router;
