# 🛒 MERN Stack eCommerce Backend

This is the **Express.js backend** for my full-stack MERN (MongoDB, Express, React, Node.js) eCommerce web application. It handles API requests, user authentication, product and category management, and integrates with MongoDB for data storage.

## 🌐 Frontend Repository

👉 [React Frontend Repository](https://github.com/akshoaib/shopping)

---

## 🚀 Features

- 🔐 JWT-based authentication & authorization
- 🛍️ Product, Category, and User CRUD APIs
- 🧾 Order placement & history APIs *(if implemented)*
- 🗂️ File/image upload support *(e.g., product images)*
- 📦 RESTful API structure with proper error handling
- ✅ Input validation using express-validator / custom middleware
- ⚙️ Environment configuration via `.env`
- 📄 MongoDB Aggregation & Query optimization


---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Tokens)**
- **bcrypt.js** for password hashing
- **Multer / Cloudinary** for file uploads *(if used)*
- **dotenv** for environment variables

---

## 📁 Folder Structure

```bash
.
├── config/             # MongoDB connection & environment setup
├── controllers/        # Business logic
├── models/             # Mongoose models
├── routes/             # API route definitions
├── middleware/         # Auth, error handlers, validators
├── utils/              # Utility functions (e.g., token generation)
├── uploads/            # Uploaded files (if using local upload)
├── .env
├── index.js  # Entry point
└── package.json
