import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import JobCard from "./JobCard";
import Cookies from "js-cookie";

const JobContent = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesFetched, setRolesFetched] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]); // Track bookmarked jobs
  const [userSkills, setUserSkills] = useState([]); // Track user skills
  const currentUserId = Cookies.get("id");

  const tabs = ["All", "For You"];

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobs/all");
        if (response.data.success) {
          setJobs(response.data.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch user skills
  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const response = await axiosInstance.get(`/users/${currentUserId}`);
        if (response.data.success) {
          setUserSkills(
            response.data.data.skills.map((skill) => skill.skillName)
          );
        }
      } catch (error) {
        console.error("Error fetching user skills:", error);
      }
    };

    if (currentUserId) {
      fetchUserSkills();
    }
  }, [currentUserId]);

  // Fetch roles dynamically for each job's creator
  useEffect(() => {
    if (!rolesFetched && jobs.length > 0) {
      const fetchRolesForJobs = async () => {
        const updatedJobs = await Promise.all(
          jobs.map(async (job) => {
            if (!job.createdBy) return job;
            try {
              const { data } = await axiosInstance.get(
                `/users/${job.createdBy}`
              );
              return {
                ...job,
                createdBy: {
                  ...job.createdBy,
                  role: data.data.role,
                  firstName: data.data.firstName,
                  lastName: data.data.lastName,
                },
              };
            } catch (error) {
              console.error(`Failed to fetch role for job ${job._id}:`, error);
              return job;
            }
          })
        );
        setJobs(updatedJobs);
        setRolesFetched(true);
      };
      fetchRolesForJobs();
    }
  }, [rolesFetched, jobs]);

  // Handle like action
  const handleLikePost = async (jobId) => {
    try {
      await axiosInstance.post(`/jobs/like/${jobId}`, {
        userId: currentUserId,
      });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                likes: job.likes.includes(currentUserId)
                  ? job.likes.filter((id) => id !== currentUserId)
                  : [...job.likes, currentUserId],
                dislikes: job.dislikes.filter((id) => id !== currentUserId),
              }
            : job
        )
      );
    } catch (error) {
      console.error(`Error liking job ${jobId}:`, error);
    }
  };

  // Handle dislike action
  const handleDislikePost = async (jobId) => {
    try {
      await axiosInstance.post(`/jobs/dislike/${jobId}`, {
        userId: currentUserId,
      });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                dislikes: job.dislikes.includes(currentUserId)
                  ? job.dislikes.filter((id) => id !== currentUserId)
                  : [...job.dislikes, currentUserId],
                likes: job.likes.filter((id) => id !== currentUserId),
              }
            : job
        )
      );
    } catch (error) {
      console.error(`Error disliking job ${jobId}:`, error);
    }
  };

  // Handle bookmark action
  const handleBookmarkJob = async (jobId) => {
    if (!currentUserId) {
      console.error("User not logged in.");
      return;
    }

    try {
      const response = await axiosInstance.patch(`/jobs/save-job/${jobId}`, {
        userId: currentUserId,
      });
      if (response.data.success) {
        setUserBookmarks((prevBookmarks) =>
          prevBookmarks.includes(jobId)
            ? prevBookmarks.filter((id) => id !== jobId)
            : [...prevBookmarks, jobId]
        );
      } else {
        console.error("Failed to bookmark job:", jobId);
      }
    } catch (error) {
      console.error(`Error bookmarking job ${jobId}:`, error);
    }
  };
  

  // Handle apply action
  const handleApplyJob = async (jobId) => {
    if (!currentUserId) {
      console.error("User not logged in.");
      return;
    }

    try {
      const response = await axiosInstance.post(`/jobs/apply/${jobId}`, {
        userId: currentUserId,
      });
      if (response.data.success) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isApplied: true } : job
          )
        );
      } else {
        console.error("Failed to apply for job:", jobId);
      }
    } catch (error) {
      console.error(`Error applying for job ${jobId}:`, error);
    }
  };

  // Filtering logic
  const filteredJobs = useMemo(() => {
    if (activeTab === "For You") {
      return jobs.filter((job) =>
        job.skills.some((jobSkill) =>
          userSkills.some((userSkill) =>
            jobSkill.toLowerCase().includes(userSkill.toLowerCase())
          )
        )
      );
    }
    return jobs;
  }, [activeTab, jobs, userSkills]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader" />
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tabs Section */}
      <div className="flex border border-gray-300 justify-around bg-white rounded-2xl shadow-lg px-3 py-1 m-2">
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

      {/* Message for No Jobs Found */}
      {!filteredJobs.length && !loading && (
        <div className="text-center p-4">
          <p>
            No jobs found for <strong>{activeTab}</strong>.
          </p>
          <p>Try exploring other categories or check back later.</p>
        </div>
      )}

      {/* Job Cards Section */}
      <div
        className="p-4 overflow-y-auto hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 160px)" }}
      >
        <div className="grid grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              currentUserId={currentUserId}
              onLikePost={handleLikePost}
              onDislikePost={handleDislikePost}
              onBookmarkJob={handleBookmarkJob}
              onApplyJob={handleApplyJob}
              bookmarks={userBookmarks}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobContent;
