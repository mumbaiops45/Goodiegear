const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getStats,
  getOverview,
  getReports,
} = require("../controllers/dashboardController");

// All dashboard routes — admin only
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getStats);
router.get("/overview", getOverview);
router.get("/reports", getReports);

module.exports = router;
