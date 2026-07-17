const Product = require("../models/Product");

const Vendor = require("../models/Vendor");

const cloudinary = require(
  "../config/cloudinary"
);


// CREATE PRODUCT
exports.createProduct = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      vendor: vendorIdFromBody,
      isDealOfTheDay,
      dealPrice,
      dealStartDate,
      dealEndDate,
    } = req.body;

    let vendorId;

    if (req.user.role === "admin") {
      // ADMIN: vendor ID must be provided in body
      if (!vendorIdFromBody) {
        return res.status(400).json({
          message: "Vendor ID is required",
        });
      }
      vendorId = vendorIdFromBody;
    } else {
      // VENDOR: look up their vendor record
      const vendor = await Vendor.findOne({ user: req.user.id });

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }
      vendorId = vendor._id;
    }

    // UPLOAD IMAGE IF PROVIDED
    let images = [];
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gugigere-products",
      });
      images = [result.secure_url];
    }

    // CREATE PRODUCT
    const product = await Product.create({
      vendor: vendorId,
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      images,
      isDealOfTheDay,
      dealPrice,
      dealStartDate,
      dealEndDate,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// GET ALL PRODUCTS
// exports.getProducts = async (
//   req,
//   res
// ) => {
//   try {
//     const products =
//       await Product.find({
//         isActive: true,
//       })
//         .populate(
//           "vendor",
//           "shopName"
//         )
//         .sort({
//           createdAt: -1,
//         });

//     res.json(products);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { age, search, category } = req.query;

    const filter = {
      isActive: true,
    };

    // Age Filter
    if (age) {
      switch (age) {
        case "0-2":
          filter.age = { $gte: 0, $lte: 2 };
          break;
        case "3-5":
          filter.age = { $gte: 3, $lte: 5 };
          break;
        case "6-8":
          filter.age = { $gte: 6, $lte: 8 };
          break;
        case "9-12":
          filter.age = { $gte: 9, $lte: 12 };
          break;
        case "12plus":
          filter.age = { $gte: 12 };
          break;
      }
    }

    // Search Filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Category Filter
    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    const products = await Product.find(filter)
      .populate("vendor", "shopName")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET SINGLE PRODUCT
exports.getSingleProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        ).populate(
          "vendor",
          "shopName"
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json(error);
    }
  };


// UPDATE PRODUCT
exports.updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ADMIN can update any product directly
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user: req.user.id });

      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({
          message: "Not authorized",
        });
      }
    }

    // UPDATE PRODUCT
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    // Admins can delete any product; vendors can only delete their own
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user: req.user.id });

      if (
        !vendor ||
        product.vendor.toString() !== vendor._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    // DELETE PRODUCT
    await product.deleteOne();

    res.json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      user: req.user.id,
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const products = await Product.find({
      vendor: vendor._id,
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vendor products",
      error,
    });
  }
};

// UPLOAD PRODUCT IMAGE
exports.uploadProductImage =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // CHECK OWNER (skip for admin)
      if (req.user.role !== "admin") {
        const vendor = await Vendor.findOne({ user: req.user.id });

        if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
          return res.status(403).json({ message: "Not authorized" });
        }
      }

      // CHECK FILE
      if (!req.file) {
        return res.status(400).json({
          message:
            "No image uploaded",
        });
      }

      // UPLOAD IMAGE TO CLOUDINARY
      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder:
              "gugigere-products",
          }
        );

      // SAVE IMAGE URL
      product.images.push(
        result.secure_url
      );

      await product.save();

      res.json({
        message:
          "Image uploaded successfully",

        image:
          result.secure_url,

        product,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };

exports.createProductReview =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      const review = {
        user: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment,
      };

      product.reviews.push(review);

      product.numReviews =
        product.reviews.length;

      product.rating =
        product.reviews.reduce(
          (acc, item) =>
            acc + item.rating,
          0
        ) / product.reviews.length;

      await product.save();

      res.status(201).json({
        message:
          "Review added successfully",
      });

    } catch (error) {
      res.status(500).json(error);
    }
  };
// GET REVIEWS BY PRODUCT ID
exports.getProductReviews =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json(
        product.reviews || []
      );

    } catch (error) {
      res.status(500).json(error);
    }
  };


// GET ALL REVIEWS
exports.getAllReviews =
  async (req, res) => {
    try {
      const products =
        await Product.find(
          {},
          "title reviews"
        );

      const reviews = [];

      products.forEach(
        (product) => {
          product.reviews?.forEach(
            (review) => {
              reviews.push({
                productId:
                  product._id,
                productTitle:
                  product.title,
                ...review.toObject(),
              });
            }
          );
        }
      );

      res.json(reviews);

    } catch (error) {
      res.status(500).json(error);
    }
  };

  exports.getDealOfTheDay = async (req, res) => {
  try {

    const today = new Date();

    const products = await Product.find({
      isDealOfTheDay: true,
      isActive: true,
      dealStartDate: { $lte: today },
      dealEndDate: { $gte: today },
      stock: { $gt: 0 }
    }).populate("vendor", "shopName");

    res.json(products);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};