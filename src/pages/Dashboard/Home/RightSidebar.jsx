import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const currentUserId = Cookies.get("id");

  // Fetch suggested users based on the current user ID
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!currentUserId) {
        console.error("currentUserId is null or undefined");
        setLoadingUsers(false);
        return;
      }

      try {
        const { data: suggestedResponse } = await axiosInstance.get(
          `/recommadation/suggested-users/${currentUserId}`
        );

        if (suggestedResponse.success && suggestedResponse.data.length > 0) {
          const userPromises = suggestedResponse.data.map((id) =>
            axiosInstance.get(`/users/${id}`)
          );

          const usersData = await Promise.all(userPromises);
          const suggestedProfiles = usersData.map((res) => ({
            id: res.data.data._id,
            firstName: res.data.data.firstName,
            lastName: res.data.data.lastName,
            role: res.data.data.role,
            tagLine: res.data.data.tagLine,
            profileImageUrl: res.data.data.profileimageUrl,
          }));

          setSuggestedUsers(suggestedProfiles);
        } else {
          console.warn("No suggested users found.");
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (currentUserId) {
      fetchSuggestedUsers();
    }
  }, [currentUserId]);

  // Fetch upcoming events
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
    <div className="w-1/3 mt-4 bg-white px-4">
      {/* Upcoming Events Section */}
      <div className="border p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Upcoming Events</h3>
          <button className="text-black font-semibold text-sm hover:underline">
            Explore All
          </button>
        </div>

        {loadingEvents ? (
          <p className="text-gray-500 text-center  mt-4">Loading...</p>
        ) : (
          <div className="grid gap-2 mt-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100  grid-cols-[80px_1fr] gap-4 items-center p-1 border rounded-md shadow-sm"
                >
                  <img
                    src={event.eventPhoto || "https://via.placeholder.com/80"}
                    alt={event.title}
                    className="rounded-md w-20 h-20 object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold line-clamp-2">
                      {event.title}
                    </p>
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
              <p className="text-gray-500 text-center">
                No upcoming events found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Suggested Profiles Section */}
      <div className="px-2 py-2 rounded-lg mt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Suggested Profiles</h3>
        </div>

        {loadingUsers ? (
          <p className="text-gray-500 text-center mt-4">Loading...</p>
        ) : (
          <div className="grid  gap-4 mt-2">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((profile) => (
                <div
                  key={profile.id}
                  className="grid bg-gradient-to-br from-gray-100 via-white to-gray-200 grid-cols-[50px_1fr] gap-2 border shadow-sm items-center rounded-lg px-4 py-2"
                >
                  <img
                    src={
                      profile.profileImageUrl ||
                      "https://via.placeholder.com/50"
                    }
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-md">
                        {profile.firstName} {profile.lastName}
                      </h4>
                      <button className="text-white font-semibold px-3 bg-blue-600 items-center justify-center rounded-lg text-base hover:bg-blue-800 hover:text-white transition">
                        <span className="text-lg"></span> Follow
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {profile.tagLine || "No tagline available"}
                    </p>
                    <p className="text-sm text-gray-500">{profile.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No suggested profiles found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
