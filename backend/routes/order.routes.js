// routes/order.routes.js

const router = require("express").Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeAdmin } = require("../middlewares/admin.middleware");

const {
  validateCart,
  placeOrder,
  getOrders,
} = require("../controllers/order.controller");

// public
router.post("/cart/validate", validateCart);

// user only
router.use("/customer", authenticate);
router.post("/customer/place-order", placeOrder);
// router.get("/customer/my-orders", authenticate, getMyOrders);
// router.get("/customer/my-orders/:id", authenticate, getOrder);

router.get("/admin/all-orders", authenticate, authorizeAdmin, getOrders);
// router.get("/admin/order/:id", authenticate, authorizeAdmin, getOrder);
// router.put("/admin/order/:id", authenticate, authorizeAdmin, updateOrder);

module.exports = router;
