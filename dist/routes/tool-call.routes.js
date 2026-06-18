"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tool_call_controller_1 = require("../controllers/tool-call.controller");
const router = express_1.default.Router();
router.post("/tool-call", tool_call_controller_1.toolCalling);
exports.default = router;
