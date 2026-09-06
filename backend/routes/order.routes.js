// routes/order.routes.js

const router = require("express").Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");

const {
  validateCart,
  placeOrder,
  getOrders,
  getMyOrders,

  updateOrder
} = require("../controllers/order.controller");

// public
router.post("/cart/validate", validateCart);

// user only
router.use("/customer", authenticate);
router.post("/customer/place-order", placeOrder);
router.get("/customer/my-orders", getMyOrders);
// router.get("/customer/my-orders/:id", getOrder);

router.use("/admin", authenticate, authorizeAdmin);
router.get("/admin/all-orders", getOrders);
router.put("/admin/order/:id", updateOrder);
// router.get("/admin/order/:id", getOrder);

module.exports = router;
