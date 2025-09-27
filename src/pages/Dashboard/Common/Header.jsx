import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import NsquareLogo from "../../../assets/icons/logo nsqaure 1.svg";
import notification from "../../../assets/icons/notification-icon.svg";
import search from "../../../assets/icons/search-icon.svg";
import setting from "../../../assets/icons/setting-icon.svg";
import alumniresourceicon from "../../../assets/icons/alumniresourceicon.svg";
import volunteer from "../../../assets/icons/handicon.svg";
import setting1 from "../../../assets/icons/settings/setting1.svg";
import setting2 from "../../../assets/icons/settings/setting2.svg";
import setting3 from "../../../assets/icons/settings/setting3.svg";
import setting4 from "../../../assets/icons/settings/setting4.svg";
import setting5 from "../../../assets/icons/settings/setting5.svg";
import setting6 from "../../../assets/icons/settings/setting6.svg";
import setting7 from "../../../assets/icons/settings/setting7.svg";
import setting8 from "../../../assets/icons/settings/setting8.svg";
import setting9 from "../../../assets/icons/settings/setting9.svg";
import setting10 from "../../../assets/icons/settings/setting10.svg";
import setting11 from "../../../assets/icons/settings/setting11.svg";
import setting12 from "../../../assets/icons/settings/setting12.svg";

import logouticon from "../../../assets/icons/settings/logout.svg";

// Modal Component for Search
const SearchModal = () => (
  <div className="absolute top-full right-52 mt-2 w-1/5 bg-white shadow-lg rounded-lg z-2 p-4">
    <input
      type="text"
      placeholder="search"
      className="w-full px-4 py-2 border rounded-lg focus:outline-none"
    />
  </div>
);

