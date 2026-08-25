const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  getAllProductsList,
  getAllProductDetails,
  createProduct,
  updateProduct,

  getAllActiveProductsList,
  getActiveProductDetails,
  getActiveFeaturedProductsList,
  getRelatedProducts,
} = require("../controllers/product.controller");

// PUBLIC
router.get("/list", getAllActiveProductsList);
router.get("/details/:id", getActiveProductDetails);
router.get("/featured-list", getActiveFeaturedProductsList);
router.get("/related/:categoryId/:productId", getRelatedProducts);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.get("/admin/all-list", getAllProductsList);
router.get("/admin/details/:id", getAllProductDetails);
router.post("/admin/create", upload.any(), createProduct);
router.patch("/admin/update/:id", upload.any(), updateProduct);

module.exports = router;
