import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import CreateVolunteering from "./CreateVolunteering"; // Import the modal component

const AboutEvent = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // State for current user ID
  const [isEventCreator, setIsEventCreator] = useState(false); // State for event ownership

  const {
    _id,
    title,
    eventphoto,
    speaker,
    date,
    time,
    tagsTopic,
    link,
    attending,
  } = location.state || {};

  // Fetch current user ID from local storage
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const storedUser = JSON.parse(
        localStorage.getItem("chat-app-current-user")
      );
      if (storedUser && storedUser._id) {
        setCurrentUserId(storedUser._id);
      } else {
        console.error("No current user found in localStorage");
      }
    };

    fetchCurrentUserId();
  }, []);

  // Verify if the current user is the event creator
  useEffect(() => {
    const checkEventCreator = async () => {
      try {
        if (currentUserId && _id) {
          const response = await axiosInstance.get(
            `/event/user/${currentUserId}`
          );
          const userEvents = response.data.events;

          const userCreatedEvent = userEvents.some(
            (event) => event._id === _id
          );
          setIsEventCreator(userCreatedEvent);
        }
      } catch (error) {
        console.error(
          "Error verifying event creator:",
          error.response || error
        );
      }
    };

    checkEventCreator();
  }, [currentUserId, _id]);

  // Check if the event details are missing
  if (!title) {
    return <div className="text-center mt-10 text-lg font-semibold text-gray-500">Event details not found!</div>;
  }

  return (
    <div className="flex justify-center p-8 overflow-auto bg-white">
      <div className="bg-white shadow-lg rounded-xl max-w-6xl w-full p-6">
        {/* Event Image */}
        <img
          src={eventphoto}
          className="w-full h-[300px] object-cover rounded-xl shadow-sm"
          alt={title}
        />

        {/* Event Details */}
        <p className="mt-4 text-gray-600 text-sm">
          {new Date(date).toLocaleDateString()} | {time}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-800">{title}</h1>

        <p className="text-blue-600 text-md font-medium mt-2">{speaker}</p>

        <p className="mt-6 text-gray-700 leading-relaxed">
          Join us for an engaging session on <b>{title}</b> with {speaker}.
        </p>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-3 mt-6">
          {tagsTopic?.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-gray-200 text-gray-700 py-1 px-3 rounded-full shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.open(link, "_blank")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Register for the Event
          </button>

          {isEventCreator && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition w-full sm:w-auto"
            >
              Create Volunteer Position
            </button>
          )}
        </div>

        {/* Attendees Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800">Attendees</h3>
          <p className="text-gray-600 text-sm mt-1">
            Total Attending: {attending?.length || 0}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <CreateVolunteering
            eventId={_id} // Pass event ID as a prop
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AboutEvent;
