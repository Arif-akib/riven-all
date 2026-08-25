const router = require("express").Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/admin.middleware");
const upload = require("../../middlewares/upload.middleware");

const {
    createPopup,
    getAllPopupList,
    updatePopup,


    getActivePopupList
} = require("../../controllers/cms/popup.controller");

// PUBLIC
router.get("/list", getActivePopupList);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.get("/admin/list", getAllPopupList);
router.post("/admin/create", upload.single("image"), createPopup);
router.patch("/admin/update/:id", upload.single("image"), updatePopup);

module.exports = router;
