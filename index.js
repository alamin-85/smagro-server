const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

const port = process.env.PORT || 4000;

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin:
      process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(cookieParser());

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SMAGRO Server is running",
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// PRODUCT ROUTES
// ==========================================

app.use("/api/products", productRoutes);

// ==========================================
// ORDER ROUTES
// ==========================================

app.use("/api/orders", orderRoutes);

// ==========================================
// WISHLIST ROUTES
// ==========================================

app.use("/api/wishlist", wishlistRoutes);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Express Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// START SERVER

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    const database = await connectDB();

    if (!database) {
      console.error(
        "SMAGRO server was not started because MongoDB is unavailable."
      );

      return;
    }

    console.log("MongoDB connected successfully.");

    app.listen(port, () => {
      console.log(
        `SMAGRO server running on port ${port}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error?.message || error
    );

    console.error(
      "Please check MongoDB Atlas, DNS, internet connection, and .env."
    );
  }
}

// ==========================================
// START
// ==========================================

startServer();