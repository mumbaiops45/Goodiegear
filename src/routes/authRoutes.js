  const express = require("express");

  const router = express.Router();

  const {
    register,
    login,
    refreshToken,
    logout,
  } = require("../controllers/authController");


  // ROUTES
  router.post("/register", register);

  router.post("/login", login);

  router.get("/refresh", refreshToken);

  router.post("/logout", logout);


  module.exports = router;