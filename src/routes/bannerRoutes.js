const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
  trackClick,
} = require("../controllers/bannerController");


// PUBLIC — view active banners (optionally filter by ?placement=Home Hero)
router.get("/", getBanners);
router.get("/:id", getBanner);

// PUBLIC — track click on a banner
router.patch("/:id/click", trackClick);

// ADMIN — full management
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createBanner);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateBanner);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBanner);
router.patch("/:id/toggle", authMiddleware, adminMiddleware, toggleBanner);

module.exports = router;
