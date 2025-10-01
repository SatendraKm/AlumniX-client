import { useState, useEffect } from "react";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // Fetch the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("chat-app-current-user"));

  // Fetch chat messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_AXIOS_BASE_URL}/messages/getmsg`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              from: currentUser._id,
              to: currentChat._id,
            }),
          }
        );

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat, currentUser]);

  // Send a message to the server
  const handleSendMsg = async (msg) => {
    if (!msg.trim()) return; // Avoid sending empty messages

    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      msg,
    });

    try {
      await fetch(
        `${import.meta.env.VITE_APP_AXIOS_BASE_URL}/messages/addmsg`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
          }),
        }
      );

      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Listen for incoming messages via WebSocket
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        if (data.from === currentChat._id) {
          setArrivalMessage({ fromSelf: false, message: data.msg });
        }
      });
    }
  }, [socket, currentChat]);

  // Update messages when a new message arrives
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  return (
    <div className="grid grid-rows-[10%_80%_10%] gap-2 h-[600px] bg-gray-50 rounded-lg shadow">
      {/* Chat Header */}
      <div className="flex justify-between items-center px-6 py-2 bg-gray-200 rounded-t-lg shadow-inner">
        <div className="flex items-center gap-4">
          <img
            src={
              currentChat?.profileimageUrl || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/150`
            }
            alt="avatar"
            className="h-12 w-12 rounded-full shadow"
          />
          <h3 className="text-gray-700 font-semibold">
            {currentChat?.firstName} {currentChat?.lastName}
          </h3>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col gap-2 p-4 overflow-auto bg-white rounded-lg shadow-inner hide-scrollbar">
        {messages.map((message) => (
          <div
            key={uuidv4()}
            className={`flex ${
              message.fromSelf ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[60%] px-4 py-2 rounded-lg text-sm text-white shadow ${
                message.fromSelf ? "bg-blue-500" : "bg-indigo-400"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
