const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  getAllBrandList,
  getBrandDetails,
  createBrand,
  updateBrand,

  getActiveBrandList,
  getActiveBrandDetails
} = require("../controllers/subcategory.controller");

// PUBLIC
router.get("/list", getActiveBrandList);
router.get("/details/:id", getActiveBrandDetails);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.post("/admin/create", upload.single("image"), createBrand);
router.get("/admin/list", getAllBrandList);
router.get("/admin/details/:id", getBrandDetails);
router.patch("/admin/update/:id", upload.single("image"), updateBrand);

module.exports = router;
