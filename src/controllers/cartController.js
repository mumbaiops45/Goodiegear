const Cart = require("../models/Cart");

const Product = require("../models/Product");


// ADD TO CART
exports.addToCart = async (
  req,
  res
) => {
  try {
    const {
      productId,
      quantity,
    } = req.body;

    // CHECK PRODUCT
    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // FIND USER CART
    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // CREATE CART
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    // CHECK EXISTING PRODUCT
    const itemIndex =
      cart.items.findIndex(
        (item) =>
          item.product.toString() ===
          productId
      );

    // UPDATE QUANTITY
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity +=
        quantity;
    } else {
      // ADD NEW ITEM
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.json({
      message:
        "Product added to cart",

      cart,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// GET CART
exports.getCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findOne({
        user: req.user.id,
      }).populate(
        "items.product"
      );

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
};


// REMOVE ITEM
exports.removeCartItem =
  async (req, res) => {
    try {
      const cart =
        await Cart.findOne({
          user: req.user.id,
        });

      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.product.toString() !==
            req.params.productId
        );

      await cart.save();

      res.json({
        message:
          "Item removed from cart",

        cart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };


// CLEAR CART
exports.clearCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findOne({
        user: req.user.id,
      });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};