const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/User");
const connectDB = require("../config/db");

const adminData = {
  name: "Admin",
  email: "admin@gudigere.com",
  password: "Admin@123",
  role: "admin",
};

const createAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: adminData.email });

    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully:");
    console.log("  Email   :", admin.email);
    console.log("  Password:", adminData.password);
    console.log("  Role    :", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
