import { useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosinstance";
import NetworkNext from "../../assets/icons/Network Next.svg";
import Nsquare from "../../assets/icons/logo nsqaure 1.svg";

const courseOptions = [
  { value: "Computer Science and Engineering", label: "Computer Science and Engineering" },
  { value: "Business Administration", label: "Business Administration" },
  { value: "Mechanical Engineering", label: "Mechanical Engineering" },
  { value: "Civil Engineering", label: "Civil Engineering" },
  { value: "Electrical Engineering", label: "Electrical Engineering" },
  { value: "Psychology", label: "Psychology" },
  { value: "Nursing and Healthcare", label: "Nursing and Healthcare" },
  { value: "Law and Legal Studies", label: "Law and Legal Studies" },
  { value: "Media and Communication", label: "Media and Communication" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Economics", label: "Economics" },
  { value: "Fine Arts and Design", label: "Fine Arts and Design" },
];

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college_address: "",
    university_id: "",
    courses: [],
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      validateEmail(value);
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    // General regex for validating emails (allows different domains, including .ac.in, .com, etc.)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address (e.g., example@gmail.com or admin@opju.ac.in).");
    } else {
      setEmailError("");
    }
  };

  const handleCourseChange = (selectedOptions) => {
    setFormData({ ...formData, courses: selectedOptions });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (emailError) {
      toast.error("Please correct the errors in the form before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        college_address: formData.college_address,
        university_id: formData.university_id,
        courses: formData.courses.map((course) => course.value),
        password: formData.password,
      };

      await axiosInstance.post("/organizations/signup", payload);

      toast.success("Organization registered successfully!");
      navigate("/organization-login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register organization.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-white text-black font-sans overflow-auto">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between w-full px-4 py-2">
        <Link to="/">
          <img src={NetworkNext} alt="Network Next" className="h-5" />
        </Link>
        <button className="p-2">
          <X className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Register Form */}
      <div className="w-full max-w-md flex flex-col items-center px-4 pt-2 pb-4">
        <div className="text-center mb-4">
          <img src={Nsquare} alt="Logo" className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-lg font-semibold">Register Your Organization</h1>
        </div>

        <form onSubmit={handleFormSubmit} className="w-full space-y-4">
          {/* Name Field */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Name of the Organization"
            required
          />

          {/* Email Field */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Enter Organization Email"
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          {/* College Address Field */}
          <input
            type="text"
            name="college_address"
            value={formData.college_address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Enter your college address"
            required
          />

          {/* College Registration ID Field */}
          <input
            type="text"
            name="university_id"
            value={formData.university_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Enter College Registration ID"
            required
          />

          {/* Courses Multi-Select */}
          <Select
            options={courseOptions}
            isMulti
            value={formData.courses}
            onChange={handleCourseChange}
            className="w-full"
            classNamePrefix="select"
            placeholder="Select Courses"
          />

          {/* Password Field */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Password"
            required
          />

          {/* Confirm Password Field */}
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Confirm your password"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Footer Links */}
      <div className="text-center text-gray-600 text-sm mb-2">
        <Link to="/organization-login" className="text-blue-600 font-medium hover:underline">
          Login as organization
        </Link>
      </div>
    </div>
  );
};

export default RegisterOrganization;
