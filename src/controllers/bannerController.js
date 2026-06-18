const Banner = require("../models/Banner");
const cloudinary = require("../config/cloudinary");

// GET ALL BANNERS (public — active only, admin sees all)
exports.getBanners = async (req, res) => {
  try {
    const { placement } = req.query;
    const filter = {};

    // Public users see only active banners
    if (!req.user || req.user.role !== "admin") {
      filter.active = true;
    }

    if (placement) filter.placement = placement;

    const banners = await Banner.find(filter).sort({ createdAt: -1 });

    res.json({ total: banners.length, banners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE BANNER
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE BANNER (admin)
exports.createBanner = async (req, res) => {
  try {
    const { title, placement, active } = req.body;

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gugigere-banners",
      });
      imageUrl = result.secure_url;
    }

    const banner = await Banner.create({
      title,
      placement,
      active,
      image: imageUrl,
    });

    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE BANNER (admin)
exports.updateBanner = async (req, res) => {
  try {
    const { title, placement, active } = req.body;
    const updateData = { title, placement, active };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "gugigere-banners",
      });
      updateData.image = result.secure_url;
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner updated successfully", banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BANNER (admin)
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE BANNER ACTIVE STATE (admin)
exports.toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.active = !banner.active;
    await banner.save();

    res.json({
      message: `Banner ${banner.active ? "activated" : "deactivated"}`,
      banner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TRACK BANNER CLICK (public)
exports.trackClick = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ success: true, clicks: banner.clicks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
