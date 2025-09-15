const express = require("express");
const {
  createUser,
  verifyOtp,
  login,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", createUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
module.exports = router;
