"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItems = exports.removeCartItems = exports.addToCart = void 0;
var Cart = require("../models/cart.model");
var Product = require("../models/product.model");
var addToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, productId_1, quantity, user, productExists, cart, newCart, items, updatedCart, newCart, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 11, , 12]);
                _a = req.body, productId_1 = _a.productId, quantity = _a.quantity;
                if (!req.user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not authenticated" })];
                }
                user = req.user._id;
                return [4 /*yield*/, Product.findById(productId_1)];
            case 1:
                productExists = _c.sent();
                console.log({ productExists: productExists }, productExists === null || productExists === void 0 ? void 0 : productExists.quantity);
                if (!(productExists && productExists.quantity >= quantity)) return [3 /*break*/, 9];
                return [4 /*yield*/, Cart.findOne({ user: user })];
            case 2:
                cart = _c.sent();
                if (!!cart) return [3 /*break*/, 4];
                return [4 /*yield*/, Cart.create({
                        user: user,
                        cartItems: [{ product: productId_1, quantity: quantity }],
                    })];
            case 3:
                newCart = _c.sent();
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: "Cart created successfully", cart: newCart })];
            case 4:
                items = (_b = cart.cartItems) === null || _b === void 0 ? void 0 : _b.find(function (item) {
                    return item.product && item.product.toString() === productId_1.toString();
                });
                console.log({ items: items });
                if (!items) return [3 /*break*/, 6];
                return [4 /*yield*/, Cart.findOneAndUpdate({
                        user: user,
                        "cartItems.product": productId_1,
                    }, {
                        $set: {
                            "cartItems.$.quantity": quantity,
                        },
                    }, { new: true })];
            case 5:
                updatedCart = _c.sent();
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: "Cart updated successfully", updatedCart: updatedCart })];
            case 6:
                console.log("elsees run");
                return [4 /*yield*/, Cart.findOneAndUpdate({ user: user }, {
                        $push: {
                            cartItems: {
                                product: productId_1,
                                quantity: quantity,
                            },
                        },
                    }, { new: true })];
            case 7:
                newCart = _c.sent();
                console.log({ newCart: newCart });
                return [2 /*return*/, res
                        .status(201)
                        .json({ message: "Cart updated successfully", newCart: newCart })];
            case 8: return [3 /*break*/, 10];
            case 9: return [2 /*return*/, res
                    .status(400)
                    .json({ message: "Product not available or insufficient quantity" })];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_1 = _c.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.addToCart = addToCart;
var getCartItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, cart, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!req.user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not authenticated" })];
                }
                userId = req.user._id;
                console.log({ userId: userId });
                return [4 /*yield*/, Cart.find({ user: userId }, { "cartItems._id": 0 })];
            case 1:
                cart = _b.sent();
                console.log(cart);
                return [2 /*return*/, res.status(200).json({ cart: ((_a = cart[0]) === null || _a === void 0 ? void 0 : _a.cartItems) || [] })];
            case 2:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCartItems = getCartItems;
var removeCartItems = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, updatedCart, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = req.query.productId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (!req.user) {
                    return [2 /*return*/, res.status(400).json({ message: "User not authenticated" })];
                }
                return [4 /*yield*/, Cart.findOneAndUpdate({ user: req.user._id }, {
                        $pull: {
                            cartItems: {
                                product: productId,
                            },
                        },
                    }, { new: true })];
            case 2:
                updatedCart = _a.sent();
                console.log({ updatedCart: updatedCart });
                return [2 /*return*/, res.status(200).json({ message: "Items removed", updatedCart: updatedCart })];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeCartItems = removeCartItems;
