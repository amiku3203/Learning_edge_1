const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    gstNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Biller", billerSchema);
