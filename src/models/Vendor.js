const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopName: {
      type: String,
      required: true,
    },

    shopDescription: {
      type: String,
    },

    shopLogo: {
      type: String,
      default: "",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Vendor",
  vendorSchema
);