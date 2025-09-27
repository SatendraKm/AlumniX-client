import React from "react";

const VideoStory = ({ videoSrc, thumbnail }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-48">
        {videoSrc ? (
          <video
            src={videoSrc}
            className="w-full h-full object-cover"
            controls
            poster={thumbnail || "https://via.placeholder.com/150"} // Use the thumbnail or a default one
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">No video available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStory;
