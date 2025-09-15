// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
sendInvoiceEmail
} = require("../controllers/invoiceController");
const auth = require("../middleware/authMiddleware"); // your JWT auth middleware

router.post("/invoice", auth, createInvoice);
router.get("/invoice", auth, getInvoices);
router.put("/invoice/:id", auth, updateInvoice);
router.delete("/invoice/:id", auth, deleteInvoice);
router.get("/generate-pdf/:id",  auth,  generateInvoicePDF);
router.post("/send-invoice-email/:id",  auth, sendInvoiceEmail);
module.exports = router;
