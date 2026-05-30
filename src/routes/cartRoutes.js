const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
} = require(
  "../controllers/cartController"
);


// ADD TO CART
router.post(
  "/",
  authMiddleware,
  addToCart
);


// GET CART
router.get(
  "/",
  authMiddleware,
  getCart
);


// REMOVE ITEM
router.delete(
  "/:productId",
  authMiddleware,
  removeCartItem
);


// CLEAR CART
router.delete(
  "/",
  authMiddleware,
  clearCart
);

module.exports = router;