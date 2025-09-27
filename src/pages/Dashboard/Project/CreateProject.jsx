import { useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectType: "",
    projectPhoto: null,
    technologyUsed: "",
    fundingRequired: "true",
    department: "",
    projectPhase: "initial",
    projectTopic: "",
    description: "",
    eligibility: "",
    projectLinks: {
      GitHub: "",
      Docs: "",
    },
    openForMentor: false,
    openForStudent: true,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (type === "file") {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleProjectLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      projectLinks: {
        ...prevData.projectLinks,
        [name]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.projectType) errors.projectType = "Project Type is required.";
    if (!formData.projectTopic)
      errors.projectTopic = "Project Topic is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.department) errors.department = "Department is required.";
    if (!formData.eligibility) errors.eligibility = "eligibility is required.";

    if (!formData.technologyUsed) {
      errors.technologyUsed = "Technology Used is required.";
    } else if (typeof formData.technologyUsed === "string") {
      const techArray = formData.technologyUsed
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      if (techArray.length === 0) {
        errors.technologyUsed = "Please provide valid comma-separated values.";
      }
    } else {
      errors.technologyUsed =
        "Technology Used must be a comma-separated string.";
    }

    // Always return the errors object
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError({});
    setIsLoading(true);

    const techArray =
      typeof formData.technologyUsed === "string"
        ? formData.technologyUsed.split(",").map((item) => item.trim())
        : formData.technologyUsed;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("technologyUsed", JSON.stringify(techArray));
    formDataToSubmit.append(
      "fundingRequired",
      formData.fundingRequired === "true"
    );
    formDataToSubmit.append("projectType", formData.projectType);
    formDataToSubmit.append("department", formData.department);
    formDataToSubmit.append("projectPhase", formData.projectPhase);
    formDataToSubmit.append("projectTopic", formData.projectTopic);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("eligibility", formData.eligibility);
    formDataToSubmit.append(
      "projectLinks",
      JSON.stringify(formData.projectLinks)
    );
    if (formData.projectPhoto) {
      formDataToSubmit.append("projectPhoto", formData.projectPhoto);
    }
    formDataToSubmit.append("openForMentor", formData.openForMentor);
    formDataToSubmit.append("openForStudent", formData.openForStudent);
    console.log("Data to be posted:");
    formDataToSubmit.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      const response = await axiosInstance.post(
        "/project/create",
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Project created successfully!");
    } catch (error) {
      console.error("API Error Details:", error.response?.data);
      toast.error("Error creating project. Please try again.");
    } finally {
      setIsLoading(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white ">
      <div className="w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold underline mb-6">Create Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className={`block w-full rounded-md border py-3 px-4 ${
                  error.projectType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Select Project Type
                </option>
                <option value="Business and Management Projects">
                  Business and Management Projects
                </option>
                <option value="Research Projects">Research Projects</option>
                <option value="Software Development">
                  Software Development
                </option>
              </select>
              {error.projectType && (
                <span className="text-red-500 text-sm">
                  {error.projectType}
                </span>
              )}

              {error.projectType && (
                <span className="text-red-500 text-sm">
                  {error.projectType}
                </span>
              )}

              <div className="flex flex-col items-center mt-6">
                <label
                  htmlFor="projectPhoto"
                  className="w-24 h-24 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-200"
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Project Preview"
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-500">📎</span>
                  )}
                </label>
                <input
                  type="file"
                  id="projectPhoto"
                  name="projectPhoto"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-600 mt-2">
                  Upload Project Photo
                </span>
              </div>

              <input
                type="text"
                name="technologyUsed"
                value={formData.technologyUsed}
                onChange={handleInputChange}
                placeholder="Technology Used (e.g., React, Node.js)"
                className={`block w-full mt-6 rounded-md border py-3 px-4 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  error.technologyUsed ? "border-red-500" : "border-gray-300"
                }`}
              />
              {error.technologyUsed && (
                <span className="text-red-500 text-sm">
                  {error.technologyUsed}
                </span>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Funding</h2>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fundingRequired"
                      value="true"
                      checked={formData.fundingRequired === "true"}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Required</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fundingRequired"
                      value="false"
                      checked={formData.fundingRequired === "false"}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Not Required</span>
                  </label>
                </div>
              </div>

              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="block w-full mt-6 rounded-md border py-3 px-4"
              >
                <option value="" disabled>
                  Select Department
                </option>
                <option value="Computer Science & Engineering">
                  Computer Science & Engineering
                </option>
                <option value="Bio-Tech">Bio-Tech</option>
                <option value="Bsc">Bsc</option>
                <option value="BBA">BBA</option>
              </select>
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Project Phase</h2>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="projectPhase"
                      value="initial"
                      checked={formData.projectPhase === "initial"}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Initial</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="projectPhase"
                      value="intermediate"
                      checked={formData.projectPhase === "intermediate"}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Intermediate</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="projectPhase"
                      value="advance"
                      checked={formData.projectPhase === "advance"}
                      onChange={handleInputChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Advance</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <input
                type="text"
                name="projectTopic"
                value={formData.projectTopic}
                onChange={handleInputChange}
                placeholder="Project Topic"
                className={`block w-full rounded-md border py-3 px-4 ${
                  error.projectTopic ? "border-red-500" : "border-gray-300"
                }`}
              />
              {error.projectTopic && (
                <span className="text-red-500 text-sm">
                  {error.projectTopic}
                </span>
              )}

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Project Description"
                className={`block w-full mt-6 rounded-md border py-3 px-4 ${
                  error.description ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {error.description && (
                <span className="text-red-500 text-sm">
                  {error.description}
                </span>
              )}

              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleInputChange}
                placeholder="eligibility"
                className={`block w-full mt-6 rounded-md border py-3 px-4 ${
                  error.eligibility ? "border-red-500" : "border-gray-300"
                }`}
              />
              {error.eligibility && (
                <span className="text-red-500 text-sm">
                  {error.eligibility}
                </span>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Project Links</h2>
                <input
                  type="text"
                  name="GitHub"
                  value={formData.projectLinks.GitHub}
                  onChange={handleProjectLinkChange}
                  placeholder="GitHub Link"
                  className="block w-full rounded-md border py-3 px-4 mb-4"
                />
                <input
                  type="text"
                  name="Docs"
                  value={formData.projectLinks.Docs}
                  onChange={handleProjectLinkChange}
                  placeholder="Documentation Link"
                  className="block w-full rounded-md border py-3 px-4"
                />
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Open For</h2>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="openForMentor"
                      checked={formData.openForMentor}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Mentor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="openForStudent"
                      checked={formData.openForStudent}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Student</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
