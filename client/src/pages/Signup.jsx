import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import api from "../api";
import toast from "react-hot-toast";
const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await api.post("/register", data);

      if (response?.data) {
        console.log("ressp", response);
        toast.success(response?.data?.message);
         localStorage.setItem("user", JSON.stringify(response?.data?.NewUser));
        sessionStorage.setItem("canAccessOtp", "true");
        navigate("/verify-otp");
      }
    } catch (err) {
      console.log("err", err);
      toast.error(err?.response?.data?.message);
    }
    setLoading(false);
  };
  return (
    <>
      <div
        style={{
          background: "linear-gradient(to bottom, black, gray, white)",
        }}
        className="h-screen w-full flex items-center justify-center "
      >
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 shadow-2xl p-10   rounded-2xl w-full max-w-md mx-auto mt-20"
          >
            <div className="flex flex-col gap-2">
              <label className="text-black font-semibold">Name</label>
              <input
                placeholder="test"
                {...register("name", { required: true })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-black font-semibold">Email</label>
              <input
                {...register("email", { required: true })}
                placeholder="test@gmail.com"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-black font-semibold">Password</label>
              <input
                {...register("password", { required: true })}
                placeholder="**********"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  This field is required
                </span>
              )}
            </div>

            <div className="w-full">
              <input
                type="submit"
                value={loading ? "Loading..." : "Sign Up"}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer"
              />
            </div>
            <span className="text-sm">
              Already Have an account ?
              <span
                className="m-2 text-blue-500 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
