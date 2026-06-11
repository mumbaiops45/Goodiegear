  const Vendor = require("../models/Vendor");

  const User = require("../models/User");


  // APPLY AS VENDOR
  exports.applyVendor = async (
    req,
    res
  ) => {
    try {
      const {
        shopName,
        shopDescription,
      } = req.body;

      // CHECK EXISTING
      const vendorExists =
        await Vendor.findOne({
          user: req.user.id,
        });

      if (vendorExists) {
        return res.status(400).json({
          message:
            "Vendor request already exists",
        });
      }

      // CREATE VENDOR
      const vendor = await Vendor.create({
        user: req.user.id,

        shopName,

        shopDescription,
      });

      res.status(201).json({
        message:
          "Vendor application submitted",

        vendor,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };


  // GET MY VENDOR PROFILE
  exports.getMyVendorProfile =
    async (req, res) => {
      try {
        const vendor =
          await Vendor.findOne({
            user: req.user.id,
          }).populate(
            "user",
            "name email role"
          );

        if (!vendor) {
          return res.status(404).json({
            message:
              "Vendor profile not found",
          });
        }

        res.json(vendor);
      } catch (error) {
        res.status(500).json(error);
      }
    };


  // ADMIN APPROVE VENDOR
  exports.approveVendor = async (
    req,
    res
  ) => {
    try {
      const vendor =
        await Vendor.findById(
          req.params.id
        );

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      // APPROVE
      vendor.isApproved = true;

      await vendor.save();

      // UPDATE USER ROLE
      await User.findByIdAndUpdate(
        vendor.user,
        {
          role: "vendor",
        }
      );

      res.json({
        message:
          "Vendor approved successfully",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };


  // GET ALL VENDORS
  exports.getAllVendors =
    async (req, res) => {
      try {
        const vendors =
          await Vendor.find().populate(
            "user",
            "name email role"
          );

        res.json(vendors);
      } catch (error) {
        res.status(500).json(error);
      }
    };

    exports.updateVendorProfile =
  async (req, res) => {
    try {
      const vendor =
        await Vendor.findOne({
          user: req.user.id,
        });

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      vendor.shopName =
        req.body.shopName ||
        vendor.shopName;

      vendor.shopDescription =
        req.body.shopDescription ||
        vendor.shopDescription;

      vendor.shopLogo =
        req.body.shopLogo ||
        vendor.shopLogo;

      await vendor.save();

      res.json(vendor);

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to update vendor profile",
        error: error.message,
      });
    }
  };