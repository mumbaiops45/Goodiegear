const Wishlist =
    require("../models/Wishlist");


// ==========================
// ADD TO WISHLIST
// ==========================
exports.addToWishlist =
    async (req, res) => {

        try {

            const {
                productId,
            } = req.body;

            let wishlist =
                await Wishlist.findOne({
                    user:
                        req.user.id,
                });

            // CREATE WISHLIST
            if (!wishlist) {

                wishlist =
                    await Wishlist.create({
                        user:
                            req.user.id,

                        products: [],
                    });
            }

            // CHECK EXIST
            const exists =
                wishlist.products.some(
                    (item) =>
                        item.toString() ===
                        productId
                );

            if (exists) {

                return res.status(400).json({
                    message:
                        "Product already in wishlist",
                });
            }

            // ADD PRODUCT
            wishlist.products.push(
                productId
            );

            await wishlist.save();

            res.json({
                success: true,
                message:
                    "Added to wishlist",
                wishlist,
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// ==========================
// GET WISHLIST
// ==========================
exports.getWishlist =
    async (req, res) => {

        try {

            const wishlist =
                await Wishlist.findOne({
                    user:
                        req.user.id,
                }).populate(
                    "products"
                );

            res.json({
                success: true,
                wishlist,
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// ==========================
// REMOVE FROM WISHLIST
// ==========================
exports.removeWishlistItem =
    async (req, res) => {

        try {

            const wishlist =
                await Wishlist.findOne({
                    user:
                        req.user.id,
                });

            if (!wishlist) {

                return res.status(404).json({
                    message:
                        "Wishlist not found",
                });
            }

            wishlist.products =
                wishlist.products.filter(
                    (
                        item
                    ) =>
                        item.toString() !==
                        req.params.productId
                );

            await wishlist.save();

            res.json({
                success: true,
                message:
                    "Removed from wishlist",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// ==========================
// CLEAR WISHLIST
// ==========================
exports.clearWishlist =
    async (req, res) => {

        try {

            await Wishlist.findOneAndUpdate(
                {
                    user:
                        req.user.id,
                },
                {
                    products: [],
                }
            );

            res.json({
                success: true,
                message:
                    "Wishlist cleared",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };