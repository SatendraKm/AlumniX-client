import { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Toggle emoji picker visibility
  const handleEmojiPickerToggle = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Add selected emoji to the message input
  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  // Send the message
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg.trim());
      setMsg("");
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-200 p-4 rounded-b-lg shadow-inner">
      {/* Emoji Picker */}
      <div className="relative">
        <BsEmojiSmileFill
          className="text-gray-500 text-xl cursor-pointer hover:text-gray-700"
          onClick={handleEmojiPickerToggle}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0">
            <Picker
              onEmojiClick={(_, emojiObject) => handleEmojiClick(emojiObject)}
              pickerStyle={{
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        className="flex items-center flex-1 gap-4 bg-white rounded-full shadow px-4 py-2"
        onSubmit={sendChat}
      >
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 text-sm focus:outline-none"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition"
        >
          <IoMdSend className="text-lg" />
        </button>
      </form>
    </div>
  );
}
