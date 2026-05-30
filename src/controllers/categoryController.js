// const Category = require("../models/Category");

// // CREATE CATEGORY (Admin only)
// exports.createCategory = async (req, res) => {
//   try {
//     const { name, image, description } = req.body;

//     if (!name) {
//       return res.status(400).json({ success: false, message: "Category name is required" });
//     }

//     const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
//     if (exists) {
//       return res.status(400).json({ success: false, message: "Category already exists" });
//     }

//     const category = await Category.create({ name, image, description });

//     res.status(201).json({
//       success: true,
//       message: "Category created successfully",
//       category,
//     });
//   } catch (error) {
//     console.error("Create category error:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // GET ALL CATEGORIES
// const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();

//     const formattedCategories = categories.map((category) => ({
//       _id: category._id,
//       name: category.name,
//       description: category.description,

//       image: category.image
//         ? `https://goodiegear-2.onrender.com/${category.image}`
//         : null,
//     }));

//     res.json(formattedCategories);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// // exports.getCategories = async (req, res) => {
// //   try {
// //     const categories = await Category.find().sort({ createdAt: -1 });
// //     res.status(200).json({ success: true, categories });
// //   } catch (error) {
// //     console.error("Get categories error:", error);
// //     res.status(500).json({ success: false, message: "Server error", error: error.message });
// //   }
// // };

// // GET SINGLE CATEGORY
// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }
//     res.status(200).json({ success: true, category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // UPDATE CATEGORY (Admin only)
// exports.updateCategory = async (req, res) => {
//   try {
//     const { name, image, description } = req.body;
//     const category = await Category.findByIdAndUpdate(
//       req.params.id,
//       { name, image, description },
//       { new: true, runValidators: true }
//     );
//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }
//     res.status(200).json({ success: true, message: "Category updated", category });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // DELETE CATEGORY (Admin only)
// exports.deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndDelete(req.params.id);
//     if (!category) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }
//     res.status(200).json({ success: true, message: "Category deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// src/controllers/categoryController.js

const Category = require("../models/Category");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const exists = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    const formattedCategories = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      description: category.description,

      image: category.image
        ? `https://goodiegear-2.onrender.com/${category.image}`
        : null,

      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    res.status(200).json({
      success: true,
      categories: formattedCategories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET CATEGORY BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const formattedCategory = {
      _id: category._id,
      name: category.name,
      description: category.description,

      image: category.image
        ? `https://goodiegear-2.onrender.com/${category.image}`
        : null,

      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };

    res.status(200).json({
      success: true,
      category: formattedCategory,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        image,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};