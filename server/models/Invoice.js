// models/Invoice.js
const mongoose = require("mongoose");

 

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    biller: { type: mongoose.Schema.Types.ObjectId, ref: "Biller", required: true },
    invoiceNumber: { type: String, unique: true }, // 👈 auto-generated field
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    dueDate: { type: Date },
    status: { type: String, enum: ["draft", "sent", "paid"], default: "draft" },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastInvoice = await mongoose.model("Invoice").findOne().sort({ createdAt: -1 });

    let nextNumber = 1001; // starting point
    if (lastInvoice && lastInvoice.invoiceNumber) {
      // extract numeric part (e.g., from "INV-1001")
      const lastNum = parseInt(lastInvoice.invoiceNumber.replace("INV-", ""));
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    this.invoiceNumber = `INV-${nextNumber}`;
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
