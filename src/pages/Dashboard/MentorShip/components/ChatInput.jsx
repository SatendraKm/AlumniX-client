import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim()) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="relative bg-gray-300 rounded-lg p-4 shadow-md">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-10">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Input and Send Button */}
      <form
        onSubmit={sendChat}
        className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-md"
      >
        <BsEmojiSmileFill
          onClick={toggleEmojiPicker}
          className="text-2xl text-yellow-400 cursor-pointer"
        />
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-transparent border-none text-gray-800 placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600"
        >
          <IoMdSend className="text-xl" />
        </button>
      </form>
    </div>
  );
}
