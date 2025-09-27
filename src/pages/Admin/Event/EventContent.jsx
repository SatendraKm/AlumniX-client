import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import EventCard from "./EventCard";
// import { useNavigate } from "react-router-dom";
import RightSidebar from "./RightSidebar.jsx";
import Cookies from "js-cookie";

//Tasting brach
const EventContent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = Cookies.get("id");
  const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event
  const tabs = ["All", "Alumni", "Faculty", "Student"];
  //const navigate = useNavigate();

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/event/all");
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle like action
  const handleLikeEvent = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/event/like/${eventId}`);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? {
                ...event,
                likes: response.data.likes,
                dislikes: response.data.dislikes,
              }
            : event
        )
      );
    } catch (error) {
      console.error(`Error liking event ${eventId}:`, error);
    }
  };

  // Handle dislike action
  const handleDislikeEvent = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/event/dislike/${eventId}`);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? {
                ...event,
                likes: response.data.likes,
                dislikes: response.data.dislikes,
              }
            : event
        )
      );
    } catch (error) {
      console.error(`Error disliking event ${eventId}:`, error);
    }
  };

  // Handle event selection for conditional button display
  const handleSelectEvent = (eventId, isSelected) => {
    if (isSelected) {
      setSelectedEvent(events.find((event) => event._id === eventId));
    } else {
      setSelectedEvent(null);
    }
  };

  // Filtering logic
  const filteredEvents = events.filter((event) => {
    if (activeTab === "All") return true;
    if (activeTab === "Alumni") return event.createdBy?.role === "alumni";
    if (activeTab === "Faculty") return event.createdBy?.role === "faculty";
    if (activeTab === "Student") return event.createdBy?.role === "student";
    return false;
  });

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div className="w-[100%] flex">
      {/* Event Cards */}
      <div className="w-[75%]">
        <div className="flex border border-gray-300 justify-around bg-white rounded-2xl shadow-lg px-2 py-1 m-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-4 py-2 rounded-full font-semibold ${activeTab === tab ? "text-black font-bold" : "text-gray-500"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {!filteredEvents.length && !loading && (
          <p>No events found for {activeTab}.</p>
        )}

        <div className="p-4">
          <div
            className=" grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto hide-scrollbar"
            style={{ maxHeight: "calc(110vh - 160px)" }}
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                currentUserId={currentUserId}
                onLikeEvent={handleLikeEvent}
                onDislikeEvent={handleDislikeEvent}
                onSelectEvent={handleSelectEvent}
                isSelected={selectedEvent?._id === event._id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar selectedEvent={selectedEvent} />
    </div>
  );
};

export default EventContent;
