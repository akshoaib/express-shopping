"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoleMiddleware = exports.authMiddleware = exports.createSecretToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var createSecretToken = function (user) {
    return jsonwebtoken_1.default.sign(__assign({}, user), process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
};
exports.createSecretToken = createSecretToken;
var authMiddleware = function (req, res, next) {
    var token = req.header("Authorization");
    if (!token) {
        res.status(400).json({ message: "No token, Authorization failed" });
        return;
    }
    try {
        console.log("in auth");
        var decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        console.log({ decoded: decoded });
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.authMiddleware = authMiddleware;
var adminRoleMiddleware = function (req, res, next) {
    try {
        if (req.user.role !== "admin") {
            res.status(400).json({ message: "Authorization failed" });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.adminRoleMiddleware = adminRoleMiddleware;
