const router = require("express").Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/admin.middleware");

const {
    createPromotion,
    getAllPromotionList,
    updatePromotion,


    getActivePromotionList
} = require("../../controllers/cms/promotion.controller");

// PUBLIC
router.get("/list", getActivePromotionList);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.post("/admin/create", createPromotion);
router.get("/admin/list", getAllPromotionList);
router.patch("/admin/update/:id", updatePromotion);

module.exports = router;
