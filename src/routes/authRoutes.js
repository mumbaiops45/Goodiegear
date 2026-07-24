const express = require("express");

const router = express.Router();

const {
  register,
  login,
  adminLogin,
  refreshToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
} = require("../controllers/authController");


// ROUTES
router.post("/register", register);

router.post("/login", login);

router.post("/admin-login", adminLogin);

router.get("/refresh", refreshToken);

router.post("/logout", logout);


router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOTP);

router.post("/reset-password", resetPassword);

router.post("/resend-otp", resendOTP);


module.exports = router;