import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cegImage from "../../assets/ceg.jpg";
import Navbar from "../common/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error("Failed to send OTP");
      console.error(err);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("OTP is required");

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      toast.success("OTP verified. You can now reset your password.");
      setStep(3);
    } catch (err) {
      toast.error("Invalid or expired OTP");
      console.error(err);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("New password is required");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success("Password reset successfully");
      navigate("/");
    } catch (err) {
      toast.error("Error resetting password");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16 bg-gray-50">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${cegImage})` }} />

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
              <div className="flex justify-center mb-6">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/640px-Anna_University_Logo.svg.png"
                  alt="University Logo"
                  className="h-16"
                />
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
              </h2>

              {/* Step 1: Email */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition duration-200 ${loading && "opacity-50 cursor-not-allowed"}`}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-gray-600 mb-1">OTP</label>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition duration-200 ${loading && "opacity-50 cursor-not-allowed"}`}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-gray-600 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition duration-200 ${loading && "opacity-50 cursor-not-allowed"}`}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              <p className="text-sm text-gray-600 text-center mt-6">
                Go back to{" "}
                <Link to="/" className="text-red-600 hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
