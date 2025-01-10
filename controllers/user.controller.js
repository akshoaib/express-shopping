const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../utils");

const userSignup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  console.log(req.body);
  const userExists = await User.findOne({ email });
  console.log({ userExists });

  if (userExists) {
    return res.json({ message: "user already exists" });
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });
  const token = createSecretToken({ _id: user._id, role: user.role });
  res.status(201).json({
    message: "User signed in successfully",
    success: true,
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("ffound::", user);

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log({ isMatch });

  if (!isMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = createSecretToken({ _id: user._id, role: user.role });
  res.status(201).json({
    message: "User signed in successfully",
    success: true,
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token,
  });
};

module.exports = {
  userSignup,
  login,
};
