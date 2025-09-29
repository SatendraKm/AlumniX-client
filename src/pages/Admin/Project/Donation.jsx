import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import Image from "../../../assets/icons/logo nsqaure 1.svg"; // Ensure the correct path for the image
import Cookies from "js-cookie";
import axios from "axios";

const Donation = () => {
  const userId = Cookies.get("id");
  const projectId = useParams();
  const [userData, setUserData] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [loading, setLoading] = useState(false); // Added loading state

  // Function to load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        if (response.data?.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();

    // Load Razorpay script on component mount
    loadRazorpayScript()
      .then(() => {
        console.log("Razorpay script loaded successfully!");
      })
      .catch((error) => {
        console.error("Error loading Razorpay script:", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount } = formData;
    const amountNumber = parseFloat(amount);

    if (!amountNumber || amountNumber <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    if (amountNumber < 50) {
      alert("The minimum donation amount is ₹50.");
      return;
    }

    if (amountNumber > 10000) {
      alert("The maximum donation amount is ₹10,000.");
      return;
    }

    await checkoutHandler(amountNumber);
  };

  const checkoutHandler = async (amount) => {
    try {
      setLoading(true);

      const {
        data: { key },
      } = await axios.get(
        `${import.meta.env.VITE_APP_AXIOS_BASE_URL}/donation/get-key`
      );

      const {
        data: { order },
      } = await axios.post(
        `${import.meta.env.VITE_APP_AXIOS_BASE_URL}/donation/checkout`,
        { amount }
      );

      if (window.Razorpay) {
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "Network Next",
          description: "Tutorial of RazorPay",
          image: Image,
          order_id: order.id,
          handler: async function (response) {
            // Razorpay provides `response.razorpay_payment_id`, `response.razorpay_order_id`, etc.
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;
            const donationFrom = { userId };

            // Send the response to your backend for verification
            try {
              const response = await axios.post(
                `${import.meta.env.VITE_APP_AXIOS_BASE_URL}/donation/payment-verification`,
                {
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  donationFrom,
                  amount,
                  projectID: projectId,
                  userID: userId,
                }
              );
              alert("Payment Successful!");
            } catch (error) {
              console.error("Error verifying payment:", error);
              alert("Payment verification failed!");
            }
          },
          prefill: {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            contact: userData.phone,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#121212",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        console.error("Razorpay SDK not loaded");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error in payment processing:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full sm:w-96 max-w-lg">
        <h2 className="text-3xl text-center font-bold text-gray-900 mb-8">
          Thank you for Donation! 🙏🏻
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Field */}
          <div className="mb-4">
            <label
              htmlFor="formAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              id="formAmount"
              placeholder="Enter the amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full ${loading ? "bg-gray-400" : "bg-zinc-900"} text-white py-3 px-4 rounded-xl text-lg font-medium shadow-md hover:bg-zinc-600`}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Processing..." : "Donate Now"}{" "}
            {/* Display loading text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
