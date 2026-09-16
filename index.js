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

const port =
  process.env.PORT || 4000;

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:3000",

    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(cookieParser());

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "SMAGRO Server is running",
  });
});

/* =========================
   AUTH ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    await connectDB();

    app.listen(
      port,
      () => {
        console.log(
          `SMAGRO server running on port ${port}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );
  }
}

startServer();