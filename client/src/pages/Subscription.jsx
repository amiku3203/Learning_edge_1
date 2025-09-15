import React, { useState, useEffect } from "react";
import api from "../api"; // axios instance
import { toast } from "react-hot-toast";

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // ✅ Check subscription status from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.isSubscribed) {
      setIsSubscribed(true);
    }
  }, []);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await api.post("/orders/create", { amount: 30000 });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount * 100,
        currency: "INR",
        name: "Unlimited Invoice Plan",
        description: "Pay ₹30,000 for unlimited invoices",
        order_id: data.order.razorpay_order_id,
        handler: async function (response) {
          try {
            await api.post("/orders/verify", response);

            // ✅ update localStorage after success
            const user = JSON.parse(localStorage.getItem("user")) || {};
            user.isSubscribe = true;
            localStorage.setItem("user", JSON.stringify(user));
            setIsSubscribed(true);

            toast.success(
              "Payment successful! 🎉 You can now generate unlimited invoices."
            );
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          escape: false,
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#1d4ed8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center border border-gray-200">
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          🚀 Unlimited Invoice Plan
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Upgrade your account and unlock the full potential of your invoicing
          system. With the{" "}
          <span className="font-semibold text-blue-600">Unlimited Plan</span>,
          you’ll never have to worry about invoice limits again.
        </p>

        {/* Price */}
        <div className="bg-gray-100 rounded-xl py-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            ₹30,000{" "}
            <span className="text-lg font-medium text-gray-500">
              / one-time
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Lifetime access • No hidden fees
          </p>
        </div>

        {/* Features */}
        <ul className="text-gray-700 space-y-3 mb-8 text-left">
          <li>✅ Generate unlimited invoices</li>
          <li>✅ Add unlimited clients and billers</li>
          <li>✅ Professional PDF invoice generation</li>
          <li>✅ Priority support 24/7</li>
        </ul>

        {/* ✅ Conditionally Render Button or Success Message */}
        {isSubscribed ? (
          <div className="bg-green-100 text-green-800 font-semibold py-4 rounded-xl shadow-inner">
            🎉 You already have unlimited access!
          </div>
        ) : (
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-200 shadow-md
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Please hold on... Payment is processing</span>
              </div>
            ) : (
              "Pay ₹30,000 & Unlock Unlimited Access"
            )}
          </button>
        )}

        {/* Note */}
        <p className="text-xs text-gray-500 mt-4">
          Secure payment powered by Razorpay 🔒
        </p>
      </div>
    </div>
  );
};

export default Subscription;
