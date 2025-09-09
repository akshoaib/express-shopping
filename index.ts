import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/product.route";
import userRoutes from "./routes/user.route";
import categoryRoutes from "./routes/category.route";
import cartRoutes from "./routes/cart.route";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import supportRoutes from "./routes/support.routes";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://wardrobewave-by-shiza-rameesha.vercel.app",
      "http://127.0.0.1:8000",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});
app.set("io", io);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://shopping-two-green.vercel.app",
    "https://wardrobewave-by-shiza-rameesha.vercel.app",
    "http://localhost:3000",
    "http://192.168.1.113:3000/",
  ], // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://wemircehan3:shoaib@cluster0.emdoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("database connected!"))
  .catch((err: Error) => console.error("database connection error:", err));

server.listen(5000);

app.use(productRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(addressRoutes);
app.use(supportRoutes);
