// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");

// require("dotenv").config();

// const connectDB = require("./src/config/db");

// const authRoutes = require("./src/routes/authRoutes");
// const vendorRoutes = require("./src/routes/vendorRoutes");
// const productRoutes = require("./src/routes/productRoutes");
// const cartRoutes = require("./src/routes/cartRoutes");
// const orderRoutes = require("./src/routes/orderRoutes");
// const adminRoutes = require("./src/routes/adminRoutes");
// const categoryRoutes = require("./src/routes/categoryRoutes");
// const wishlistRoutes =require( "./src/routes/wishlistRoutes");

// const app = express();

// // CONNECT DATABASE
// connectDB();  

// // CORS
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://gudigere.netlify.app",
//     ],
//     credentials: true,
//   })
// );

// // BODY PARSER
// app.use(express.json());

// // COOKIE PARSER
// app.use(cookieParser());

// // STATIC UPLOADS
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// // TEST ROUTE
// app.get("/", (req, res) => {
//   res.send("API Running");
// });

// // ROUTES
// app.use("/api/auth", authRoutes);
// app.use("/api/vendors", vendorRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/wishlist",wishlistRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer"); // Add multer for file uploads

require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const vendorRoutes = require("./src/routes/vendorRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");


const app = express();

// CONNECT DATABASE
connectDB();

// ========== CORS ==========
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://goodiegear.netlify.app",
    ],
    credentials: true,
  })
);

// ========== BODY PARSERS with INCREASED LIMIT ==========
// Increase limit to handle large Base64 images (50MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// COOKIE PARSER
app.use(cookieParser());

// ========== STATIC UPLOADS ==========
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========== MULTER CONFIGURATION ==========
// Ensure the uploads/categories directory exists
const fs = require("fs");
const categoriesDir = path.join(__dirname, "uploads/categories");
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
}

// Configure storage for category images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/categories/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer upload middleware (single file field named "image")
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Make upload available to route handlers via req.app.locals or export
app.locals.upload = upload;

// ========== TEST ROUTE ==========
app.get("/", (req, res) => {
  res.send("API Running");
});

// ========== ROUTES ==========
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ========== ERROR HANDLER FOR MULTER (optional) ==========
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "File too large (max 5MB)" });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;