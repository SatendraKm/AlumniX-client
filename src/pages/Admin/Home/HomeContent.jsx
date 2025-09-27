import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance"; // Assuming axiosInstance is set up for API calls
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import PostCard from "../common/PostCard";
import EventCard from "../Event/EventCard";
// import JobCard from "../Job/JobCard";

const HomeContent = () => {
  const [activeTab, setActiveTab] = useState("Posts");
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  // const [jobs, setJobs] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  // const [loadingJobs, setLoadingJobs] = useState(false);
  const [users, setUsers] = useState({}); // State to store user data

  const fetchCurrentUserId = JSON.parse(localStorage.getItem("chat-app-current-user"));
  const currentUserId = fetchCurrentUserId?._id;

  const createdForId = Cookies.get("id");

  // Fetch posts data
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await axiosInstance.get("/organizations/all-posts");
      const filteredPosts = response.data.posts.filter(
        (post) => post.created_for === createdForId
      );
      setPosts(filteredPosts);
      await fetchUsersForPosts(filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  // Fetch user details for each post
  const fetchUsersForPosts = async (posts) => {
    const userIds = [...new Set(posts.map((post) => post.createdBy))];
    const userDetails = {};

    try {
      await Promise.all(
        userIds.map(async (id) => {
          const response = await axiosInstance.get(`/users/${id}`);
          userDetails[id] = response.data.data;
        })
      );
      setUsers(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details.");
    }
  };

  // Fetch events data
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axiosInstance.get("/organizations/all-events");
      const filteredEvents = response.data.events.filter(
        (event) => event.created_for === createdForId
      );
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch jobs data
  // const fetchJobs = async () => {
  //   setLoadingJobs(true);
  //   try {
  //     const response = await axiosInstance.get("/organizations/all-jobs");
  //     console.log(response)
  //     const filteredJobs = response.data.jobs.filter(
  //       (job) => job.created_for === createdForId
  //     );
  //     setJobs(filteredJobs);
  //   } catch (error) {
  //     console.error("Error fetching jobs:", error);
  //     toast.error("Failed to fetch jobs.");
  //   } finally {
  //     setLoadingJobs(false);
  //   }
  // };

  // Reset data and fetch based on active tab
  useEffect(() => {
    if (activeTab === "Posts") {
      setPosts([]);
      fetchPosts();
    } else if (activeTab === "Events") {
      setEvents([]);
      fetchEvents();
    } 
  }, [activeTab]);

  return (
    <div className="w-3/4 mx-auto">
      {/* Tabs Section */}
      <div className="flex border border-gray-300 justify-around bg-white rounded-2xl shadow-lg px-4 py-1 m-4">
        {["Posts", "Events"].map((tab) => (
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

      {/* Content Section */}
      <div className="w-11/12 bg-[#ffffff] mx-auto h-[calc(100vh-150px)] overflow-y-auto hide-scrollbar">
  {activeTab === "Posts" ? (
    loadingPosts ? (
      <div className="flex justify-center items-center">
        <div className="spinner-border animate-spin border-t-2 border-b-2 border-gray-500 w-8 h-8 rounded-full"></div>
      </div>
    ) : posts.length > 0 ? (
      posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          user={users[post.createdBy]}
          currentUserId={currentUserId}
        />
      ))
    ) : (
      <p className="text-gray-500 text-center">No posts available.</p>
    )
  ) : activeTab === "Events" ? (
    loadingEvents ? (
      <div className="flex justify-center items-center">
        <div className="spinner-border animate-spin border-t-2 border-b-2 border-gray-500 w-8 h-8 rounded-full"></div>
      </div>
    ) : events.length > 0 ? (
      <div className="flex flex-wrap gap-4">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            currentUserId={currentUserId}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4" // Adjust the width as per your requirement
          />
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">No events available.</p>
    )
  ) : null}
</div>

    </div>
  );
};

export default HomeContent;
