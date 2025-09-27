import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import NetworkNext from "../../assets/icons/Network Next.svg";
import Nsquare from "../../assets/icons/logo nsqaure 1.svg";
import CheckmarkAnimation from "../../assets/animations/checkmark.gif";
import axiosInstance from "../../utils/axiosinstance";
import Cookies from "js-cookie";

const OrganizationLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/admin-dashboard"); // Redirect to dashboard if token exists
    }
  }, [navigate]);

  const validateFields = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);

    // Use toast.promise
    await toast
      .promise(
        axiosInstance.post("/organizations/login", {
          email,
          password,
        }),
        {
          pending: "Logging in",
          success: "Login successful!",
          error: {
            render({ data }) {
              // Access error data from the promise
              return (
                data?.response?.data?.message || "An unexpected error occurred."
              );
            },
          },
        }
      )
      .then((response) => {
        console.log(response);
        Cookies.set("token", response?.data?.token, { expires: 7 }); // expires in 7 days
        Cookies.set("id", response?.data?.id, { expires: 7 });
        Cookies.set("role", response?.data?.role, { expires: 7 });

        setShowPopup(true); // Show popup on successful login
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle popup close and navigate to dashboard
  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/admin-dashboard/Board"); // Navigate to dashboard after closing popup
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-black font-sans">
      <div className="flex items-center justify-between w-full px-6 py-4 mx-auto">
        <Link to="/">
          <img src={NetworkNext} alt="Network Next" className="h-5" />
        </Link>
        <Link to="/">
          <button className="p-2 -mr-2">
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </Link>
      </div>
      <div className="w-full max-w-lg flex flex-col items-center flex-grow px-6 pt-4 pb-8">
        <div className="text-center mb-8">
          <img src={Nsquare} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-xl font-semibold">Log in your organization</h1>
        </div>

        <form onSubmit={handleFormSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Organization Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg text-black placeholder-gray-400 focus:ring-1 focus:ring-gray-600 focus:outline-none`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg text-black placeholder-gray-400 pr-10 focus:ring-1 focus:ring-gray-600 focus:outline-none`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <Link
              to="/forgot-password"
              className="text-xs text-blue-600 hover:underline float-right mt-2"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </div>

          <button
            type="submit"
            className={`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Wait" : "Log In"}
          </button>
        </form>

        {/* <div className="flex w-full items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">Or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div> */}
      </div>
      <div className="w-1/2 mx-auto px-6">
        <div className="border-t border-gray-300 my-2"></div>
        <div className="text-center text-gray-600 text-sm mb-6">
          <div>
            <Link
              to="/register-organization"
              className="text-blue-600 font-medium hover:underline"
            >
              Register your organization
            </Link>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md w-[400px] h-[450px] p-8 flex flex-col items-center justify-center relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 text-xl"
            >
              ✕
            </button>
            {/* Checkmark Animation GIF */}
            <div className="w-36 h-36 mb-6">
              <img
                src={CheckmarkAnimation}
                alt="Checkmark Animation"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-600 text-sm mb-8">
              Login successful. Go to your dashboard.
            </p>
            <button
              onClick={handleClosePopup}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
//deploye commect
export default OrganizationLogin;
