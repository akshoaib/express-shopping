const express = require("express");
const { userSignup, login } = require("../controllers/user.controller");
const router = express.Router();
router.post("/user/create", userSignup);
router.post("/user/login", login);

module.exports = router;
