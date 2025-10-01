import { useState, useEffect } from "react";
import CreateEvent from "./CreateEvent";
import axiosInstance from "../../../utils/axiosinstance";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const RightSidebar = () => {
  const role = Cookies.get("role");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const handleOpenCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleCloseCreateEvent = () => {
    setIsCreateEventOpen(false);
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const { data: upcomingEventIds } = await axiosInstance.get(
          `/recommadation/upcoming-events`
        );

        if (upcomingEventIds && upcomingEventIds.length > 0) {
          const eventPromises = upcomingEventIds.map((eventId) =>
            axiosInstance.get(`/event/${eventId}`)
          );

          const eventsData = await Promise.all(eventPromises);
          const events = eventsData.map((res) => ({
            id: res.data.event._id,
            title: res.data.event.title,
            eventPhoto: res.data.event.eventphoto,
            description: res.data.event.eventDescription,
            tags: res.data.event.tagsTopic,
          }));

          console.log("Upcoming events fetched successfully:", events);
          setUpcomingEvents(events);
        } else {
          console.warn("No upcoming events found.");
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="relative w-[30%] mt-2 mb-auto bg-white px-2 rounded-lg p-11">
      {/* Create Event Button Positioned Top Right */}
      <div className="absolute top-2 right-8 mx-auto">
  {/* Create Event Button */}
  <button
    onClick={handleOpenCreateEvent}
    className="px-4 py-2 text-black border border-black rounded-full hover:bg-black hover:text-white"
  >
    Create Event
  </button>
</div>

{/* Create Event Popup */}
{isCreateEventOpen && <CreateEvent onClose={handleCloseCreateEvent} />}

<div className="mt-16 mb-0 p-2">
  {/* Upcoming Events Section */}
  <div className="border p-4 rounded-xl shadow-lg">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg">Upcoming Events</h3>
      <button className="text-black font-semibold text-sm hover:underline">
        Explore All
      </button>
    </div>

    {loadingEvents ? (
      <p className="text-gray-500 text-center mt-4">Loading...</p>
    ) : (
      <div className="grid gap-2 mt-2">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="grid bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 grid-cols-[80px_1fr] gap-4 items-center p-1 border rounded-md shadow-sm"
            >
              <img
                src={event.eventPhoto || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/80`}
                alt={event.title}
                className="rounded-md w-20 h-20 object-cover"
              />
              <div>
                <p className="text-sm font-bold line-clamp-2">{event.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {event.description}
                </p>
                <p className="text-xs text-blue-600 font-semibold mt-0 line-clamp-2 underline">
                  Read More
                </p>
                <div className="flex justify-between mt-1">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-200 text-blue-700 py-1 px-2 rounded-full font-medium shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to="/dashboard/event/about-event">
                    <button className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No upcoming events found.</p>
        )}
      </div>
    )}
  </div>
</div>
</div>
  );
};


export default RightSidebar;
