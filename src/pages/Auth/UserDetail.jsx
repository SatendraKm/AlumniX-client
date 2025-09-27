import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import NetworkNextLogo from "../../assets/icons/Network Next.svg";
import OnebyTwoLogo from "../../assets/icons/HalfIcon.svg";
import TwobyTwoLogo from "../../assets/icons/TwobyTwoLogo.svg";
import { FiPaperclip } from "react-icons/fi";
import { LuInfo } from "react-icons/lu";
import CheckmarkAnimation from "../../assets/animations/checkmark.gif";
import axiosInstance from "../../utils/axiosinstance";

const UserDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    address: "",
    state: "",
    city: "",
    zipCode: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "",
    profileimageUrl: "",
    organization: "",
    batch: "",
    enrollmentnumber:"",
  });
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const generateGraduationYears = () => {
    const startYear = 2015;
    const endYear = 2030;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const graduationYears = generateGraduationYears();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axiosInstance.get(
          "/organizations/get-all-organizations"
        );
        console.log(response.data);
        setOrganizations(response.data); // Assuming the API response is an array
      } catch (err) {
        console.error("Error fetching organizations:", err);
        setError(err.message);
      }
    };

    fetchOrganizations();
  }, []);

  // Handle Input Changes
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Handle empty date
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0]; // Extract yyyy-MM-dd
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // Store dob directly in yyyy-MM-dd format
    }));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // For preview
      setFormData((prev) => ({
        ...prev,
        profileimageUrl: file, // Store the actual File object
      }));
    }
  };

  // Form Validation
  const validateStep1 = () => {
    const { firstName, lastName, phone, dob } = formData;
    const errors = {};
    if (!firstName) errors.firstName = "First Name is required.";
    if (!lastName) errors.lastName = "Last Name is required.";
    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }
  
    if (!dob) errors.dob = "Date of Birth is required.";
    return errors;
  };

  const validateStep2 = () => {
    const { address, state, city, zipCode, password, confirmPassword } =
      formData;
    const errors = {};
    if (!address) errors.address = "Address is required.";
    if (!state) errors.state = "State is required.";
    if (!city) errors.city = "City is required.";
    if (!zipCode || isNaN(zipCode))
      errors.zipCode = "Valid Zip Code is required.";
    if (!password) errors.password = "Password is required.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords must match.";
    return errors;
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      toast.error("Please fill out all required fields.");
    } else {
      setError({});
      setCurrentStep(2); // Proceed to Step 2
    }
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setIsLoading(true);
    setError({});

    try {
      const { confirmPassword, dob, ...dataToSubmit } = formData;
      dataToSubmit.dob = new Date(dob).toISOString(); // Convert dob to ISO format

      // Create FormData to send the image and other fields
      const formDataToSend = new FormData();
      Object.entries(dataToSubmit).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append the profile image file
      if (formData.profileimageUrl) {
        formDataToSend.append("profileimageUrl", formData.profileimageUrl);
      }

      // Make the API request with FormData
      await toast.promise(
        axiosInstance.post("/users/signup", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "Submitting your details...",
          success: "Signup completed successfully!",
          error: "Failed to complete signup. Please try again.",
        }
      );

      setShowPopup(true); // Show confirmation popup
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-black font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full px-6 py-4">
        <button onClick={() => navigate("/")} className="p-2 flex items-center">
          <img src={NetworkNextLogo} alt="NetworkNext" className="h-6" />
        </button>
        <button onClick={() => navigate("/login")} className="p-2">
          <span className="text-2xl font-semibold">✕</span>
        </button>
      </div>

      {/* Form Section */}
      <div className="bg-[#F1F1F1] w-full max-w-lg p-8 rounded-xl shadow-md">
        {currentStep === 1 ? (
          <>
            {/* ProfilePage1 */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#000000]">
                Profile
              </h2>
              <img src={OnebyTwoLogo} alt="1/2 completed" />
            </div>
            <form onSubmit={handleSubmitStep1} className="space-y-5">
              <div className="flex flex-row gap-x-5 items-center mb-8">
                <label htmlFor="upload-photo" className="cursor-pointer">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="rounded-full w-20 h-20 object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full border border-gray-300">
                      <FiPaperclip size={24} />
                    </div>
                  )}
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload your Profile Photo
                </p>
              </div>

              <h3 className="text-lg lg:text-xl font-bold text-[#000000] mb-5">
                Basic Information
              </h3>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  error.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  error.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              <input
                name="phone"
                type="text"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  error.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              <input
                name="dob"
                type="date"
                placeholder="Date of Birth"
                value={formatDateForInput(formData.dob)} // Format dob for input display
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  error.dob ? "border-red-500" : "border-gray-300"
                }`}
              />
              <select
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.organization ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="" disabled>
                  Select Organization
                </option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* ProfilePage2 */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#000000]">
                Profile
              </h2>
              <img src={TwobyTwoLogo} alt="2/2 completed" />
            </div>
            <form onSubmit={handleSubmitStep2} className="space-y-5">
              <input
                name="address"
                type="text"
                placeholder="Address Line 1"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.address ? "border-red-500" : "border-gray-300"}`}
              />

              <select
                value={formData.state}
                name="state"
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.address ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <div className="flex justify-between gap-4">
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${error.city ? "border-red-500" : "border-gray-300"}`}
                />
                <input
                  name="zipCode"
                  type="text"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${error.zipCode ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <div className="text-lg font-bold">Gender</div>
              <div className="flex gap-5">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Female</span>
                </label>
              </div>
              <input
                name="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.password ? "border-red-500" : "border-gray-300"}`}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              <div className="text-lg font-bold">Register as</div>
              <div className="flex gap-6">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Student</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="alumni"
                    checked={formData.role === "alumni"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Alumni</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="faculty"
                    checked={formData.role === "faculty"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Faculty</span>
                </label>
              </div>
              <select
                required
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.batch ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="" disabled>
                  Select Year of Graduation
                </option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <input
                required
                name="enrollmentnumber"
                type="text"
                placeholder="Enter Enrollment Number"
                value={formData.enrollmentnumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${error.enrollmentnumber ? "border-red-500" : "border-gray-300"}`}
              />
              <div className="w-auto flex items-center h-4 text-neutral-400 text-xs font-normal">
                <LuInfo className="mx-1" />
                <span>All information will be recorded</span>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg font-semibold hover:bg-zinc-100-400 transition-colors"
                >
                  &lt; Back
                </button>
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Done"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md w-[400px] h-[450px] p-8 flex flex-col items-center justify-end relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 text-xl"
            >
              ✕
            </button>
            <div className="w-36 h-36 mb-4 mt-4">
              <img src={CheckmarkAnimation} alt="Checkmark Animation" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Thank You!
            </h2>
            <p className="text-center text-gray-600 text-sm mb-8">
              Thank you for registering with Network_Next. Our team will verify
              your account.
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

export default UserDetail;
