const router = require("express").Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/admin.middleware");
const upload = require("../../middlewares/upload.middleware");

const {
    createOffer,
    getAllOfferList,
    updateOffer,

    getActiveOfferList
} = require("../../controllers/cms/offer.controller");

// PUBLIC
router.get("/list", getActiveOfferList);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.get("/admin/list", getAllOfferList);
router.post("/admin/create", upload.single("image"), createOffer);
router.patch("/admin/update/:id", upload.single("image"), updateOffer);

module.exports = router;
