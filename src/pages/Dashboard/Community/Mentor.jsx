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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative">
  {/* Background Blur */}
  <div className="absolute inset-0 backdrop-blur-lg bg-gradient-to-br from-white to-gray-200 opacity-80"></div>

  {/* Chat Container */}
  <div className="relative z-10 h-[80vh] w-full max-w-7xl bg-white shadow-2xl rounded-3xl grid grid-cols-[30%_70%] overflow-hidden">
    {/* Contacts Section */}
    <div className="bg-gradient-to-b from-gray-700 to-gray-900 text-white p-6 flex flex-col">
      <h3 className="text-2xl font-bold mb-6 text-center">Contacts</h3>
      <Contacts contacts={contacts} changeChat={handleChatChange} />
    </div>

    {/* Chat Section */}
    <div className="bg-white p-8 flex flex-col">
      {currentChat === undefined ? (
        <Welcome />
      ) : (
        <ChatContainer currentChat={currentChat} socket={socket} />
      )}
    </div>
  </div>
</div>

  );
}
