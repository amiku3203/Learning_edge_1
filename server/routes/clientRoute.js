const express = require("express");
const router = express.Router();
const {
  createClient,
  getClients,

  updateClient,
  deleteClient,
} = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");
router.use(authMiddleware);
router.post("/clients", createClient);
router.get("/clients", getClients);

router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);
module.exports = router;
