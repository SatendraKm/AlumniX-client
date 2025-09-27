import { useState, useEffect } from "react";
import Robot from "../../../../assets/chat/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  // Fetch current user's name from localStorage
  useEffect(() => {
    const fetchUserName = async () => {
      const user = JSON.parse(localStorage.getItem("chat-app-current-user"));
      const currentUserName = `${user?.firstName} ${user?.lastName}`;
      setUserName(currentUserName || "User");
    };
    fetchUserName();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-gray-700 bg-gray-50 h-full rounded-lg shadow p-6">
      {/* Robot Image */}
      <img
        src={Robot}
        alt="Robot"
        className="h-64 w-auto mb-6 animate-bounce"
      />

      {/* Welcome Message */}
      <h1 className="text-2xl font-semibold text-center">
        Welcome, <span className="text-blue-500">{userName}</span>!
      </h1>
      <h3 className="text-lg mt-4 text-center">
        Please select a chat to start messaging.
      </h3>
    </div>
  );
}
