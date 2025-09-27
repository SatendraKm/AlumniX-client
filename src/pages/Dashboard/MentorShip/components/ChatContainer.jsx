import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "../../../../utils/axiosinstance";
import {
  sendGroupMessageRoute,
  recieveGroupMessageRoute,
} from "../utils/APIRoutes";
import ChatInput from "./ChatInput";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem("chat-app-current-user"));

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        const response = await axiosInstance.post(recieveGroupMessageRoute, {
          groupId: currentChat._id,
        });
        setMessages(response.data.messages);
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("chat-app-current-user"))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: user._id,
      msg,
    });

    await axiosInstance.post(sendGroupMessageRoute, {
      sender: user._id,
      groupId: currentChat._id,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  return (
    <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-200 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={
              currentChat.groupProfileImage || "https://via.placeholder.com/40"
            }
            alt="group-avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {currentChat.name}
            </h3>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar p-4">
        {messages.map((message) => (
          <div key={uuidv4()} className="flex justify-start">
            <div
              className={`${
                message.fromSelf ? "bg-blue-500" : "bg-gray-300"
              } p-3 rounded-lg max-w-[70%] shadow-md`}
            >
              <p className="text-white text-sm">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      {currentChat.createdBy === user._id && (
        <ChatInput handleSendMsg={handleSendMsg} />
      )}
    </div>
  );
}
