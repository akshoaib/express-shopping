import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/product.route";
import userRoutes from "./routes/user.route";
import categoryRoutes from "./routes/category.route";
import cartRoutes from "./routes/cart.route";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import cors from "cors";
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-live-frontend.com",
];

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://wemircehan3:shoaib@cluster0.emdoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("database connected!"))
  .catch((err: Error) => console.error("database connection error:", err));

app.listen(5000, () => {
  console.log("app running at port 5000");
});

app.use(productRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(addressRoutes);
