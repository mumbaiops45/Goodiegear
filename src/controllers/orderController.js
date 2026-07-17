const Order = require("../models/Order");

const Cart = require("../models/Cart");

const Product = require("../models/Product");

const Vendor = require("../models/Vendor");

const razorpay = require(
  "../config/razorpay"
);


// CREATE ORDER
// exports.createOrder = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       shippingAddress,
//     } = req.body;

//     // GET USER CART
//     const cart =
//       await Cart.findOne({
//         user: req.user.id,
//       }).populate(
//         "items.product"
//       );

//     if (
//       !cart ||
//       cart.items.length === 0
//     ) {
//       return res.status(400).json({
//         message: "Cart is empty",
//       });
//     }

//     // CREATE ORDER ITEMS
//     const orderItems = [];

//     let totalPrice = 0;

//     for (const item of cart.items) {
//       const product =
//         item.product;

//       const vendor =
//         await Vendor.findById(
//           product.vendor
//         );

//       orderItems.push({
//         product: product._id,

//         vendor: vendor._id,

//         quantity: item.quantity,

//         price: product.price,
//       });

//       totalPrice +=
//         product.price *
//         item.quantity;
//     }

//     // CREATE ORDER
//     const order =
//       await Order.create({
//         user: req.user.id,

//         orderItems,

//         shippingAddress,

//         totalPrice,
//       });

//     // CLEAR CART
//     cart.items = [];

//     await cart.save();

//     res.status(201).json({
//       message:
//         "Order placed successfully",

//       order,
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      totalPrice,
    } = req.body;

    // VALIDATION
    if (
      !orderItems ||
      orderItems.length === 0
    ) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    // BUILD ORDER ITEMS
    const formattedItems = [];

    for (const item of orderItems) {
      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      formattedItems.push({
        product: product._id,
        vendor: product.vendor,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // CREATE ORDER
    const order =
      await Order.create({
        user: req.user.id,

        orderItems:
          formattedItems,

        shippingAddress,

        totalPrice,
      });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user.id,
      })
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


// GET SINGLE ORDER
exports.getSingleOrder =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        )
          .populate(
            "orderItems.product"
          )
          .populate(
            "user",
            "name email"
          );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  };


// UPDATE ORDER STATUS
// orderController.js (or similar)

// ============================================================
// UPDATE ORDER STATUS – with stock deduction (no transaction)
// ============================================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status || req.body.orderStatus;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "Order is already delivered",
      });
    }

    if (status === "Delivered" && !order.stockDeducted) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (product) {
          const result = await Product.updateOne(
            {
              _id: product._id,
              stock: { $gte: item.quantity },
            },
            {
              $inc: {
                stock: -item.quantity,
              },
            }
          );

          if (result.modifiedCount === 0) {
            console.warn(
              `⚠️ Not enough stock for product ${product._id}`
            );
          }
        }
      }

      order.stockDeducted = true;
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
    }

    if (order.orderStatus !== status) {
      order.orderStatus = status;
      await order.save();
    }

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
  exports.getVendorDashboard =
  async (req, res) => {
    try {
      const vendor =
        await Vendor.findOne({
          user: req.user.id,
        });

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      // PRODUCTS
      const totalProducts =
        await Product.countDocuments({
          vendor: vendor._id,
        });

      // ORDERS
      const orders =
        await Order.find({
          "orderItems.vendor":
            vendor._id,
        });

      const totalOrders =
        orders.length;

      // EARNINGS
      let totalEarnings = 0;

      orders.forEach((order) => {
        order.orderItems.forEach(
          (item) => {
            if (
              item.vendor.toString() ===
              vendor._id.toString()
            ) {
              totalEarnings +=
                item.price *
                item.quantity;
            }
          }
        );
      });

      res.json({
        totalProducts,
        totalOrders,
        totalEarnings,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch dashboard",
        error:
          error.message,
      });
    }
  };


// CREATE RAZORPAY ORDER
exports.createPayment =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      const options = {
        amount:
          order.totalPrice * 100,

        currency: "INR",

        receipt:
          order._id.toString(),
      };

      const razorpayOrder =
        await razorpay.orders.create(
          options
        );

      order.razorpayOrderId =
        razorpayOrder.id;

      await order.save();

      res.json({
        razorpayOrder,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };


// VERIFY PAYMENT
exports.verifyPayment =
  async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
      } = req.body;

      const order =
        await Order.findOne({
          razorpayOrderId:
            razorpay_order_id,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.paymentStatus =
        "Paid";

      order.razorpayPaymentId =
        razorpay_payment_id;

      order.orderStatus =
        "Processing";

      await order.save();

      res.json({
        message:
          "Payment verified",

        order,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };


// DUMMY PAYMENT
exports.dummyPayment =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      order.paymentStatus =
        "Paid";

      order.orderStatus =
        "Processing";

      order.razorpayOrderId =
        "dummy_order";

      order.razorpayPaymentId =
        "dummy_payment";

      await order.save();

      res.json({
        message:
          "Dummy payment successful",

        order,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // GET VENDOR ORDERS
exports.getVendorOrders =
  async (req, res) => {
    try {
      // FIND VENDOR
      const vendor =
        await Vendor.findOne({
          user: req.user.id,
        });

      if (!vendor) {
        return res.status(404).json({
          message:
            "Vendor not found",
        });
      }

      // FIND ORDERS
      const orders =
        await Order.find({
          "orderItems.vendor":
            vendor._id,
        })
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


  // GET VENDOR EARNINGS
exports.getVendorEarnings =
  async (req, res) => {
    try {
      const vendor =
        await Vendor.findOne({
          user: req.user.id,
        });

      if (!vendor) {
        return res.status(404).json({
          message:
            "Vendor not found",
        });
      }

      // GET PAID ORDERS
      const orders =
        await Order.find({
          "orderItems.vendor":
            vendor._id,

          paymentStatus: "Paid",
        });

      let totalEarnings = 0;

      orders.forEach((order) => {
        order.orderItems.forEach(
          (item) => {
            if (
              item.vendor.toString() ===
              vendor._id.toString()
            ) {
              totalEarnings +=
                item.price *
                item.quantity;
            }
          }
        );
      });

      res.json({
        totalOrders:
          orders.length,

        totalEarnings,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // GET ALL ORDERS – Admin only
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch all orders',
      error: error.message
    });
  }
};