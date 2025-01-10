const jwt = require("jsonwebtoken");
const createSecretToken = (user) => {
  return jwt.sign({ ...user }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
};

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(400).json({ message: "No token, Authorization failed" });
  }
  try {
    console.log("in auth");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log({ decoded });

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const adminRoleMiddleware = (req, res, next) => {
  try {
    console.log("heyy::", req.user.role);
    if (req.user.role !== "admin") {
      return res.status(400).json({ message: "Authorization failed" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createSecretToken,
  authMiddleware,
  adminRoleMiddleware,
};
