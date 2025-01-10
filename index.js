const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const productRoutes = require("./routes/product.route");
const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");
const cartRoutes = require("./routes/cart.route");

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://wemircehan3:shoaib@cluster0.emdoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("database connected!"));

app.listen(5000, () => {
  console.log("app running at port 5000");
});

app.use(productRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
