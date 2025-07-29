import express from "express";
import { chatWithBot } from "../controllers/chatbot.controller";

const router = express.Router();

router.post("/chatbot", chatWithBot);
export default router;
