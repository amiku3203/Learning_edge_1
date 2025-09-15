const mongoose = require("mongoose");

const clinetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: { type: String },
    address: { type: String },
    companyName: { type: String, unique: true },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clinetSchema);

module.exports = Client;
