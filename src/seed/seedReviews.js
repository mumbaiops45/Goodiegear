const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Review = require("../models/Review");
const User = require("../models/User");
const Product = require("../models/Product");

const seedReviews = async () => {
  try {
    await connectDB();

    // FETCH REAL CUSTOMERS AND PRODUCTS FROM DB
    const customers = await User.find({ role: "customer" }).limit(3);
    const products = await Product.find().limit(3);

    if (customers.length === 0) {
      console.log("No customers found. Register some users first.");
      process.exit(0);
    }

    if (products.length === 0) {
      console.log("No products found. Create some products first.");
      process.exit(0);
    }

    const reviewsData = [
      {
        customer: customers[0]._id,
        product: products[0]._id,
        rating: 5,
        comment: "Excellent product! Really happy with the quality.",
        status: "Published",
      },
      {
        customer: customers[1]?._id || customers[0]._id,
        product: products[1]?._id || products[0]._id,
        rating: 4,
        comment: "Good product, fast delivery. Would recommend.",
        status: "Pending",
      },
      {
        customer: customers[2]?._id || customers[0]._id,
        product: products[2]?._id || products[0]._id,
        rating: 3,
        comment: "Average quality. Expected better for the price.",
        status: "Rejected",
      },
    ];

    // DELETE OLD SEED REVIEWS (optional, comment out to keep)
    await Review.deleteMany({});
    console.log("Cleared existing reviews");

    for (const data of reviewsData) {
      const review = new Review(data);
      await review.save(); // triggers auto-code generation
      console.log(`Created: ${review.code} | Rating: ${review.rating} | Status: ${review.status}`);
    }

    console.log("\nReviews seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding reviews:", error.message);
    process.exit(1);
  }
};

seedReviews();
