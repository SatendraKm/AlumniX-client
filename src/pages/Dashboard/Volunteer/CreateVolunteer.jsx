import { useState } from "react";
import { toast } from "react-toastify";

const CreateVolunteer = ({ onClose }) => {
  const [formData, setFormData] = useState({
    eventType: "",
    batch: "",
    date: "",
    time: "",
    venue: "",
    contact: "",
    eligibility: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (formData.data.success === true) {
        toast.success("Volunteer Position created successfully!");
      } else {
        toast.error("Failed to create Volunteer Position");
      }
    } catch (error) {
      console.error("Error creating Volunteer Position:", error);
      alert("An error occurred");
    }

    // You can add API submission logic here
    onClose(); // Close the popup after submission
  };

  const handleDiscard = () => {
    setFormData({
      eventType: "",
      batch: "",
      date: "",
      time: "",
      venue: "",
      contact: "",
      eligibility: "",
    });
    onClose(); // Close the popup when discard is clicked
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[100%] max-w-lg rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Creating Volunteering Position
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type of Event
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          {/* Add other fields here without any changes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Batch
            </label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Select Venue */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              placeholder="Enter Venue"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contact
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="Enter Contact"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Eligibility */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Eligibility
            </label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleInputChange}
              placeholder="Enter Eligibility"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Buttons */}
          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVolunteer;
