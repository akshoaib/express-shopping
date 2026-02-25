import express, { Application } from "express";
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
import { errorHandler } from "./middlewares/errorMiddleware";
import { errorLogger, requestLogger } from "./logger";

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


app.use(requestLogger);

app.use("/uploads", express.static("uploads"));

const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://shopping-two-green.vercel.app",
    "https://wardrobewave-by-shiza-rameesha.vercel.app",
    "http://localhost:3000",
    "http://192.168.1.113:3000",
  ], // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options
const dns = require('node:dns/promises');   // or just require('dns') in older Node
dns.setServers(['1.1.1.1', '8.8.8.8']);
mongoose
  .connect("mongodb+srv://wemircehan3:3qZZn9NCtiGBzkP6@cluster0.emdoe.mongodb.net")

  .then(() => console.log("database connected!"))
  .catch((err: Error) => console.error("database connection error:", err));
// test?retryWrites=true&w=majority
server.listen(5000);
console.log("Server is running on port 5000");
app.use(errorLogger);


app.use(productRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(addressRoutes);
app.use(supportRoutes);

app.use(errorHandler)
