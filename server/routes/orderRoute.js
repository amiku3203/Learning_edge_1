const express = require("express");
const {
  createOrder,
  verifyPayment,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/orders/create", authMiddleware, createOrder);
router.post("/orders/verify", authMiddleware, verifyPayment);

module.exports = router;
