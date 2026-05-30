const mongoose = require("mongoose");

const orderItemSchema =
  new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },
  });

const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      orderItems: [
        orderItemSchema,
      ],

      shippingAddress: {
        fullName: {
          type: String,
          required: true,
        },

        mobile: {
          type: String,
          required: true,
        },

        address: {
          type: String,
          required: true,
        },

        city: {
          type: String,
          required: true,
        },

        state: {
          type: String,
          required: true,
        },

        pincode: {
          type: String,
          required: true,
        },

        country: {
          type: String,
          default: "India",
        },
      },

      totalPrice: {
        type: Number,
        required: true,
        default: 0,
      },

      paymentStatus: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Failed",
        ],
        default: "Pending",
      },

      orderStatus: {
        type: String,
        enum: [
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
        default: "Pending",
      },

      razorpayOrderId: {
        type: String,
        default: "",
      },

      razorpayPaymentId: {
        type: String,
        default: "",
      },

      isDelivered: {
        type: Boolean,
        default: false,
      },

      deliveredAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );