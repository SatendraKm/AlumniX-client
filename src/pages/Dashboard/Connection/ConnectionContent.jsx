import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import UserCard from "./UserCard";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
const ConnectionContent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["All", "Alumni", "Faculty", "Student"];

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      setLoading(true);
      const currentUserId = Cookies.get("id");

      try {
        // Fetch all users
        const usersResponse = await axiosInstance.get("/users/get-all-users");
        // Exclude the current user
        const allUsers = usersResponse.data.filter(
          (user) => user._id !== currentUserId
        );
        setUsers(allUsers);

        // Fetch the current user's following list
        const currentUserResponse = await axiosInstance.get(
          `/users/${currentUserId}`
        );
        setFollowing(currentUserResponse.data.data.following);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndFollowing();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users
        .map((user) => ({
          ...user,
          isFollowing: following.includes(user._id),
        }))
        .filter((user) => {
          const matchesTab =
            activeTab === "All" || user.role === activeTab.toLowerCase();
          const matchesSearch =
            user.firstName.toLowerCase().includes(lowercasedQuery) ||
            user.lastName.toLowerCase().includes(lowercasedQuery);
          return matchesTab && matchesSearch;
        });

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [activeTab, searchQuery, users, following]);

  const handleFollow = async (id) => {
    const currentUserId = Cookies.get("id");
    try {
      await axiosInstance.post(`/users/follow-user/${id}`, { currentUserId });
      setFollowing((prev) => [...prev, id]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (id) => {
    const currentUserId = Cookies.get("id");
    try {
      await axiosInstance.post(`/users/unfollow-user/${id}`, { currentUserId });
      setFollowing((prev) => prev.filter((userId) => userId !== id));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  return (
    <div className="w-3/4">
      {/* Tab Navigation */}
      <div className="flex border border-gray-300 justify-around bg-white rounded-2xl shadow-lg px-4 py-1 m-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`text-sm px-4 py-2 rounded-full font-semibold ${
              activeTab === tab ? "text-black font-bold" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex mx-8 mt-6 items-center justify-between px-4 py-2 bg-white">
        <div className="flex mx-28 gap-8 items-center">
          <Link to={"/dashboard"}>
            <FaArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-2xl font-semibold">
            {filteredUsers.length} Users
          </span>
        </div>

        <div className="flex w-1/4 items-center rounded-md border border-gray-700 mx-12 px-3 py-1 bg-white">
          <CiSearch />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm py-1 px-2 text-gray-700  border-none "
          />
        </div>
      </div>

      {/* Connections List */}
      <div className="w-full bg-white p-4 h-[calc(100vh-260px)] overflow-y-auto hide-scrollbar">
        {loading ? (
          <p>Loading...</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              isFollowing={user.isFollowing}
              onFollow={() => handleFollow(user._id)}
              onUnfollow={() => handleUnfollow(user._id)}
            />
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionContent;
