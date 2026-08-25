const router = require("express").Router();

// import sub modules
const heroRoutes = require("../routes/cms/hero.routes");
const offerRoutes = require("../routes/cms/offer.routes");
const reviewRoutes = require("../routes/cms/review.routes");
const popupRoutes = require("../routes/cms/popup.routes");
const promotionRoutes = require('../routes/cms/promotion.routes')

// mount them
router.use("/hero", heroRoutes);
router.use("/offer", offerRoutes);
router.use("/review", reviewRoutes);
router.use("/popup", popupRoutes);
router.use("/promotion", promotionRoutes);

module.exports = router;