"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var product_controller_1 = require("../controllers/product.controller");
var utils_1 = require("../utils");
router.post("/product/create", utils_1.authMiddleware, utils_1.adminRoleMiddleware, function (req, res, next) { return (0, product_controller_1.createProduct)(req, res); });
router.post("/product/get-all", function (req, res) {
    return (0, product_controller_1.getProducts)(req, res);
});
router.get("/product/get/:id", function (req, res) {
    (0, product_controller_1.getProductById)(req, res);
});
router.put("/product/update/:id", function (req, res) {
    (0, product_controller_1.updateProduct)(req, res);
});
router.delete("/product/delete/:id", function (req, res) {
    (0, product_controller_1.deleteProduct)(req, res);
});
exports.default = router;
