const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

function wishlistCollection() {
  return getDB().collection("wishlists");
}

// Get wishlist by user
async function getWishlistByUserId(userId) {
  return await wishlistCollection()
    .find({ userId: String(userId) })
    .sort({ createdAt: -1 })
    .toArray();
}

// Check if product exists in user's wishlist
async function findWishlistItem(userId, productId) {
  return await wishlistCollection().findOne({
    userId: String(userId),
    productId: String(productId),
  });
}

// Add product to wishlist
async function addToWishlist(userId, productId) {
  const existingItem = await findWishlistItem(userId, productId);

  if (existingItem) {
    return existingItem;
  }

  const wishlistItem = {
    userId: String(userId),
    productId: String(productId),
    createdAt: new Date(),
  };

  const result = await wishlistCollection().insertOne(wishlistItem);

  return await wishlistCollection().findOne({
    _id: result.insertedId,
  });
}

// Remove product from wishlist
async function removeFromWishlist(userId, productId) {
  const result = await wishlistCollection().deleteOne({
    userId: String(userId),
    productId: String(productId),
  });

  return result;
}

// Check product in wishlist
async function isInWishlist(userId, productId) {
  const item = await findWishlistItem(userId, productId);

  return !!item;
}

// Remove all wishlist items for a user
async function clearWishlist(userId) {
  return await wishlistCollection().deleteMany({
    userId: String(userId),
  });
}

module.exports = {
  getWishlistByUserId,
  findWishlistItem,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
};