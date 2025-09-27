import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance"; // Assuming axiosInstance is set up
import VolunteerCard from "./VolunteerCard";
import { toast } from "react-toastify";

const VolunteerContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteerPositions, setVolunteerPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch the current user ID from localStorage
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = JSON.parse(
        localStorage.getItem("chat-app-current-user")
      );
      if (storedUser && storedUser._id) {
        setCurrentUserId(storedUser._id);
      } else {
        console.error("No current user found in localStorage");
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch volunteer positions with event details
  useEffect(() => {
    const fetchVolunteerPositions = async () => {
      try {
        const response = await axiosInstance.get(
          "/volunteer/get-all-volunteer-position"
        );
        if (response.data && Array.isArray(response.data)) {
          const positionsWithEvents = await Promise.all(
            response.data.map(async (position) => {
              try {
                const eventResponse = await axiosInstance.get(
                  `/event/${position.eventId}`
                );
                return {
                  ...position,
                  eventDetails: eventResponse.data?.event,
                };
              } catch (eventError) {
                console.error(
                  `Error fetching event for position ${position._id}:`,
                  eventError
                );
                return position; // Fallback to just the position details
              }
            })
          );
          setVolunteerPositions(positionsWithEvents);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching volunteer positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerPositions();
  }, []);

  // Filter volunteer positions based on the search query
  const filteredPositions = volunteerPositions.filter((position) =>
    position.positionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle the apply action
  const handleApply = async (positionId) => {
    if (!currentUserId) {
      alert("Please log in to apply.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/volunteer/apply-volunteer/${positionId}`,
        {
          userId: currentUserId,
        }
      );

      if (response.data.success) {
        toast.success("Successfully applied for the volunteer position!");
        alert("Successfully applied for the volunteer position!");
        // Update the state to mark the position as applied
        setVolunteerPositions((prevPositions) =>
          prevPositions.map((position) =>
            position._id === positionId
              ? { ...position, applied: true }
              : position
          )
        );
      } else {
        toast.error("Failed to apply for the volunteer position!");
      }
    } catch (error) {
      console.error("Error applying for volunteer position:", error);
      alert("Error applying for the position. Please try again later.");
    }
  };

  if (loading) {
    return <p>Loading volunteer positions...</p>;
  }

  if (!filteredPositions.length) {
    return <p>No volunteer positions found.</p>;
  }

  return (
    <div className="w-full p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find a Position"
          className="w-[700px] px-4 py-2 border border-gray-300 shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Volunteer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPositions.map((position) => (
          <VolunteerCard
            key={position._id}
            position={position}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
};

export default VolunteerContent;
