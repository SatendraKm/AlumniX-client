import { useState, useEffect } from "react";
import Logo from "../../../../assets/chat/logo.svg";

export default function Contacts({ changeChat, currentUser }) {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  // Fetch current user details
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(`${currentUser.firstName} ${currentUser.lastName}`);
      setCurrentUserImage(currentUser.profileimageUrl);
    }
  }, [currentUser]);

  // Fetch data for users the current user is following
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      if (currentUser?.following?.length > 0) {
        try {
          const followingData = await Promise.all(
            currentUser.following.map(async (id) => {
              const response = await fetch(
                `https://n-square.onrender.com/api/network-next/v1/users/${id}`
              );
              const data = await response.json();
              return data.data; // Extract user data from API response
            })
          );
          setFollowingUsers(followingData);
        } catch (error) {
          console.error("Error fetching following users:", error);
        }
      }
    };
    fetchFollowingUsers();
  }, [currentUser]);

  // Handle chat change
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && currentUserImage && (
        <div className="grid grid-rows-[15%_70%_15%] h-[600px] bg-gray-50 rounded-lg shadow">
          {/* Brand Section */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-200 rounded-t-lg shadow-inner">
            <img src={Logo} alt="logo" className="h-8" />
            <h3 className="text-gray-700 uppercase font-semibold">N-square</h3>
          </div>

          {/* Contacts Section */}
          <div className="flex flex-col items-center gap-3 overflow-auto p-4 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {followingUsers.map((contact, index) => (
              <div
                key={contact._id}
                className={`w-full flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  index === currentSelected
                    ? "bg-blue-100 border-2 border-blue-400"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <img
                  src={contact.profileimageUrl}
                  alt="contact avatar"
                  className="h-10 w-10 rounded-full shadow"
                />
                <div>
                  <h3 className="text-gray-700 font-medium">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {contact.tagLine || "No tagline available"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current User Section */}
          <div className="flex items-center justify-center gap-4 bg-gray-200 p-4 rounded-b-lg shadow-inner">
            <img
              src={currentUserImage}
              alt="current user avatar"
              className="h-12 w-12 rounded-full shadow"
            />
            <div>
              <h2 className="text-gray-700 font-semibold">{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
