import { useState, useEffect } from "react";
import PostCard from "../Common/PostCard";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";

const HomeContent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchCurrentUserId = localStorage.getItem("chat-app-current-user");
  const currentUserId = fetchCurrentUserId?._id;

  const tabs = [
    "All",
    "Organization Post",
    "Alumni Post",
    "Student Post",
    "Faculty Post",
  ];

  // Fetch posts and user data
  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const response = await axiosInstance.get("/post");
        const postsData = response.data;
        setPosts(postsData);

        const userIds = [...new Set(postsData.map((post) => post.createdBy))];
        const userResponses = await Promise.all(
          userIds.map((id) =>
            axiosInstance
              .get(`/users/${id}`)
              .then((res) => ({ id, data: res.data.data }))
              .catch((err) => {
                console.error(`Error fetching user ${id}:`, err);
                return null;
              })
          )
        );

        const usersData = userResponses
          .filter((response) => response !== null)
          .reduce((acc, { id, data }) => ({ ...acc, [id]: data }), {});

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching posts or users:", error);
      }
    };

    fetchPostsAndUsers();
  }, []);

  // Handle like post
  const handleLikePost = async (postId) => {
    if (loading) return; // Prevent multiple clicks if already loading
    setLoading(true);
    try {
      await axiosInstance.post(`/post/${postId}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(currentUserId)
                  ? post.likes.filter((id) => id !== currentUserId)
                  : [...post.likes, currentUserId],
                dislikes: post.dislikes.filter((id) => id !== currentUserId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle dislike post
  const handleDislikePost = async (postId) => {
    if (loading) return; // Prevent multiple clicks if already loading
    setLoading(true);
    try {
      await axiosInstance.post(`/post/${postId}/dislike`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                dislikes: post.dislikes.includes(currentUserId)
                  ? post.dislikes.filter((id) => id !== currentUserId)
                  : [...post.dislikes, currentUserId],
                likes: post.likes.filter((id) => id !== currentUserId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error disliking the post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle follow user
  const handleFollowUser = async (userId) => {
    if (loading) return; // Prevent multiple clicks if already loading
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/users/follow-user/${userId}`, {
        currentUserId,
      });
  
      if (response.data.success) {
        toast.success("Successfully followed the user!");
      } else {
        toast.warn(response.data.message || "Already following this user.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error following the user. Please try again."
      );
      console.error("Error following user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on active tab and sort by createdAt (descending)
  const filteredPosts = posts
    .filter((post) => {
      const user = users[post.createdBy];
      if (!user) return false;

      if (activeTab === "All") return true;
      if (activeTab === "Organization Post")
        return user.role === "organization";
      if (activeTab === "Alumni Post") return user.role === "alumni";
      if (activeTab === "Student Post") return user.role === "student";
      if (activeTab === "Facility Post") return user.role === "faculty";

      return false;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort posts by createdAt, descending

  return (
    <div className="w-2/3">
      {/* Tabs Section */}
      <div className="flex border border-gray-300 justify-around bg-white rounded-2xl shadow-lg px-4 py-1 m-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 rounded-full font-semibold ${
              activeTab === tab ? "text-black font-bold" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts Section */}
      <div className="w-11/12 bg-[#ffffff] mx-auto h-[calc(100vh-150px)] overflow-y-auto hide-scrollbar">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const user = users[post.createdBy];
            return (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                currentUserId={currentUserId}
                onLikePost={handleLikePost}
                onDislikePost={handleDislikePost}
                onFollowUser={handleFollowUser}
                loading={loading}
              />
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default HomeContent;