// Modal Component for Notifications
const NotificationsModal = ({ notifications }) => (
  <div className="absolute top-full right-32 mt-2 w-auto bg-white shadow-lg rounded-lg z-2 p-4">
    <div className="text-lg font-Bold text-black m-2">Notifications</div>
    <ul>
      {notifications.map((notification, index) => (
        <li
          key={index}
          className="flex gap-4 justify-between m-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <span className="text-md text-black">{notification.text}</span>
          <span className="text-sm text-gray-500">{notification.time}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Modal Component for Settings
const SettingsModal = ({ settingsOptions }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute top-full right-12 mt-2 w-72 bg-white shadow-lg rounded-lg z-20">
      <ul className="py-2">
        {settingsOptions.map((option) => (
          <li key={option.name}>
            <Link
              to={option.path}
              className="flex items-center px-4 py-1 my-2 font-semibold text-md text-black hover:text-gray-600"
            >
              <img src={option.icon} alt={option.name} className="px-2 mx-2" />
              {option.name}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={() => {
              Cookies.remove("token", { path: "/" });
              Cookies.remove("id", { path: "/" });
              Cookies.remove("role", { path: "/" });
              toast.success("Logged out successfully!");
              navigate("/login"); // Redirect after logout
            }}
            className="flex w-[90%] items-center m-2 px-4 py-2 font-semibold text-md text-black hover:text-gray-600"
          >
            <img src={logouticon} alt="logout-button" className="p-2 mx-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const settingsRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const role = Cookies.get("role");
  const id = Cookies.get("id");

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Job", path: "/dashboard/job" },
    { name: "Event", path: "/dashboard/event" },
    { name: "Project", path: "/dashboard/project" },
    { name: "Story", path: "/dashboard/inspiring-story" },
  ];

  const settingsOptions = [
    {
      name: "Profile",
      path: `/dashboard/common/Userprofile/${id}`,
      icon: setting1,
    },
    { name: "Account Preference", path: "/account-preference", icon: setting2 },
    { name: "Social Media Account", path: "/social-media", icon: setting3 },
    { name: "Post Saved", path: "/post-saved", icon: setting4 },
    { name: "Download", path: "/download", icon: setting5 },
    { name: "My Jobs", path: "/my-jobs", icon: setting6 },
    { name: "Data Privacy", path: "/data-privacy", icon: setting7 },
    { name: "Privacy & Security", path: "/privacy-security", icon: setting8 },
    { name: "Device Permission", path: "/device-permission", icon: setting9 },
    {
      name: "Data Usage & Media Quality",
      path: "/data-usage-media-quality",
      icon: setting10,
    },
    { name: "Language", path: "/language", icon: setting11 },
    { name: "About", path: "/about", icon: setting12 },
    { name: "Feedback & Survey", path: "/dashboard/feed", icon: setting12 },
  ];
  const notifications = [
    { text: "You have a new follower!", time: "2 mins ago" },
    { text: "Your post was liked by 10 people", time: "1 hour ago" },
    { text: "Event reminder: Trading Webinar", time: "Yesterday" },
  ];
  // Modal Component for Social Media Account
  const SocialMediaModal = ({ onClose }) => {
    const [socialMedia, setSocialMedia] = useState("");

    const handleUpdate = () => {
      // Perform update action here (e.g., API call)
      toast.success("Social Media account updated successfully!");
      onClose();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            Update profile through social media link
          </h2>
          {/* <input
            type="text"
            placeholder="Enter your social media link"
            value={socialMedia}
            onChange={(e) => setSocialMedia(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none"
          /> */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  };

  const closeAllMenus = () => {
    setShowSearchMenu(false);
    setShowNotificationsMenu(false);
    setShowSettingsMenu(false);
  };
  const SettingsModal = ({ settingsOptions }) => {
    const navigate = useNavigate();
    const [showSocialMediaModal, setShowSocialMediaModal] = useState(false);

    return (
      <>
        <div className="absolute top-full right-12 mt-2 w-72 bg-white shadow-lg rounded-lg z-20">
          <ul className="py-2">
            {settingsOptions.map((option) => (
              <li key={option.name}>
                {option.name === "Social Media Account" ? (
                  <button
                    onClick={() => setShowSocialMediaModal(true)}
                    className="flex items-center w-full px-4 py-1 my-2 font-semibold text-md text-black hover:text-gray-600"
                  >
                    <img
                      src={option.icon}
                      alt={option.name}
                      className="px-2 mx-2"
                    />
                    {option.name}
                  </button>
                ) : (
                  <Link
                    to={option.path}
                    className="flex items-center px-4 py-1 my-2 font-semibold text-md text-black hover:text-gray-600"
                  >
                    <img
                      src={option.icon}
                      alt={option.name}
                      className="px-2 mx-2"
                    />
                    {option.name}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  Cookies.remove("token", { path: "/" });
                  Cookies.remove("id", { path: "/" });
                  Cookies.remove("role", { path: "/" });
                  toast.success("Logged out successfully!");
                  navigate("/login"); // Redirect after logout
                }}
                className="flex w-[90%] items-center m-2 px-4 py-2 font-semibold text-md text-black hover:text-gray-600"
              >
                <img
                  src={logouticon}
                  alt="logout-button"
                  className="p-2 mx-2"
                />
                Logout
              </button>
            </li>
          </ul>
        </div>

        {showSocialMediaModal && (
          <SocialMediaModal onClose={() => setShowSocialMediaModal(false)} />
        )}
      </>
    );
  };

  const handleClickOutside = useCallback((event) => {
    if (
      settingsRef.current &&
      !settingsRef.current.contains(event.target) &&
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      closeAllMenus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="relative">
      <header className="w-full h-14 flex items-center justify-between px-4 py-4 bg-white border-b shadow-md">
        {/* Logo Section */}
        <div className="flex items-center justify-start w-1/4">
          <img src={NsquareLogo} alt="Nsquare Logo" className="w-10 h-10" />
        </div>

        {/* Navigation Section */}
        <div className="flex-grow flex justify-center w-1/2">
          <nav className="space-x-20 lg:space-x-20 md:space-x-30 sm:space-x-30">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xl font-semibold ${
                  location.pathname === link.path
                    ? "text-black"
                    : "text-gray-600"
                } hover:text-black`}
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Icon Section */}
        <div className="flex items-center justify-end w-1/4 space-x-2">
          {/* Volunteer Icon */}
          {role === "student" && (
            <button
              aria-label="Volunteer"
              title="Volunteer"
              onClick={() => {
                navigate("/dashboard/volunteer");
              }}
            >
              <img
                src={volunteer}
                alt="volunteer"
                className="h-10 w-10 hover:opacity-80"
              />
            </button>
          )}
          {/* Alumni Resources Icon */}
          <button
            aria-label="Alumni Resources"
            title="Alumni Resources"
            onClick={() => {
              navigate("/dashboard/alumni-resources");
            }}
          >
            <img
              src={alumniresourceicon}
              alt="Alumni Resources"
              className="h-10 w-10 hover:opacity-80"
            />
          </button>

          {/* Search Icon with Modal */}
          <button
            ref={searchRef}
            aria-label="Search"
            title="Search"
            onClick={() => {
              closeAllMenus();
              setShowSearchMenu(true);
            }}
          >
            <img
              src={search}
              alt="Search Icon"
              className="h-10 w-10 hover:opacity-80"
            />
          </button>
          {showSearchMenu && <SearchModal />}

          {/* Notifications Icon with Modal */}
          <button
            ref={notificationsRef}
            aria-label="Notifications"
            title="Notifications"
            onClick={() => {
              closeAllMenus();
              setShowNotificationsMenu(true);
            }}
          >
            <img
              src={notification}
              alt="Notifications Icon"
              className="h-10 w-10 hover:opacity-80"
            />
          </button>

          {/* Settings Icon with Modal */}
          <button
            ref={settingsRef}
            aria-label="Settings"
            title="Settings"
            onClick={() => {
              closeAllMenus();
              setShowSettingsMenu(true);
            }}
          >
            <img
              src={setting}
              alt="Settings Icon"
              className="h-10 w-10 hover:opacity-80"
            />
          </button>
        </div>
      </header>

      {/* Background Overlay */}
      {(showSearchMenu || showNotificationsMenu || showSettingsMenu) && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={closeAllMenus}
        />
      )}

      {/* Modals below the header */}
      <div className="relative z-20">
        {showSearchMenu && (
          <div className="relative" ref={searchRef}>
            <SearchModal />
          </div>
        )}
        {showNotificationsMenu && (
          <div className="relative" ref={notificationsRef}>
            <NotificationsModal notifications={notifications} />
          </div>
        )}
        {showSettingsMenu && (
          <div className="relative" ref={settingsRef}>
            <SettingsModal settingsOptions={settingsOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
