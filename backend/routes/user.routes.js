const router = require("express").Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");

const {
  register,
  login,
  logout,

  getUsers,
  createUser,
  updateUser,

  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/user.controller");

// PUBLIC
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// ADMIN ONLY
router.use("/admin", authenticate, authorizeAdmin);

router.get("/admin/list", getUsers);
router.post("/admin/create", createUser);
router.post("/admin/update/:id", updateUser);


// user only 
router.use("/customer", authenticate,);

router.get("/customer/address", getAddresses);
router.post("/customer/address", addAddress);
router.put("/customer/address/:addressId", updateAddress);
router.delete("/customer/address/:addressId", deleteAddress);
router.patch("/customer/address/default/:addressId", setDefaultAddress);

module.exports = router;
