const User = require("../models/User");

const Vendor = require("../models/Vendor");

const Product = require("../models/Product");

const Order = require("../models/Order");


// DASHBOARD STATS
exports.getDashboardStats =
  async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments();

      const totalVendors =
        await Vendor.countDocuments({
          isApproved: true,
        });

      const totalProducts =
        await Product.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      // PAID ORDERS
      const paidOrders =
        await Order.find({
          paymentStatus: "Paid",
        });

      let totalRevenue = 0;

      paidOrders.forEach((order) => {
        totalRevenue +=
          order.totalPrice;
      });

      res.json({
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };


// GET ALL USERS
exports.getAllUsers =
  async (req, res) => {
    try {
      const users =
        await User.find().sort({
          createdAt: -1,
        });

      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  };


// GET ALL PRODUCTS
exports.getAllProducts =
  async (req, res) => {
    try {
      const products =
        await Product.find()
          .populate(
            "vendor",
            "shopName"
          )
          .sort({
            createdAt: -1,
          });

      res.json(products);
    } catch (error) {
      res.status(500).json(error);
    }
  };


// GET ALL ORDERS
exports.getAllOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "orderItems.product"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // DELETE USER
exports.deleteUser =
  async (req, res) => {
    try {

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "User deleted successfully",
      });

    } catch (error) {
      res.status(500).json(
        error
      );
    }
  };