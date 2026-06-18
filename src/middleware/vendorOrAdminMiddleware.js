const User = require("../models/User");

const vendorOrAdminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "vendor" && user.role !== "admin") {
      return res.status(403).json({ message: "Vendor or Admin access only" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = vendorOrAdminMiddleware;
