import { useForm } from "react-hook-form";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.post("/verify-otp", {
        otp: data.otp,
        email: user.email,
      });
      console.log("Vrrr", res);
      toast.success(res?.data?.messgae);
      sessionStorage.clear();
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log("err", error);
      toast.error(error?.response?.data.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-black via-gray-700 to-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
        <p className="text-gray-600 text-sm">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Input */}
        <input
          type="text"
          maxLength={6}
          {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
          placeholder="Enter OTP"
          className="text-center tracking-widest text-lg border border-gray-300 rounded-lg px-4 py-3 w-40 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.otp && (
          <span className="text-red-500 text-sm">OTP must be 6 digits</span>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
