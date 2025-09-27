import { useState, useEffect } from "react";
//import { CiSearch } from "react-icons/ci";
import UserCard from "./UserCard";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
const Followers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      setLoading(true);
      const currentUserId = Cookies.get("id");

      try {
        // Fetch current user's followers and following lists
        const currentUserResponse = await axiosInstance.get(
          `/users/${currentUserId}`
        );
        const { followers: followerIds, following: followingIds } =
          currentUserResponse.data.data;

        // Fetch full user details for followers
        const followerDetails = await Promise.all(
          followerIds.map(async (id) => {
            const userResponse = await axiosInstance.get(`/users/${id}`);
            return userResponse.data.data;
          })
        );

        setFollowers(
          followerDetails.map((follower) => ({
            ...follower,
            isFollowing: followingIds.includes(follower._id),
          }))
        );
        setFollowing(followingIds);
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowersAndFollowing();
  }, []);

  useEffect(() => {
    const filterFollowers = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = followers.filter(
        (follower) =>
          follower.firstName.toLowerCase().includes(lowercasedQuery) ||
          follower.lastName.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredFollowers(filtered);
    };

    filterFollowers();
  }, [searchQuery, followers]);

  const handleFollow = async (id) => {
    const currentUserId = Cookies.get("id");
    try {
      await axiosInstance.post(`/users/follow-user/${id}`, { currentUserId });
      setFollowers((prev) =>
        prev.map((follower) =>
          follower._id === id ? { ...follower, isFollowing: true } : follower
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (id) => {
    const currentUserId = Cookies.get("id");
    try {
      await axiosInstance.post(`/users/unfollow-user/${id}`, { currentUserId });
      setFollowers((prev) =>
        prev.map((follower) =>
          follower._id === id ? { ...follower, isFollowing: false } : follower
        )
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="w-3/4">
      {/* Header Section */}
      <div className="flex mx-8 mt-6 items-center justify-between px-4 py-2 bg-white">
        <div className="flex mx-28 gap-8 items-center">
          <Link to={"/dashboard"}>
            <FaArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-xl">{filteredFollowers.length} Followers</span>
        </div>

        <div className="flex w-1/3 items-center rounded-md  border-gray-700 mx-12 px-3 py-1 bg-white">
          {/* <CiSearch /> */}
          <input
            type="text"
            placeholder="Search Followers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-1 border border-gray-300 shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Followers List */}
      <div className="w-full bg-white p-4 h-[calc(100vh-260px)] overflow-y-auto hide-scrollbar">
        {loading ? (
          <p>Loading...</p>
        ) : filteredFollowers.length > 0 ? (
          filteredFollowers.map((follower) => (
            <UserCard
              key={follower._id}
              user={follower}
              isFollowing={follower.isFollowing}
              onFollow={() => handleFollow(follower._id)}
              onUnfollow={() => handleUnfollow(follower._id)}
            />
          ))
        ) : (
          <p>No followers found.</p>
        )}
      </div>
    </div>
  );
};

export default Followers;
