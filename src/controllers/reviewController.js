const Review = require("../models/Review");
const Order = require("../models/Order");

// GET ALL REVIEWS (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .populate("customer", "name email")
      .populate("product", "title")
      .sort({ createdAt: -1 });

    res.json({ total: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REVIEWS BY PRODUCT (public)
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: "Published",
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.json({ total: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE REVIEW
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("customer", "name email")
      .populate("product", "title");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE REVIEW (customer)
exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // Validate input
    if (!product || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product and rating are required.",
      });
    }

    // Check if user purchased the product and it is delivered
    const purchasedOrder = await Order.findOne({
      user: req.user.id,
      orderStatus: "Delivered",
      "orderItems.product": product,
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        success: false,
        message:
          "You can review only products that have been delivered to you.",
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      customer: req.user.id,
      product,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // Create review
    const review = await Review.create({
      customer: req.user.id,
      product,
      rating,
      comment,
      status: "Pending",
    });

    await review.populate("customer", "name");
    await review.populate("product", "title");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully. Waiting for admin approval.",
      review,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE REVIEW (owner only)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    review.status = "Pending";
    await review.save();

    res.json({ message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE REVIEW (owner or admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE REVIEW (admin)
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "Published" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review approved", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REJECT REVIEW (admin)
exports.rejectReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review rejected", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PUBLISHED REVIEWS (public – for testimonials)
exports.getPublishedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "Published" })
      .populate("customer", "name email avatar location")
      .populate("product", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
