import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import AppliedCard from "./AppliedCard";

const AppliedContent = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [rolesFetched, setRolesFetched] = useState(false);

  // Fetch current user from localStorage
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = JSON.parse(
        localStorage.getItem("chat-app-current-user")
      );
      if (storedUser && storedUser._id) {
        setCurrentUserId(storedUser._id);
      } else {
        console.error("No current user found in localStorage");
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch applied jobs for the current user
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        if (currentUserId) {
          const response = await axiosInstance.get(`/users/${currentUserId}`);
          if (response.data.success) {
            const appliedJobs = response.data.data.appliedJobs || [];
            // Fetch job details for each applied job
            const jobDetailsPromises = appliedJobs.map(async (jobId) => {
              const jobResponse = await axiosInstance.get(`/jobs/${jobId}`);
              return jobResponse.data;
            });
            const fetchedJobs = await Promise.all(jobDetailsPromises);
            setJobs(fetchedJobs);
          }
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [currentUserId]);

  useEffect(() => {
    const fetchRolesForJobs = async () => {
      const updatedJobs = await Promise.all(
        jobs.map(async (job) => {
          if (job.createdBy) {
            try {
              const response = await axiosInstance.get(
                `/users/${job.createdBy}`
              );
              return {
                ...job,
                creatorName: `${response.data.data.firstName} ${response.data.data.lastName}`,
              };
            } catch (error) {
              console.error(`Failed to fetch role for job ${job._id}:`, error);
              return job; // Fallback to original job
            }
          }
          return job; // If no creator, return the job as-is
        })
      );

      setJobs(updatedJobs);
      setRolesFetched(true); // Mark roles as fetched
    };

    if (jobs.length && !rolesFetched) {
      fetchRolesForJobs();
    }
  }, [jobs, rolesFetched]);

  if (loading) {
    return <p>Loading applied jobs...</p>;
  }

  if (!jobs.length) {
    return <p>No applied jobs found.</p>;
  }

  return (
    <div
      className="w-full p-8 overflow-y-auto hide-scrollbar"
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      <div className="grid grid-cols-4 gap-2 ">
        {jobs.map((job) => (
          <AppliedCard
            key={job._id}
            job={job}
            currentUserId={currentUserId}
            creatorName={job.creatorName} // Pass the creatorName prop
          />
        ))}
      </div>
    </div>
  );
};

export default AppliedContent;
