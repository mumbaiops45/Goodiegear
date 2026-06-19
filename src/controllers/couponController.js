const Coupon = require("../models/Coupon");

// ─── ADMIN ───────────────────────────────────────────────

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    coupon.active = !coupon.active;
    await coupon.save();
    res.json({ message: `Coupon ${coupon.active ? "activated" : "deactivated"}`, coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUBLIC / USER ────────────────────────────────────────

exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ message: "Invalid or inactive coupon" });

    // DATE CHECK
    const now = new Date();
    if (coupon.startDate && now < coupon.startDate)
      return res.status(400).json({ message: "Coupon is not active yet" });
    if (coupon.endDate && now > coupon.endDate)
      return res.status(400).json({ message: "Coupon has expired" });

    // DAY CHECK
    if (coupon.days.length > 0) {
      const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
      if (!coupon.days.includes(dayName))
        return res.status(400).json({ message: `Coupon valid only on: ${coupon.days.join(", ")}` });
    }

    // TIME CHECK (HH:MM 24h)
    if (coupon.startTime && coupon.endTime) {
      const currentTime = now.toTimeString().slice(0, 5);
      if (currentTime < coupon.startTime || currentTime > coupon.endTime)
        return res.status(400).json({
          message: `Coupon valid only between ${coupon.startTime} – ${coupon.endTime}`,
        });
    }

    // MIN PRICE CHECK
    if (cartTotal < coupon.minPrice)
      return res.status(400).json({
        message: `Minimum order amount is ₹${coupon.minPrice}`,
      });

    // USAGE LIMIT CHECK
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: "Coupon usage limit reached" });

    // CALCULATE DISCOUNT
    let discountAmount =
      coupon.discountType === "percentage"
        ? (cartTotal * coupon.discount) / 100
        : coupon.discount;

    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);

    const finalTotal = Math.max(cartTotal - discountAmount, 0);

    res.json({
      message: "Coupon applied successfully",
      code: coupon.code,
      title: coupon.title,
      discountType: coupon.discountType,
      discount: coupon.discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalTotal: Math.round(finalTotal * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
