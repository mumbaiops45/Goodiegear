const User = require("../models/User");

const Vendor = require("../models/Vendor");

const Product = require("../models/Product");

const Order = require("../models/Order");

const cloudinary = require("../config/cloudinary");

const bcrypt = require("bcryptjs");

// GET ADMIN PROFILE
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password -refreshToken");

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE ADMIN PROFILE
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, email, password } = req.body;

    if (name) admin.name = name;
    if (email) admin.email = email;

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    // UPLOAD PHOTO TO CLOUDINARY
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gugigere-admin",
      });
      admin.profilePhoto = result.secure_url;
    }

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profilePhoto: admin.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


// GET ALL CUSTOMERS
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.json({ total: customers.length, customers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

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
exports.getAllOrders = async (req, res) => {
  try {
    const filter = {};

    if (req.query.orderStatus) filter.orderStatus = req.query.orderStatus;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("orderItems.product", "title price images")
      .sort({ createdAt: -1 });

    res.json({ total: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE ORDER STATUS (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "Order is already delivered",
      });
    }

    if (orderStatus === "Delivered" && !order.stockDeducted) {
      for (const item of order.orderItems) {
        const result = await Product.updateOne(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(400).json({
            message: "Not enough stock available",
          });
        }
      }

      order.stockDeducted = true;
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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