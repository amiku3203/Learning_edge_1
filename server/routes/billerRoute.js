const express = require("express");
const router = express.Router();
const {
  createBiller,
  getBillers,
  getBillerById,
  updateBiller,
  deleteBiller,
} = require("../controllers/billerController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/billers", authMiddleware, createBiller);
router.get("/billers", authMiddleware, getBillers);
router.get("/billers/:id", authMiddleware, getBillerById);
router.put("/billers/:id", authMiddleware, updateBiller);
router.delete("/billers/:id", authMiddleware, deleteBiller);

module.exports = router;
