const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },

    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },

    placement: {
      type: String,
      enum: ["Home Hero", "Category Top", "Sidebar", "Checkout"],
      default: "Home Hero",
    },

    active: {
      type: Boolean,
      default: true,
    },

    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// AUTO-GENERATE CODE like B-1, B-2
bannerSchema.pre("save", async function () {
  if (!this.code) {
    const count = await mongoose.model("Banner").countDocuments();
    this.code = `B-${count + 1}`;
  }
});

module.exports = mongoose.model("Banner", bannerSchema);
