import { useState, useEffect } from "react";

const VolunteerCard = ({ position, onApply }) => {
  const {
    _id: positionId,
    positionTitle,
    skills,
    availablePositions,
    rolesResponsibility,
    eligibility,
    eventDetails,
    applied,
  } = position;

  const {
    title: eventTitle,
    venue,
    link,
    date,
    time,
    eventCoordinator,
    coordinatorphone,
  } = eventDetails || {};

  // Local state to track if the user has applied
  const [isApplied, setIsApplied] = useState(applied);

  // Check if the user has previously applied for this position
  useEffect(() => {
    const appliedPositions = JSON.parse(localStorage.getItem("appliedPositions")) || [];
    if (appliedPositions.includes(positionId)) {
      setIsApplied(true); // If position is in applied list, mark as applied
    }
  }, [positionId]);

  const handleApply = () => {
    // Update the applied state in localStorage
    const appliedPositions = JSON.parse(localStorage.getItem("appliedPositions")) || [];
    if (!appliedPositions.includes(positionId)) {
      appliedPositions.push(positionId);
      localStorage.setItem("appliedPositions", JSON.stringify(appliedPositions));
    }

    // Set the local state to "applied"
    setIsApplied(true);

    // Call the passed onApply function (API call logic)
    if (onApply) {
      onApply(positionId); // Assuming onApply is an API call function
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 rounded-xl shadow-lg border border-gray-300 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      {/* Main Content */}
      <div>
        <p className="font-bold text-lg mb-2">
          <strong>Event : </strong> {eventTitle}
        </p>
        <h3 className="font-bold text-lg mb-2">
          <strong>Position : </strong>
          {positionTitle}
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Venue:</strong> {venue || "Online"}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Link:</strong>{" "}
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Date:</strong> {new Date(date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Time:</strong> {time}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Coordinator:</strong> {eventCoordinator}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Phone:</strong> {coordinatorphone}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Skills:</strong> {skills}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Available Positions:</strong> {availablePositions}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Roles & Responsibilities:</strong> {rolesResponsibility}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Eligibility:</strong> {eligibility}
        </p>
      </div>

      {/* Footer with Apply Button */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={handleApply}
          className={`px-12 py-2 rounded-lg ${
            isApplied
              ? "bg-green-600 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isApplied}
        >
          {isApplied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default VolunteerCard;
