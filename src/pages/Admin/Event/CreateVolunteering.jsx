import { useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";

const CreateVolunteer = ({ onClose, eventId }) => {
  const [positionTitle, setPositionTitle] = useState("");
  const [rolesResponsibility, setRolesResponsibility] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [skills, setSkills] = useState("");
  const [volunteerCount, setVolunteerCount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        eventId,
        positionTitle,
        rolesResponsibility,
        eligibility,
        skills,
        volunteerCount,
      };
      const response = await axiosInstance.post("/volunteer/create", payload);
      if (response.data.success === true) {
        toast.success("Volunteer Position created successfully!");
      } else {
        toast.error("Failed to create Volunteer Position");
      }
      onClose(); // Close the popup after successful creation
    } catch (error) {
      console.error(
        "Error creating volunteer position:",
        error.response || error
      );
    }
  };

  const handleDiscard = () => {
    setPositionTitle("");
    setRolesResponsibility("");
    setEligibility("");
    setSkills("");
    setVolunteerCount("");
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Creating Volunteering Position
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Volunteer Position Title
            </label>
            <select
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="Event Coordinator">Event Coordinator</option>
              <option value="Manager">Manager</option>
              <option value="Support">Support</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Roles/Responsibility
            </label>
            <input
              type="text"
              value={rolesResponsibility}
              onChange={(e) => setRolesResponsibility(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
              placeholder="Enter roles and responsibility"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Eligibility
            </label>
            <input
              type="text"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
              placeholder="Describe eligibility criteria"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Skills/Qualification
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
              placeholder="Enter skills and qualifications required"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Number of Volunteers Required
            </label>
            <input
              type="number"
              value={volunteerCount}
              onChange={(e) => setVolunteerCount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
              placeholder="Enter number of volunteers"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
