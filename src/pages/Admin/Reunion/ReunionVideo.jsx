const ReunionVideo = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      <div className="relative group">
        {/* Thumbnail */}
        <img
          src="/path/to/video-thumbnail-placeholder.png" // Replace with real thumbnail or API
          alt="Reunion Video"
          className="w-full h-48 object-cover"
        />
        {/* Play Button */}
        <button className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
          ▶
        </button>
      </div>
    </div>
  );
};

export default ReunionVideo;
