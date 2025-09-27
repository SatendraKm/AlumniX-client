import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";

// ReunionCard Component
const ReunionCard = ({ reunion }) => {
  // Destructuring safely with default values to avoid destructuring errors
  const {
    _id,
    typeOfEvent = "Unknown Event", // Default values for undefined properties
    batch = "N/A",
    date = "N/A",
    time = "N/A",
    venue = "Unknown Venue",
    contact = "N/A",
    eligibility = "N/A",
    createdBy = { _id: null }, // Default to an object with _id as null
  } = reunion || {}; // Ensure reunion is not undefined

  const [organizerName, setOrganizerName] = useState("Loading...");

  // Fetch organizer details
  useEffect(() => {
    if (createdBy._id) {
      const fetchOrganizerDetails = async () => {
        try {
          const response = await axiosInstance.get(`/users/${createdBy._id}`);
          if (response.data?.success) {
            const { firstName, lastName } = response.data.data;
            setOrganizerName(`${firstName} ${lastName}`);
          } else {
            setOrganizerName("Unknown");
          }
        } catch (error) {
          console.error("Error fetching organizer details:", error);
          setOrganizerName("Error fetching organizer");
        }
      };
      fetchOrganizerDetails();
    }
  }, [createdBy]);

  return (
    <div className="relative border p-4 m-2 border-gray-300 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg">
      {/* Event Details */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900">{typeOfEvent}</h3>
        <p className="text-sm text-gray-600">Batch: {batch}</p>
        <p className="text-sm text-gray-600">
          Date: {new Date(date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">Time: {time}</p>
        <p className="text-sm text-gray-600">Venue: {venue}</p>
        <p className="text-sm text-gray-600">Eligibility: {eligibility}</p>
        <p className="text-sm text-gray-600">Contact: {contact}</p>
      </div>

      {/* Organizer Info */}
      <div className="absolute bottom-4 right-4">
        <p className="text-sm text-gray-500 font-medium underline">
          Organized By -{" "}
          <span className="text-gray-700 font-semibold">{organizerName}</span>
        </p>
      </div>
    </div>
  );
};

export default ReunionCard;
