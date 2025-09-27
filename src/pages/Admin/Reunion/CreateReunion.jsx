import { useState } from "react";
import { toast } from "react-toastify";

const CreateReunion = ({ onClose }) => {
  const [mode, setMode] = useState(""); // Tracks Online or Offline mode
  const [formData, setFormData] = useState({
    eventType: "",
    batch: "",
    date: "",
    time: "",
    venue: "",
    link: "",
    contact: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === "Online") {
      setFormData((prev) => ({ ...prev, venue: "" })); // Clear venue field
    } else if (selectedMode === "Offline") {
      setFormData((prev) => ({ ...prev, link: "" })); // Clear link field
    }
  };

  const handleDiscard = () => {
    setFormData({
      eventType: "",
      batch: "",
      date: "",
      time: "",
      venue: "",
      link: "",
      contact: "",
    });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (formData.data.success === true) {
        toast.success("Reunion Event created successfully!");
      } else {
        toast.error("Failed to create Reunion Event");
      }
    } catch (error) {
      console.error("Error creating Reunion:", error);
      alert("An error occurred");
    }
    onClose(); // Close popup after submission
  };

  return (
    <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Create Reunion Party
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Event Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Type of Event
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Event Type</option>
              <option value="Reunion">Reunion</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>

          {/* Batch */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Batch
            </label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Batch</option>
              <option value="Batch 2020">Batch 2020</option>
              <option value="Batch 2021">Batch 2021</option>
            </select>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Mode */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Mode
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="Online"
                  checked={mode === "Online"}
                  onChange={() => handleModeChange("Online")}
                  className="mr-2"
                />
                Online
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value="Offline"
                  checked={mode === "Offline"}
                  onChange={() => handleModeChange("Offline")}
                  className="mr-2"
                />
                Offline
              </label>
            </div>
          </div>

          {/* Online Mode Field */}
          {mode === "Online" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Event Link
              </label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter event link"
                required
              />
            </div>
          )}

          {/* Offline Mode Field */}
          {mode === "Offline" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter venue"
                required
              />
            </div>
          )}

          {/* Contact */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter contact details"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReunion;
