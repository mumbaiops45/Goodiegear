
// // const express = require("express");
// // const cors = require("cors");
// // const cookieParser = require("cookie-parser");
// // require("dotenv").config();
// // // const authRoutes = require("./routes/authRoutes");
// // const authRoutes = require("./src/routes/authRoutes")
// // const vendorRoutes = require("./src/routes/vendorRoutes");
// // const productRoutes = require("./src/routes/productRoutes");
// // const cartRoutes = require("./src/routes/cartRoutes");
// // const orderRoutes = require("./src/routes/orderRoutes");
// // const adminRoutes = require("./src/routes/adminRoutes");
// // const categoryRoutes = require("./src/routes/categoryRoutes");

// // const app = express();

// // // VERY IMPORTANT
// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:3000",
// //       "http://localhost:3001",
// //       "https://gudigere.netlify.app",
// //     ],
// //     credentials: true,
// //   })
// // );

// // // BODY PARSER
// // app.use(express.json());

// // // COOKIE PARSER
// // app.use(cookieParser());

// // // TEST ROUTE
// // app.get("/", (req, res) => {
// //   res.send("API Running");
// // });

// // // ROUTES
// // app.use("/api/auth", authRoutes);
// // app.use("/api/vendors", vendorRoutes);
// // app.use("/api/products", productRoutes);
// // app.use("/api/cart", cartRoutes);
// // app.use("/api/orders", orderRoutes);
// // app.use("/api/admin", adminRoutes);
// // app.use("/api/categories", categoryRoutes);

// // // module.exports = app;
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// require("dotenv").config();

// const connectDB = require("./src/config/db");

// const authRoutes = require("./src/routes/authRoutes");
// const vendorRoutes = require("./src/routes/vendorRoutes");
// const productRoutes = require("./src/routes/productRoutes");
// const cartRoutes = require("./src/routes/cartRoutes");
// const orderRoutes = require("./src/routes/orderRoutes");
// const adminRoutes = require("./src/routes/adminRoutes");
// const categoryRoutes = require("./src/routes/categoryRoutes");

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

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const vendorRoutes = require("./src/routes/vendorRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");

const app = express();

// CONNECT DATABASE
connectDB();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://gudigere.netlify.app",
    ],
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json());

// COOKIE PARSER
app.use(cookieParser());

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});