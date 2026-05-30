
const User = require("../models/User");

const vendorMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "vendor") {
      return res.status(403).json({
        message:
          "Vendor access only",
      });
    }

    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = vendorMiddleware;