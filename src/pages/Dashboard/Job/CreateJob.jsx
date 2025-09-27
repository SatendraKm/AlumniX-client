import { useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";

const CreateJob = ({ onClose }) => {
  const [jobphoto, setJobphoto] = useState(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [type, setType] = useState("");
  const [stipendOrSalary, setStipendOrSalary] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const validateAndFormatApplyLink = (value) => {
    // Basic URL validation regex
    const urlRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!value) return ""; // Allow empty input
    if (urlRegex.test(value)) {
      // Ensure it starts with https://
      return value.startsWith("http") ? value : `https://${value}`;
    }
    return null; // Return null if invalid
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "jobphoto") {
        setJobphoto(files[0]);
        setProfileImagePreview(URL.createObjectURL(files[0]));
      }
    } else {
      switch (name) {
        case "title":
          setTitle(value);
          break;
        case "company":
          setCompany(value);
          break;
        case "location":
          setLocation(value);
          break;
        case "description":
          setDescription(value);
          break;
        case "skills":
          setSkills(value);
          break;
        case "type":
          setType(value);
          break;
        case "stipendOrSalary":
          setStipendOrSalary(value);
          break;
        case "applyLink":{
          const formattedLink = validateAndFormatApplyLink(value);
          if (formattedLink !== null) {
            setError(""); // Clear error if valid
            setApplyLink(formattedLink);
          } else {
            setError("Please enter a valid URL.");
          }
          break;
        }
        default:
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!applyLink || validateAndFormatApplyLink(applyLink) === null) {
      setError("Please provide a valid Apply Link.");
      setIsSubmitting(false);
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append("jobphoto", jobphoto);
    formData.append("title", title);
    formData.append("company", company);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("skills", skills);
    formData.append("type", type);
    formData.append("stipendOrSalary", stipendOrSalary);
    formData.append("applyLink", applyLink);

    try {
      const response = await axiosInstance.post("/jobs/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success === true) {
        toast.success("Job created successfully!");
      } else {
        toast.error("Failed to create Job");
      }

      console.log("Job created successfully:", response.data);
      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Error creating job:", err);
      setError("An error occurred while creating the job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Create a Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        <form
          className="space-y-3 overflow-y-auto hide-scrollbar"
          style={{ maxHeight: "calc(80vh - 170px)" }}
          onSubmit={handleSubmit}
        >
          {/* Profile Photo */}
          <div className="flex flex-col items-center ">
            <label
              htmlFor="jobphoto"
              className="w-14 h-14 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-200 transition ease-in-out duration-200"
            >
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="rounded-full w-12 h-12 object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-500">📎</span>
              )}
            </label>
            <input
              type="file"
              name="jobphoto"
              id="jobphoto"
              onChange={handleInputChange}
              className="hidden"
            />
            <span className="text-sm text-gray-600 mt-2">Upload Job Photo</span>
          </div>

          {/* Input Fields */}
          {[
            { label: "Job Title", name: "title", value: title, type: "text" },
            { label: "Company", name: "company", value: company, type: "text" },
            { label: "Job Location", name: "location", value: location, type: "text" },
            { label: "Skills", name: "skills", value: skills, type: "text" },
            {
              label: "Stipend Or Salary",
              name: "stipendOrSalary",
              value: stipendOrSalary,
              type: "text",
            },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleInputChange}
                placeholder={field.label}
                className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select
              name="type"
              value={type}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Job Type</option>
              <option value="internship">Internship</option>
              <option value="apprenticeship">Apprenticeship</option>
              <option value="job">Job</option>
            </select>
          </div>

          {/* Apply Link */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Apply Link (This Will be provided to all registered Users)
            </label>
            <input
              type="applyLink"
              name="applyLink"
              value={applyLink}
              onChange={handleInputChange}
              placeholder="Apply Link (e.g., linkedin.com, https://example.com)"
              className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={handleInputChange}
              rows="2"
              placeholder="Add a description"
              className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default CreateJob;
