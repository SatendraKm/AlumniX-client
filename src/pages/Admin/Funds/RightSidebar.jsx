import { useState, useEffect } from "react";
import CreateFunds from "./CreateFunds";
import Cookies from "js-cookie";

const RightSidebar = () => {
  const role = Cookies.get("role");
  const [isCreateFundsOpen, setIsCreateFundsOpen] = useState(false);

  const handleOpenCreateFunds = () => {
    setIsCreateFundsOpen(true);
  };

  const handleCloseCreateFunds = () => {
    setIsCreateFundsOpen(false);
  };

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Fundraising Gala",
      description: "Join us for an evening of charity and celebration.",
      eventPhoto: `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/80`,
      tags: ["Charity", "Networking"],
    },
    {
      id: 2,
      title: "Volunteer Drive",
      description: "Help us recruit more volunteers.",
      eventPhoto: `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/80`,
      tags: ["Community", "Volunteering"],
    },
  ];

  const suggestedUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      role: "Philanthropist",
      tagLine: "Committed to making a difference.",
      profileImageUrl: `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/50`,
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      role: "Organizer",
      tagLine: "Passionate about charity work.",
      profileImageUrl: `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/50`,
    },
  ];

  return (
    <div className="mt-4 bg-white px-4  ">
      <div className="absolute top-6 right-10 ">
        {/* Reunion Button */}
        {(role === "admin") && (
          <button
          onClick={handleOpenCreateFunds}
          className="px-4 py-2 text-black border border-black rounded-full hover:bg-black hover:text-white"
        >
          Create Funds
        </button>
        )}
      </div>
      {isCreateFundsOpen && <CreateFunds onClose={handleCloseCreateFunds} />}
      {/* Upcoming Events Section */}
      <div className="border p-4 rounded-xl shadow-lg mt-14">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Top Donators</h3>
          
        </div>

        <div className="grid gap-2 mt-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="grid bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 grid-cols-[80px_1fr] gap-4 items-center p-1 border rounded-md shadow-sm"
            >
              <img
                src={event.eventPhoto}
                alt={event.title}
                className="rounded-md w-20 h-20 object-cover"
              />
              <div>
                <p className="text-sm font-bold line-clamp-2">{event.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {event.description}
                </p>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Profiles Section */}
      <div className="border p-4 rounded-xl shadow-lg">
        <h3 className="font-bold text-lg mb-4">Top Funds</h3>

        <div className="grid gap-4">
          {suggestedUsers.map((profile) => (
            <div
              key={profile.id}
              className="grid bg-gradient-to-br from-gray-100 via-white to-gray-200 grid-cols-[50px_1fr] gap-2 border shadow-sm items-center rounded-lg px-4 py-2"
            >
              <img
                src={profile.profileImageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="rounded-full w-12 h-12 object-cover"
              />
              <div>
                <h4 className="font-bold text-md">
                  {profile.firstName} {profile.lastName}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {profile.tagLine}
                </p>
                <p className="text-sm text-gray-500">{profile.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
