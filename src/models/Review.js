const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Published", "Pending", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// AUTO-GENERATE CODE like R-1, R-2
reviewSchema.pre("save", async function () {
  if (!this.code) {
    const count = await mongoose.model("Review").countDocuments();
    this.code = `R-${count + 1}`;
  }
});

module.exports = mongoose.model("Review", reviewSchema);
