import briefcase from "../../../assets/icons/briefcase-01.svg";
import messageChat from "../../../assets/icons/message-chat-circle.svg";
import helpCircle from "../../../assets/icons/help-circle.svg";
import newPostLogo from "../../../assets/icons/newPostLogo.svg";
import Connections from "../../../assets/icons/user-logo.svg";
import videoChatIcon from "../../../assets/icons/video-chat-icon.svg";
import BulkEmailIcon from "../../../assets/icons/mail.svg";
import Board from "../../../assets/icons/board.svg";
import { Link } from "react-router-dom";
import ProfileSection from "./ProfileSection";
import { useState, useEffect } from "react";
import PostPopup from "./Postpage.jsx";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const id = Cookies.get("id");
  const [activeLink, setActiveLink] = useState("");
  const role = Cookies.get("role");

  const togglePopup = () => setIsPopupOpen((prev) => !prev);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUserData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="mx-4 mt-4 h-[calc(100vh-100px)] rounded-xl shadow-lg border border-gray-300 overflow-hidden flex flex-col max-h-full">
      <div className="relative mb-10 ">
        <Link to={`/dashboard/profile/${id}`}>
          <ProfileSection userData={userData} />
        </Link>
        {role !== "admin" && (
          <div className="absolute w-[214px] top-[180px] flex items-center shadow-lg justify-around p-1 border bg-white border-gray-300 rounded-2xl  mx-4 py-1">
            <Link
              to="/dashboard/followers"
              className={`text-center ${
                activeLink === "followers"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              } hover:text-black`}
              onClick={() => handleClick("followers")}
            >
              <div>
                <span className="block text-lg font-semibold text-gray-800">
                  {userData.followers.length}
                </span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
            </Link>
            <div className="border-l border-gray-300 h-8"></div>
            <Link
              to="/dashboard/following"
              className={`text-center ${
                activeLink === "following"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              } hover:text-black`}
              onClick={() => handleClick("following")}
            >
              <div>
                <span className="block text-lg font-semibold text-gray-800">
                  {userData.following.length}
                </span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-grow relative flex flex-col overflow-auto hide-scrollbar">
        <nav className="px-4 py-4">
          {role === "admin" && (
            <SidebarLink
              to="/dashboard/dashboard"
              icon={Board}
              label="Dashboard"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="dashboard"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/dashboard/BulkEmail"
              icon={BulkEmailIcon}
              label="Bulk Email"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="bulk-email"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/dashboard/BulkUpload"
              icon={BulkEmailIcon}
              label="Bulk Upload"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="bulk-email"
            />
          )}
          {role !== "admin" && (
            <SidebarLink
              className="py-1"
              to="/dashboard/connection"
              icon={Connections}
              label="Explore Connections"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="connection"
            />
          )}

          {role === "admin" && (
            <SidebarLink
              to="/dashboard/Conference-call"
              icon={videoChatIcon}
              label="Conference Call"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="video-call"
            />
          )}

          <div onClick={togglePopup} className="py-1">
            <SidebarLink
              icon={newPostLogo}
              label="Post"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="post"
            />
          </div>
          <SidebarLink
            to="/dashboard/chat"
            icon={messageChat}
            label="Chat"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="chat"
          />

          {role !== "admin" && (
            <SidebarLink
              to="/dashboard/video-call"
              icon={videoChatIcon}
              label="Video Call"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="video-call"
            />
          )}

          {role !== "admin" && (
            <SidebarLink
              to="/dashboard/applied-jobs"
              icon={briefcase}
              label="Job/Internship Applied"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="applied-jobs"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/dashboard/my-events"
              label="My Events"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="my-events"
            />
          )}
          <hr className="border-gray-300 py-1 mt-2" />
          {role !== "admin" && (
            <SidebarLink
              to="/dashboard/my-events"
              label="My Events"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="my-events"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/dashboard/rewards"
              label="Rewards"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="rewards"
            />
          )}
          <SidebarLink
            to="/dashboard/community"
            label="Community"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="community"
          />
          <SidebarLink
            to="/dashboard/mentorship"
            label="Mentorship"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="mentorship"
          />
          <hr className="border-gray-300 py-1 mt-2" />
          <SidebarLink
            to="/dashboard/help"
            icon={helpCircle}
            label="Help"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="help"
          />
        </nav>

        {/* Virtual Interview Button */}
        {role !== "admin" && (
          <Link
            to={`${import.meta.env.VITE_VIRTUAL_INTERVIEW_HOST_URL}`}
            className="mx-3 mt-2"
          >
            <button className="w-full py-1 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-center hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-blue-400/50 hover:shadow-purple-400/20">
              Virtual Interview
            </button>
          </Link>
        )}
        <Link to="/dashboard/Funds">
          <button className="mx-8 mt-5 w-[75%] py-1 px-3 rounded-2xl bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 text-white font-semibold text-center hover:from-teal-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg shadow-teal-400/50 hover:shadow-indigo-400/20">
            Funds Donations
          </button>
        </Link>

        {/* Footer */}
        <Footer />
      </div>

      {/* Post Popup */}
      {isPopupOpen && <PostPopup setPopupOpen={setIsPopupOpen} />}
    </div>
  );
};

const SidebarLink = ({ to, icon, label, activeLink, handleClick, linkKey }) => (
  <Link
    to={to}
    onClick={() => handleClick(linkKey)}
    className={`flex items-center p-1 rounded-lg cursor-pointer ${
      activeLink === linkKey
        ? "bg-blue-100 text-black font-semibold"
        : "text-gray-800 hover:bg-gray-100"
    }`}
  >
    {icon && <img src={icon} alt={`${label} icon`} className="w-5 h-5 mr-3" />}
    <span className="flex-grow text-sm font-medium">{label}</span>
  </Link>
);

const Footer = () => (
  <div className="text-center text-xs text-gray-500 mt-auto p-3">
    <p>Terms and Conditions</p>
    <p>©2024 Network_Next</p>
  </div>
);

export default Sidebar;
