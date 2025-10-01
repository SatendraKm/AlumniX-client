import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import arrowBlockUp from "../../../assets/icons/arrow-block-up.svg";
import arrowBlockdown from "../../../assets/icons/arrow-block-down.svg";

const StoryCard = ({ story, currentUserId, onLike, onDislike }) => {
  const {
    _id,
    title = "Untitled Story",
    storyImage, // Can be video URL or image URL
    createdBy,
    createdAt,
    likes = [],
    dislikes = [],
  } = story;

  const [creatorName, setCreatorName] = useState("Loading...");
  const isLiked = likes.includes(currentUserId);
  const isDisliked = dislikes.includes(currentUserId);

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      if (!createdBy) {
        setCreatorName("Unknown Creator");
        return;
      }

      try {
        const response = await axiosInstance.get(`/users/${createdBy._id}`);
        if (response.data?.success) {
          const { firstName, lastName } = response.data.data;
          setCreatorName(`${firstName} ${lastName}`);
        } else {
          setCreatorName("Unknown Creator");
        }
      } catch (error) {
        console.error("Error fetching creator details:", error);
        setCreatorName("Unknown Creator");
      }
    };

    fetchCreatorDetails();
  }, [createdBy]);

  // Check if storyImage is a video URL
  const isVideo = storyImage?.endsWith(".mp4") || storyImage?.endsWith(".webm");

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 flex flex-col items-center text-center w-full max-w-3xl">
      {/* Story Image or Video as Div */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
        {isVideo ? (
          <div className="w-full h-full bg-black">
            <video
              src={storyImage}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <img
            src={storyImage || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/150`}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        )}
      </div>

      {/* Story Details */}
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">By {creatorName}</p>
      <p className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleDateString()}
      </p>

      {/* Like and Dislike Buttons */}
      <div className="flex justify-between mt-6 p-2 text-sm w-full">
        <button
          onClick={() => onLike(_id)}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg ${
            isLiked
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          } transition`}
        >
          <img src={arrowBlockUp} alt="Like" className="w-5 h-5" />
          <span>{likes.length}</span>
        </button>
        <button
          onClick={() => onDislike(_id)}
          className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg ${
            isDisliked
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          } transition`}
        >
          <img src={arrowBlockdown} alt="Dislike" className="w-5 h-5" />
          <span>{dislikes.length}</span>
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
