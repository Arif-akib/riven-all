const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  getAllCategoriesList,
  getCategoryDetails,
  createCategory,
  updateCategory,
  getActiveCategoriesList,
  getActiveCategoryDetails
} = require("../controllers/category.controller");

// PUBLIC
router.get("/list", getActiveCategoriesList);
router.get("/details/:id", getActiveCategoryDetails);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.post("/admin/create", upload.single("image"), createCategory);
router.get("/admin/list", getAllCategoriesList);
router.get("/admin/details/:id", getCategoryDetails);
router.patch("/admin/update/:id", upload.single("image"), updateCategory);

module.exports = router;
