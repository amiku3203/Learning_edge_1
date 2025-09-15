const express = require("express");
require("dotenv").config();

const connectDb = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const clienRoute = require("./routes/clientRoute");
const billerRoute = require("./routes/billerRoute");
const invoiceRoute = require("./routes/invoiceRoute");
const orderRoute = require("./routes/orderRoute");
const Client= require("./models/Client");
const Biller= require("./models/BIller");
const Invoice= require("./models/Invoice");
connectDb();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(orderRoute);
app.use(userRoute);
app.use(clienRoute);
app.use(billerRoute);
app.use(invoiceRoute);

app.get("/analytics", async (req, res) => {
  try {
    const clientCount = await Client.countDocuments();
    const billerCount = await Biller.countDocuments();
    const invoiceCount = await Invoice.countDocuments();

    res.json({
      clients: clientCount || 0,
      billers: billerCount || 0,
      invoices: invoiceCount || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

app.listen(PORT, function (err) {
  if (err) {
    console.log("Something went wrong please", err);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
