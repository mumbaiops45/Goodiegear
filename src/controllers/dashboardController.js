const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Review = require("../models/Review");

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// GET /api/dashboard/stats — top-level KPI cards
exports.getStats = async (req, res) => {
  try {
    const [revenueAgg, totalOrders, totalCustomers, activeVendors] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Vendor.countDocuments({ isApproved: true }),
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: [
        { key: "revenue", label: "Total Revenue", value: inr(revenue) },
        { key: "orders", label: "Total Orders", value: totalOrders.toLocaleString("en-IN") },
        { key: "customers", label: "Customers", value: totalCustomers.toLocaleString("en-IN") },
        { key: "vendors", label: "Active Vendors", value: activeVendors.toLocaleString("en-IN") },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/dashboard/overview — charts and widgets data
exports.getOverview = async (req, res) => {
  try {
    const [ordersByStatus, productsByCategory, pendingReviews, recentOrders, salesAgg] =
      await Promise.all([
        Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
        Product.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Review.countDocuments({ status: "Pending" }),
        Order.find()
          .sort("-createdAt")
          .limit(6)
          .populate("user", "name email"),
        // Revenue + order count grouped by month
        Order.aggregate([
          {
            $group: {
              _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
              sales: { $sum: "$totalPrice" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { "_id.y": 1, "_id.m": 1 } },
        ]),
      ]);

    const salesByMonth = salesAgg.slice(-12).map((s) => ({
      month: MONTHS[(s._id.m || 1) - 1],
      sales: s.sales,
      orders: s.orders,
    }));

    res.json({
      success: true,
      data: {
        ordersByStatus: ordersByStatus.map((o) => ({ status: o._id, count: o.count })),
        productsByCategory: productsByCategory.map((p) => ({ name: p._id, value: p.count })),
        salesByMonth,
        pendingReviews,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET /api/dashboard/reports — report KPIs + top products
exports.getReports = async (req, res) => {
  try {
    const [orderStats, soldAgg] = await Promise.all([
      Order.aggregate([
        { $group: { _id: null, avg: { $avg: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      // Units sold per product from order line items
      Order.aggregate([
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.product",
            sold: { $sum: "$orderItems.quantity" },
            revenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      ]),
    ]);

    let topProducts = soldAgg.map((p) => ({
      name: p.productInfo?.title || "Unknown",
      sold: p.sold,
      revenue: p.revenue,
    }));

    // No sales yet → fall back to best-stocked products
    if (topProducts.length === 0) {
      const byStock = await Product.find().sort("-stock").limit(5).select("title stock");
      topProducts = byStock.map((p) => ({ name: p.title, sold: p.stock, revenue: 0 }));
    }

    res.json({
      success: true,
      data: {
        avgOrderValue: inr(Math.round(orderStats[0]?.avg || 0)),
        totalOrders: orderStats[0]?.count || 0,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
