const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK USER
    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // GENERATE TOKENS
    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    // SAVE REFRESH TOKEN
    user.refreshToken = refreshToken;

    await user.save();

    // COOKIE
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// REFRESH TOKEN
exports.refreshToken = async (
  req,
  res
) => {
  try {
    const token =
      req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(
      decoded.id
    );

    if (
      !user ||
      user.refreshToken !== token
    ) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // NEW ACCESS TOKEN
    const accessToken =
      generateAccessToken(user);

    res.json({
      accessToken,
    });
  } catch (error) {
    res.status(403).json({
      message: "Token expired",
    });
  }
};


// ADMIN LOGIN
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Admin login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGOUT
exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies.refreshToken;

    if (token) {
      const user =
        await User.findOne({
          refreshToken: token,
        });

      if (user) {
        user.refreshToken = "";

        await user.save();
      }
    }

    // CLEAR COOKIE
    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};