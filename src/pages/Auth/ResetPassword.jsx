import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosinstance";
import NetworkNext from "../../assets/icons/logo nsqaure 1.svg";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = () => {
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      // Make API call to reset password with token

      await toast.promise(
        axiosInstance.post("/users/reset-password", {
          token,
          password,
          confirmPassword,
        }),
        {
          pending: "Resetting password...",
          success: "Password reset successfully! You can now log in.",
          error: {
            render({ data }) {
              return (
                data.response?.data?.message || "Failed to reset password."
              );
            },
          },
        }
      );

      navigate("/login"); // Redirect to login page on success
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-black font-sans">
      <div className="flex items-center justify-center w-full py-4">
        <img src={NetworkNext} alt="Network Next Logo" className="h-24" />
      </div>
      {/* Top Bar */}
      <div className="w-full max-w-lg flex flex-col items-center px-6 pt-4 pb-8">
        <h1 className="text-xl font-semibold mb-6">Reset Your Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your new password below to reset your account password.
        </p>

        <form onSubmit={handleFormSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Confirm your new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
