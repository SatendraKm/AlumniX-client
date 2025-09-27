import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { host, allGroupRoutes } from "./utils/APIRoutes";
import ChatContainer from "./components/ChatContainer";
import Contacts from "./components/Contacts";
import Welcome from "./components/Welcome";
import axiosInstance from "../../../utils/axiosinstance";

export default function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);

  const handleMyGroup = (data) => {
    if (!currentUser || !currentUser.groups) return [];
    const userGroupIds = currentUser.groups.map((group) => group.groupId);
    return data.filter((group) => userGroupIds.includes(group._id));
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUserId = Cookies.get("id");
      if (currentUserId) {
        try {
          const user = await axiosInstance.get(`/users/${currentUserId}`);
          const userData = user.data.data;
          localStorage.setItem(
            "chat-app-current-user",
            JSON.stringify(userData)
          );
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (currentUser) {
        try {
          const data = await axiosInstance.get(`${allGroupRoutes}`);
          const filteredData = handleMyGroup(data.data.groups);
          setContacts(filteredData);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      }
    };

    fetchGroups();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Get Trained For The Future, <span className="text-blue-600">Today</span>
        </h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-[30%_70%]">
          {/* Contacts Section */}
          <div className="bg-blue-600 text-white p-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">Contacts</h3>
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          </div>

          {/* Chat Section */}
          <div className="p-8">
            {currentChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
