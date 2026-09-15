const express = require("express");
const router = express.Router();

const {
  getWishlistByUserId,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
} = require("../models/Wishlist");

const { authMiddleware } = require("../middleware/authMiddleware");

// ==========================================
// GET MY WISHLIST
// GET /api/wishlist
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await getWishlistByUserId(userId);

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load wishlist.",
    });
  }
});

// ==========================================
// CHECK WISHLIST
// GET /api/wishlist/check/:productId
// ==========================================
router.get("/check/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const exists = await isInWishlist(userId, productId);

    res.json({
      success: true,
      isInWishlist: exists,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check wishlist.",
    });
  }
});

// ==========================================
// ADD TO WISHLIST
// POST /api/wishlist
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const wishlistItem = await addToWishlist(userId, productId);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist.",
      wishlistItem,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist.",
    });
  }
});

// ==========================================
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:productId
// ==========================================
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const result = await removeFromWishlist(userId, productId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist.",
      });
    }

    res.json({
      success: true,
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist.",
    });
  }
});

// ==========================================
// CLEAR WISHLIST
// DELETE /api/wishlist
// ==========================================
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await clearWishlist(userId);

    res.json({
      success: true,
      message: "Wishlist cleared successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist.",
    });
  }
});

module.exports = router;