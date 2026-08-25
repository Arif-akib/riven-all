const router = require("express").Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/admin.middleware");

const {
    createReview,
    getAllReviewList,
    updateReview,

    getActiveReviewList
} = require("../../controllers/cms/review.controller");

// PUBLIC
router.get("/list", getActiveReviewList);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.get("/admin/list", getAllReviewList);
router.post("/admin/create", createReview);
router.patch("/admin/update/:id", updateReview);

module.exports = router;
