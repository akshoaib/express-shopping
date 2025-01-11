"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var category_controller_1 = require("../controllers/category.controller");
var router = express_1.default.Router();
router.post("/category/create", function (req, res, next) {
    (0, category_controller_1.createCategory)(req, res);
});
router.get("/category/get-by-name", function (req, res, next) {
    (0, category_controller_1.getCategoryByName)(req, res);
});
router.get("/category/get-all", function (req, res, next) {
    (0, category_controller_1.getAllCategories)(req, res);
});
exports.default = router;
