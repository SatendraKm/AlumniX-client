import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ChatContainer from "./ChatComponent/ChatContainer";
import Contacts from "./ChatComponent/Contacts";
import Welcome from "./ChatComponent/Welcome";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie"; // Import Cookies library

export default function Chat() {
  const socket = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUserId = Cookies.get("id");
        const response = await axiosInstance.get(`/users/${currentUserId}`);
        const userData = response.data.data;
        localStorage.setItem("chat-app-current-user", JSON.stringify(userData));
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && !socket.current) {
      socket.current = io(`${import.meta.env.VITE_API_HOST_URL}`, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      socket.current.once("connect", () => {
        socket.current.emit("add-user", currentUser._id);
      });

      socket.current.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err.message);
      });

      socket.current.on("disconnect", (reason) => {
        console.warn("WebSocket disconnected:", reason);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const response = await axiosInstance.get("/users/get-all-users");
          setContacts(response.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      }
    };
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 relative">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 backdrop-blur-lg bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 opacity-60"></div>
  
      {/* Chat Container */}
      <div className="relative z-10 h-[80vh] w-full max-w-7xl bg-white shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-[30%_70%] overflow-hidden">
        {/* Contacts Section */}
        <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col">
          <h3 className="text-2xl font-bold mb-6 text-center">Contacts</h3>
          <Contacts
            contacts={contacts}
            changeChat={handleChatChange}
            currentUser={currentUser}
          />
        </div>
  
        {/* Chat Section */}
        <div className="bg-gray-50 p-8 flex flex-col">
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
