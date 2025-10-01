const UserCard = ({ user, isFollowing, onFollow, onUnfollow }) => {
  return (
    <div className="flex gap-4 w-3/4 items-center justify-between mb-4 mx-auto p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
      {/* Profile Image and Details */}
      <div className="flex items-center space-x-4">
        <img
          src={user.profileimageUrl || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/150`}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-16 h-16 rounded-full object-cover shadow-sm"
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {`${user.firstName} ${user.lastName}`}
          </p>
          <p className="text-sm text-gray-600">{user.tagLine || "No tagline"}</p>
          <p className="text-sm text-gray-500 italic">{user.role || "Role not specified"}</p>
        </div>
      </div>

      {/* Follow/Unfollow Button */}
      <button
        onClick={isFollowing ? onUnfollow : onFollow}
        className={`text-md font-medium px-6 py-2 rounded-lg shadow-sm transition ${
          isFollowing
            ? "bg-gray-500 text-white hover:bg-black-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;
