import { useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../../../utils/axiosinstance"; // Ensure the path to your axios instance is correct

const CreateFund = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    creator: Cookies.get("id"),
    fundImage: null,
    fundPicPreview: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fundImage: file,
        fundPicPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("creator", formData.creator);
    if (formData.fundImage) {
      data.append("fundImage", formData.fundImage);
    }

    try {
      const response = await axiosInstance.post("/funding/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Fund created successfully!");
        onClose();
      } else {
        alert("Failed to create fund: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating fund:", error);
      alert("An error occurred while creating the fund.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg relative w-full max-w-md">
          {/* Discard (cross) button */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold absolute top-4 right-4"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-4">Create New Fund</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fund Pic Field with Preview */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Fund Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600 cursor-pointer"
              />
              {formData.fundPicPreview && (
                <img
                  src={formData.fundPicPreview}
                  alt="Fund Preview"
                  className="mt-2 h-32 w-full object-cover rounded border"
                />
              )}
            </div>

            {/* Fund Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Fund Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter fund name"
                required
              />
            </div>

            {/* Fund Description Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Fund Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter fund description"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Fund"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFund;
