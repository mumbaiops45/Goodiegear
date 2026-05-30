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
    } = req.body;

    // FIND VENDOR
    const vendor =
      await Vendor.findOne({
        user: req.user.id,
      });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    // CREATE PRODUCT
    const product =
      await Product.create({
        vendor: vendor._id,

        title,
        description,
        price,
        discountPrice,
        stock,
        category,
        brand,

        images: [],
      });

    res.status(201).json({
      message:
        "Product created successfully",

      product,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// GET ALL PRODUCTS
exports.getProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find({
        isActive: true,
      })
        .populate(
          "vendor",
          "shopName"
        )
        .sort({
          createdAt: -1,
        });

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
        message:
          "Product not found",
      });
    }

    // FIND VENDOR
    const vendor =
      await Vendor.findOne({
        user: req.user.id,
      });

    // CHECK OWNER
    if (
      product.vendor.toString() !==
      vendor._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized",
      });
    }

    // UPDATE PRODUCT
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json({
      message:
        "Product updated successfully",

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

    // FIND VENDOR
    const vendor =
      await Vendor.findOne({
        user: req.user.id,
      });

    // CHECK OWNER
    if (
      product.vendor.toString() !==
      vendor._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized",
      });
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

exports.getVendorProducts =
  async (req, res) => {
    try {

      const products =
        await Product.find({
          vendor: req.user.id,
        });

      res.json(products);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch vendor products",
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

      // FIND VENDOR
      const vendor =
        await Vendor.findOne({
          user: req.user.id,
        });

      // CHECK OWNER
      if (
        product.vendor.toString() !==
        vendor._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Not authorized",
        });
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