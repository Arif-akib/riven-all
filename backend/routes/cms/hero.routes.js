const router = require("express").Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeAdmin } = require("../../middlewares/admin.middleware");
const upload = require("../../middlewares/upload.middleware");

const {
  createHero,
  getAllHeroList,
  updateHero,

  getActiveHeroList,
} = require("../../controllers/cms/hero.controller");

// PUBLIC
router.get("/list", getActiveHeroList);

// ADMIN
router.use("/admin", authenticate, authorizeAdmin);

router.get("/admin/list", getAllHeroList);
router.post("/admin/create", upload.single("image"), createHero);
router.patch("/admin/update/:id", upload.single("image"), updateHero);

module.exports = router;
