import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = JSON.parse(localStorage.getItem("chat-app-current-user"));
        if (data) {
          setCurrentUserName(`${data.firstName} ${data.lastName}`);
          setCurrentUserImage(data.profileimageUrl);
        }
      } catch (error) {
        console.error("Error reading user data from localStorage:", error);
      }
    };

    fetchUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && currentUserImage && (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full h-full flex flex-col">
          {/* Logo and App Name */}
          <div className="flex items-center mb-6">
            <img src={Logo} alt="logo" className="w-12 h-12" />
            <h3 className="text-2xl font-bold text-gray-800 ml-3">N-square</h3>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                onClick={() => changeCurrentChat(index, contact)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition duration-200 ${
                  currentSelected === index
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <img
                  src={
                    contact.groupProfileImage ||
                    `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/40`
                  }
                  alt="Group"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {contact.name || "Unnamed Group"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {contact.members?.length || 0} members
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current User Info */}
          <div className="mt-6 p-3 bg-gray-200 rounded-lg flex items-center gap-4 shadow-sm">
            <img
              src={currentUserImage || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/40`}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <h2 className="text-lg font-bold text-gray-800">
              {currentUserName}
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
