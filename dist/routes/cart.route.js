"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var utils_1 = require("../utils");
var cart_controller_1 = require("../controllers/cart.controller");
var router = express_1.default.Router();
router.post("/cart/add-to-cart", utils_1.authMiddleware, function (req, res, next) {
    (0, cart_controller_1.addToCart)(req, res);
});
router.put("/cart/remove-cart-items", utils_1.authMiddleware, cart_controller_1.removeCartItems);
router.get("/cart/get-cart", utils_1.authMiddleware, cart_controller_1.getCartItems);
exports.default = router;
