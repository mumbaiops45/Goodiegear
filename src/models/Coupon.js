const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Coupon title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    discount: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount cannot be negative"],
    },

    minPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDiscount: {
      type: Number,
      default: null,
    },

    // Valid days: ["Monday","Tuesday",...] — empty means all days
    days: {
      type: [String],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      default: [],
    },

    // Valid time window: "09:00" – "21:00" (24h format, empty = all day)
    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    usageLimit: {
      type: Number,
      default: null,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// AUTO-GENERATE CODE like CPN-1, CPN-2
couponSchema.pre("save", async function () {
  if (!this.code) {
    const count = await mongoose.model("Coupon").countDocuments();
    this.code = `CPN-${count + 1}`;
  }
});

module.exports = mongoose.model("Coupon", couponSchema);
