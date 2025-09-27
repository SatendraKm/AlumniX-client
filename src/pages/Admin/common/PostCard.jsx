import { useState } from "react";
import arrowBlockUp from "../../../assets/icons/arrow-block-up.svg";
import arrowBlockDown from "../../../assets/icons/arrow-block-down.svg";
import deleteIcon from "../../../assets/icons/delete.svg"; // Import the delete icon
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const PostCard = ({
  post,
  user,
  currentUserId,
  onLikePost,
  onDislikePost,
  onFollowUser,
  isLoading,
}) => {
  const localUserId = Cookies.get("id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openImageModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentImage(null);
    setIsModalOpen(false);
  };

  const isLiked = post.likes.includes(currentUserId);
  const isDisliked = post.dislikes.includes(currentUserId);

  const parseTextWithHashtags = (text) => {
    return text.split(/(#[a-zA-Z0-9_]+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span key={index} className="text-blue-600 font-semibold">
            {part}
          </span>
        );
      }
      return part ? part : null; // Avoid rendering empty parts
    });
  };

  const truncatedText =
    post.description.length > 150
      ? post.description.slice(0, 150) + "..."
      : post.description;

  // Handle delete post
  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/post/${post._id}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("Post deleted successfully.");
      } else {
        toast.error("Failed to delete the post");
      }
    } catch (error) {
      console.error("Error deleting the post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white mb-6 p-4 w-11/12 mx-auto rounded-lg shadow border border-gray-200 relative">
      {/* Edit and Delete Icons */}
      {currentUserId === user?._id && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={handleDeletePost}
            className="hover:opacity-80"
            disabled={isDeleting}
          >
            <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-start justify-between pt-2">
        <div className="flex items-center">
          <img
            src={user?.profileimageUrl || "https://via.placeholder.com/40"}
            alt={`${user?.firstName || "User"}'s Avatar`}
            className="rounded-full w-10 h-10"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <h4 className="font-semibold text-gray-800">
                {user ? `${user.firstName} ${user.lastName}` : "Unknown User"}
              </h4>
              {currentUserId !== localUserId && (
                <button
                  onClick={() => onFollowUser(user?._id)}
                  className="ml-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Follow
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {user?.tagLine || "Tagline not present"}
            </p>
          </div>
        </div>
        <div className="text-gray-500 ml-2 whitespace-nowrap mt-4">
          <p className="text-sm">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Content Section */}
      <p className="text-sm mx-2 text-gray-800 mt-2">
        {isExpanded
          ? parseTextWithHashtags(post.description)
          : parseTextWithHashtags(truncatedText)}
        {post.description.length > 150 && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 font-bold cursor-pointer ml-1"
            title={isExpanded ? "Show less" : "Show more"}
          >
            ({isExpanded ? "Less" : "More"})
          </span>
        )}
      </p>

      {/* Uploaded Images Section */}
      {post.postPhoto && (
        <img
          src={post.postPhoto}
          alt="Post"
          onClick={() => openImageModal(post.postPhoto)}
          className="mt-4 rounded-lg w-full object-scale-down cursor-pointer"
        />
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-4 text-white text-2xl"
              aria-label="Close image"
            >
              &times;
            </button>

            <img
              src={currentImage}
              alt="Full Size"
              className="max-w-full max-h-screen rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Interaction Section */}
      <div className="flex justify-between mt-4 p-2 text-sm border-t border-gray-200 pt-3">
        {/* Left Section: Interactions */}
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <button
            onClick={() => onLikePost(post._id)}
            disabled={isLiked || isLoading}
            className={`flex items-center gap-1 font-semibold ${
              isLiked ? "text-blue-500" : "text-gray-600"
            } hover:text-blue-500 transition`}
          >
            <img src={arrowBlockUp} alt="Upvote" className="w-6 h-6" />
            <span className="font-semibold text-xl">{post.likes.length}</span>
          </button>

          {/* Dislike Button */}
          <button
            onClick={() => onDislikePost(post._id)}
            disabled={isLiked || isLoading}
            className={`flex items-center gap-1 font-semibold ${
              isDisliked ? "text-blue-500" : "text-gray-600"
            } hover:text-blue-500 transition`}
          >
            <img src={arrowBlockDown} alt="Downvote" className="w-6 h-6" />
            <span className="font-semibold text-xl">
              {post.dislikes.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
