import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const FindGroup = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get("/groups/get-all-groups");
        if (response.data.success) {
          const groupsWithCreators = await Promise.all(
            response.data.groups.map(async (group) => {
              const userResponse = await axiosInstance.get(
                `/users/${group.createdBy}`
              );
              const userData = userResponse.data;
              return {
                ...group,
                creatorName: userData.success
                  ? `${userData.data.firstName} ${userData.data.lastName}`
                  : "Unknown Creator",
              };
            })
          );
          setGroups(groupsWithCreators);
          setFilteredGroups(groupsWithCreators);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleAddMember = async (groupId) => {
    try {
      const memberId = Cookies.get("id");
      const response = await axiosInstance.post(
        `/groups/add-member/${groupId}`,
        { memberId }
      );

      if (response.data.success) {
        toast.success("Member added successfully!");
      } else {
        toast.error("Failed to add member.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("An error occurred while adding the member.");
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups(
        groups.filter((group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, groups]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 mt-10">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search for a group..."
          className="w-full border rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Group List */}
      <ul className="space-y-4 h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400-100 scrollbar-track-gray-100">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <li
              key={group._id}
              className="flex justify-between items-center p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    group.groupProfileImage || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/48`
                  }
                  alt={`${group.name} group`}
                  className="rounded-full w-12 h-12 object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">{group.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {`${group.members.length} members`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">
                  {new Date(group.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">
                  Created By: {group.creatorName}
                </p>
                <button
                  onClick={() => handleAddMember(group._id)}
                  className="text-white bg-blue-600 rounded-lg px-3 py-1.5 text-sm mt-2 hover:bg-blue-500 transition-all"
                >
                  Join Community
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="text-center text-gray-500">No Community found.</div>
        )}
      </ul>
    </div>
  );
};

export default FindGroup;
