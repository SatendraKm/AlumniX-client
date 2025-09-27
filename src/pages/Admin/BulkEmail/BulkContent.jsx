import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Cookies from "js-cookie";

const BulkContent = () => {
  const [recipientType, setRecipientType] = useState("");
  const [batch, setBatch] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [universityId, setUniversityId] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");

  // Fetch university_id from cookies on component mount
  useEffect(() => {
    const id = Cookies.get("id");
    if (id) {
      setUniversityId(id);
      fetchOrganizationDetails(id);
    } else {
      toast.error("University ID not found in cookies.");
    }
  }, []);

  // Function to fetch organization details by ID
  const fetchOrganizationDetails = async (id) => {
    try {
      const response = await axiosInstance.get(
        `/organizations/${id}`
      );

      if (response.data && response.data.organization) {
        const email = response.data.organization.email;
        setOrganizationEmail(email);
      } else {
        toast.error("Organization details not found.");
      }
    } catch (error) {
      console.error("Error fetching organization details:", error);
      toast.error("Failed to fetch organization details.");
    }
  };

  // Options for the recipient selection dropdown
  const recipientOptions = [
    { value: "student", label: "Student" },
    { value: "alumni", label: "Alumni" },
    { value: "faculty", label: "Faculty" },
  ];

  // Handle the form submission
  const handleSend = async () => {
    if (!recipientType || !subject || !message) {
      toast.error("Please fill in all fields and select a recipient.");
      return;
    }

    if ((recipientType === "student" || recipientType === "alumni") && !batch) {
      toast.error("Please provide a batch name.");
      return;
    }

    if (!organizationEmail) {
      toast.error("Organization email not found. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Prepare the payload
      const payload = {
        batch: batch || "",
        subject,
        message,
        university_id: universityId,
        role: recipientType,
        email: organizationEmail, // Add organization email to the payload
      };

      // Send POST request to the backend API
      const response = await axiosInstance.post(
        "/organization/send-bulk-email",
        payload
      );

      toast.success(response.data.message || "Bulk email sent successfully!");
    } catch (error) {
      console.error("Error sending bulk email:", error);
      toast.error(
        error.response?.data?.message || "Failed to send bulk email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

      <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
        {/* Recipient Field */}
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-700">
            Select Recipient
          </label>
          <Select
            options={recipientOptions}
            value={recipientOptions.find(
              (option) => option.value === recipientType
            )}
            onChange={(selected) => setRecipientType(selected.value)}
            placeholder="Select a recipient..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Batch Field (conditionally rendered for Student and Alumni) */}
        {(recipientType === "student" || recipientType === "alumni") && (
          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700">Batch</label>
            <input
              type="text"
              placeholder="Enter batch name"
              className="w-full p-3 text-base border border-gray-300 rounded-md"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
        )}

        {/* Subject Field */}
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-700">Subject</label>
          <input
            type="text"
            placeholder="Enter your email subject"
            className="w-full p-3 text-base border border-gray-300 rounded-md"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Message Field */}
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-700">Message</label>
          <textarea
            placeholder="Write your message here"
            className="w-full p-3 text-base border border-gray-300 rounded-md resize-y"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Send Button */}
        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-lg"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Bulk Email 📤"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkContent;
