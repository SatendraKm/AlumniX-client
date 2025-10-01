import briefcase from "../../../assets/icons/briefcase-01.svg";
import messageChat from "../../../assets/icons/message-chat-circle.svg";
import helpCircle from "../../../assets/icons/help-circle.svg";
import newPostLogo from "../../../assets/icons/newPostLogo.svg";
import Home1 from "../../../assets/icons/home1.svg";
import Connections from "../../../assets/icons/user-logo.svg";
import videoChatIcon from "../../../assets/icons/video-chat-icon.svg";
import BulkEmailIcon from "../../../assets/icons/mail.svg";
import Circular from "../../../assets/icons/circular.svg";
import Load from "../../../assets/icons/Load.svg";
import Board from "../../../assets/icons/board.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostPopup from "./Postpage.jsx";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import logouticon from "../../../assets/icons/settings/logout.svg";
import { Upload } from "lucide-react";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organizationName, setOrganizationName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const id = Cookies.get("id");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  const togglePopup = () => setIsPopupOpen((prev) => !prev);

  // Fetch organization name using the id from cookies
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/organizations/${id}`);
        setUserData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    // useEffect(() => {
    //   const organizationData = async () => {
    //     try {
    //       const response = await axiosInstance.get(/users/${id});
    //       setUserData(response?.data?.data);
    //     } catch (error) {
    //       console.error("Error fetching user data:", error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    if (id) fetchUserData();
  }, [id]);

  useEffect(() => {
    const fetchOrganizationName = async () => {
      if (id) {
        try {
          const response = await axiosInstance.get(`/organizations/${id}`);
          console.log(response.data.organization.name);
          setOrganizationName(response.data.organization.name);
        } catch (error) {
          console.error("Error fetching organization name:", error);
          toast.error("Error fetching organization name");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrganizationName();
  }, [id]);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="mx-4 mt-4 h-[calc(100vh-50px)] rounded-l shadow-lg border border-gray-300 overflow-hidden flex flex-col max-h-full">
      {/* Admin Control Section */}
      {role === "admin" && organizationName && (
        <div className="  text-xl  flex justify-center">
          <span className="bg-white px-3 py-1 items-center justify-center text-xl font-semibold shadow-md">
            {organizationName}
          </span>
        </div>
      )}
      {role === "admin" && (
        <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-extrabold text-l uppercase tracking-wide shadow-lg rounded-t-xl flex items-center justify-center">
          <span className="mr-2">🛠</span> Admin Control Panel
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-grow relative flex flex-col overflow-auto hide-scrollbar">
        <nav className="px-4 py-4 space-y-4 text-lg">
          {role === "admin" && (
            <SidebarLink
              className="py-1 text-xl"
              to="/admin-dashboard/"
              icon={Home1}
              label="Home"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="Home"
            />
          )}

          {role === "admin" && (
            <SidebarLink
              className="py-1 text-xl"
              to="/admin-dashboard/Board"
              icon={Board}
              label="Dashboard"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="dashboard"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/admin-dashboard/pending-requests"
              icon={BulkEmailIcon}
              label="Pending Requests"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="pending-requests"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/admin-dashboard/BulkEmail"
              icon={Circular}
              label="Send Circular"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="bulk-Email"
            />
          )}
          {role === "admin" && (
            <SidebarLink
              to="/admin-dashboard/BulkUpload"
              icon={Load}
              label="Bulk Upload"
              activeLink={activeLink}
              handleClick={handleClick}
              linkKey="BulkUpload"
            />
          )}

          {role === "admin" && (
            <SidebarLink
              to="/admin-dashboard/Conference-call"
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
            to="/admin-dashboard/community"
            label="Community"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="community"
          />
          <SidebarLink
            to="/admin-dashboard/mentorship"
            label="Mentorship"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="mentorship"
          />
          <hr className="border-gray-300 py-1 mt-2" />
          <SidebarLink
            to="/admin-dashboard/help"
            icon={helpCircle}
            label="Help"
            activeLink={activeLink}
            handleClick={handleClick}
            linkKey="help"
          />
        </nav>
        <button
          onClick={() => {
            Cookies.remove("token", { path: "/" });
            Cookies.remove("id", { path: "/" });
            Cookies.remove("role", { path: "/" });
            toast.success("Logged out successfully!");
            navigate("/login"); // Redirect after logout
          }}
          className="flex  items-center px-2 py-1 font-semibold text-md text-black hover:text-gray-600"
        >
          <img src={logouticon} alt="logout-button" className=" mx-2" />
          Logout
        </button>

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
        <Link to="/admin-dashboard/Funds">
          <button className="mx-8 mt-5 w-[75%] py-1 px-3 rounded-2xl bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 text-white font-semibold text-center hover:from-teal-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg shadow-teal-400/50 hover:shadow-indigo-400/20">
            Funds Donations
          </button>
        </Link>

        {/* Footer */}
        <Footer />
      </div>
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
    {icon && <img src={icon} alt={"label icon"} className="w-5 h-5 mr-3" />}
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
