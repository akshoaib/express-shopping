"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var product_route_1 = __importDefault(require("./routes/product.route"));
var user_route_1 = __importDefault(require("./routes/user.route"));
var category_route_1 = __importDefault(require("./routes/category.route"));
var cart_route_1 = __importDefault(require("./routes/cart.route"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
mongoose_1.default
    .connect(process.env.MONGO_URI ||
    "mongodb+srv://wemircehan3:shoaib@cluster0.emdoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(function () { return console.log("database connected!"); })
    .catch(function (err) { return console.error("database connection error:", err); });
app.listen(5000, function () {
    console.log("app running at port 5000");
});
app.use(product_route_1.default);
app.use(user_route_1.default);
app.use(category_route_1.default);
app.use(cart_route_1.default);
