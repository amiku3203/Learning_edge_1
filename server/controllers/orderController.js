import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // 30000
    
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in DB
    const newOrder = await Order.create({
      user: req.user._id,
      razorpay_order_id: order.id,
      amount: amount,
    });

    res.status(200).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

// Verify payment & update order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const order = await Order.findOne({ razorpay_order_id });
    if (!order)
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });

    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "paid";
    await order.save();

    // Update user subscription
    await User.findByIdAndUpdate(order.user, { isSubscribed: true });

    res
      .status(200)
      .json({ success: true, message: "Payment successful", order });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};
