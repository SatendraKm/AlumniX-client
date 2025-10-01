import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const PendingContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch organizationId from cookies
  const organizationId = Cookies.get("id");
  console.log("Organization ID:", organizationId);

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      setLoading(true);
      try {
        console.log("Fetching unverified users...");
        const response = await axiosInstance.post(
          `/organizations/unverified-students`,
          { university_id: organizationId } // Sending organization ID in the request body
        );
        // Assuming the response structure contains an array of students in response.data.students
        const unverifiedUsers = response.data.students.filter(
          (user) => !user.is_verified
        );

        setPendingUsers(unverifiedUsers);
      } catch (error) {
        console.error("Error fetching unverified users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchUnverifiedUsers();
    } else {
      console.error("No organization ID found in cookies");
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = pendingUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowercasedQuery) ||
        user.lastName.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredUsers(filtered);
  }, [searchQuery, pendingUsers]);

  const handleApprove = async (id) => {
    try {
      const response = await axiosInstance.put(
        `/organizations/verify-user/${id}`
      );
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/organizations/reject-user/${id}`
      );
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      toast.error(response.data.message);
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  return (
    <div className="w-3/4 mx-auto mt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin-dashboard">
            <FaArrowLeft className="h-6 w-6 text-gray-700 hover:text-gray-900" />
          </Link>
          <span className="text-2xl font-semibold">
            {filteredUsers.length} Pending Users
          </span>
        </div>

        <div className="flex w-1/4 items-center rounded-md border border-gray-300 px-3 py-1 bg-white">
          <CiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm py-1 px-2 text-gray-700 border-none outline-none"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="w-full bg-white p-4 h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border-b border-gray-200 py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profileimageUrl || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/50`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{user.role}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No pending users found.</p>
        )}
      </div>
    </div>
  );
};

export default PendingContent;
