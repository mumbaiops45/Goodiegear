// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const authRoutes = require("./routes/authRoutes");
// const vendorRoutes = require("./routes/vendorRoutes");
// const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");

// const app = express();


// // VERY IMPORTANT
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
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

// app.use("/api/categories",categoryRoutes);


// module.exports = app;

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// VERY IMPORTANT
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

// BODY PARSER
app.use(express.json());

// COOKIE PARSER
app.use(cookieParser());

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

module.exports = app;