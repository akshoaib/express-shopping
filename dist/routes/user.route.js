"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var router = (0, express_1.Router)();
router.post("/user/create", function (req, res) {
    (0, user_controller_1.userSignup)(req, res);
});
router.post("/user/login", function (req, res) {
    (0, user_controller_1.login)(req, res);
});
exports.default = router;
