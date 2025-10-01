import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { BsStars } from "react-icons/bs";
import { TbCoinRupee } from "react-icons/tb";
import edit from "../../../assets/icons/edit.svg"; // Import edit icon
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";

const ProjectDetail = () => {
  const { projectId } = useParams(); // Get project ID from URL params
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("About");
  const role = Cookies.get("role"); // Get user role from cookies
  const userId = Cookies.get("id"); // Get user ID from cookies
  const [donationDetails, setDonationDetails] = useState([]);
  const [donationLoading, setDonationLoading] = useState(true);
  const [donationError, setDonationError] = useState(null);

  const [contributorDetails, setContributorDetails] = useState({
    mentorContributors: [],
    studentContributors: [],
  });
  const [isContributor, setIsContributor] = useState(false);

  console.log(projectData);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/project/${projectId}`);
        setProjectData(response.data);

        // Fetch donation details with user information
        const donations = await Promise.all(
          response.data.donations.map(async (donation) => {
            const userResponse = await axiosInstance.get(`/users/${donation.userId}`);
            return { ...donation, user: userResponse.data.data }; // Combine donation and user data
          })
        );
        setDonationDetails(donations);
      } catch (err) {
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/project/${projectId}`);
        setProjectData(response.data);

        // Fetch contributor details
        const mentorContributors = await Promise.all(
          response.data.mentorContributors.map((id) =>
            axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
          )
        );

        const studentContributors = await Promise.all(
          response.data.studentContributors.map((id) =>
            axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
          )
        );

        setContributorDetails({
          mentorContributors,
          studentContributors,
        });

        // Check if the current user is already a contributor
        const isMentor = response.data.mentorContributors.includes(userId);
        const isStudent = response.data.studentContributors.includes(userId);
        setIsContributor(isMentor || isStudent);
      } catch (err) {
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, userId]);

  const toggleContributor = async () => {
    try {
      if (projectData.createdBy === userId) {
        toast.error("You cannot contribute to your own project.");
        return;
      }
      if (isContributor) {
        await axiosInstance.delete(`/project/contribute/${projectId}`, {
          data: { userId },
        });
      } else {
        await axiosInstance.post(`/project/contribute/${projectId}`, {
          userId,
        });
      }

      const response = await axiosInstance.get(`/project/${projectId}`);
      const isMentor = response.data.mentorContributors.includes(userId);
      const isStudent = response.data.studentContributors.includes(userId);
      setIsContributor(isMentor || isStudent);

      const mentorContributors = await Promise.all(
        response.data.mentorContributors.map((id) =>
          axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
        )
      );

      const studentContributors = await Promise.all(
        response.data.studentContributors.map((id) =>
          axiosInstance.get(`/users/${id}`).then((res) => res.data.data)
        )
      );

      setContributorDetails({
        mentorContributors,
        studentContributors,
      });
    } catch (error) {
      console.error("Failed to toggle contributor:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  const tabContent = {
    About: (
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">About</h3>
          {projectData.createdBy === userId && (
            <Link to={`/dashboard/project/edit/${projectId}`}>
              <button>
                <img
                  src={edit}
                  className="h-8 w-8 bg-gray-200 rounded-full p-1 hover:bg-blue-500 transition"
                  alt="Edit"
                />
              </button>
            </Link>
          )}
        </div>
        <p className="mt-4">
          {projectData?.description || "No description available."}
        </p>
      </div>
    ),

    "Mentor/Contributor": (
      <div>
        <h3 className="text-lg font-bold">Fund Donation</h3>
        <div className="mt-4">
          <h4 className="text-md font-semibold">Mentors:</h4>
          {contributorDetails.mentorContributors.length > 0 ? (
            <ul>
              {contributorDetails.mentorContributors.map((mentor) => (
                <li
                  key={mentor._id}
                  className="flex justify-between items-center mt-2"
                >
                  <div className="flex items-center">
                    <img
                      src={mentor.profileimageUrl}
                      alt={mentor.firstName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <p>
                      {mentor.firstName} {mentor.lastName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No mentors available.</p>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-md font-semibold">Students:</h4>
          {contributorDetails.studentContributors.length > 0 ? (
            <ul>
              {contributorDetails.studentContributors.map((student) => (
                <li
                  key={student._id}
                  className="flex justify-between items-center mt-2"
                >
                  <div className="flex items-center">
                    <img
                      src={student.profileimageUrl}
                      alt={student.firstName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <p>
                      {student.firstName} {student.lastName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No students available.</p>
          )}
        </div>
      </div>
    ),
    Eligibility: (
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Eligibility Criteria</h3>
          {projectData.createdBy === userId && (
            <Link to={`/dashboard/project/edit/${projectId}`}>
              <button>
                <img
                  src={edit}
                  className="h-8 w-8 bg-gray-200 rounded-full p-1 hover:bg-blue-500 transition"
                  alt="Edit"
                />
              </button>
            </Link>
          )}
        </div>
        <p className="mt-4">
          {projectData?.eligibility || "No eligibility criteria available."}
        </p>
      </div>
    ),

    "Project Source": (
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Project Links</h3>
          {projectData.createdBy === userId && (
            <Link to={`/dashboard/project/edit/${projectId}`}>
              <button>
                <img
                  src={edit}
                  className="h-8 w-8 bg-gray-200 rounded-full p-1 hover:bg-blue-500 transition"
                  alt="Edit"
                />
              </button>
            </Link>
          )}
        </div>
        {projectData?.projectLinks ? (
          Object.entries(projectData.projectLinks).map(([key, value]) => (
            <div key={key} className="mt-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {key}
              </a>
            </div>
          ))
        ) : (
          <p>No project links available.</p>
        )}
      </div>
    ),

    Donation: (
      <div className="relative">
        {/* Total Donation */}
        <div className="absolute top-0 right-0">
          <h3 className="text-lg font-bold">
            Total Donation: ₹
            {donationDetails.reduce(
              (total, donation) => total + (donation.amount || 0),
              0
            )}
          </h3>
        </div>

        <h3 className="text-lg font-bold">Mentorship & Collaboration</h3>

        {/* Donation section */}
      <div className="mt-8">
        <h3 className="text-lg font-bold">Mentorship & Collaboration</h3>
        {donationError ? (
          <p className="mt-4 text-red-500">{donationError}</p>
        ) : (
          <div className="mt-4">
            <h4 className="text-md font-semibold">Donations:</h4>
            {donationDetails.length > 0 ? (
              <ul>
                {donationDetails.map((donation) => (
                  <li
                    key={donation._id}
                    className="flex justify-between items-center mt-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          donation.donor?.profileimageUrl ||
                          `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/40`
                        }
                        alt={donation.donorName || "User"}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <p>{donation.donorName || "Unknown Donor"}</p>
                    </div>
                    <span className="text-sm font-medium">
                      ₹{donation.amount || 0}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No donations available.</p>
            )}
        
          </div>
        )}
      </div>
    </div>
    ),
  };
  

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard/project" className="self-center mr-3">
              <IoChevronBackOutline />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Project Description
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={toggleContributor}
              className={`px-4 py-2 border font-semibold text-sm rounded-lg ${
                isContributor
                  ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              }`}
            >
              {isContributor
                ? "Remove as Contributor"
                : role === "student"
                  ? "Contribute as Student"
                  : role === "faculty" || role === "alumni"
                    ? "Contribute as Mentor"
                    : "Contribute"}
            </button>
            <div className="flex items-center">
              <Link to={`/dashboard/project/donate/${projectId}`}>
                <button>
                  <TbCoinRupee className="h-10 w-10 bg-yellow-500 rounded-full text-white p-2" />
                </button>
              </Link>
            </div>
            {projectData.createdBy === userId && (
              <Link to={`/dashboard/project/edit/${projectId}`}>
                <button>
                  {/* <img
                    src={edit}
                    className="h-10 w-10 bg-gray-200 rounded-full text-white p-1 hover:bg-blue-500 transition"
                  /> */}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Main Section */}
        <div className="flex mt-8">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <img
                src={
                  projectData?.projectPhoto || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/100`
                }
                alt="Project Icon"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="ml-6">
            <div className="flex">
              <h2 className="text-xl font-bold text-gray-800">
                {projectData?.projectTopic || "Untitled Project"}
              </h2>
              {(role === "mentor" || role === "faculty" || role === "alumni") &&
              projectData?.openForMentor ? (
                <div className="ml-6 px-6 py-1 border flex items-center gap-2 font-semibold text-sm rounded-lg text-white bg-green-400">
                  <BsStars />
                  Open for Mentors
                </div>
              ) : projectData?.openForStudent ? (
                <div className="ml-6 px-6 py-1 border flex items-center gap-2 font-semibold text-sm rounded-lg text-white bg-green-400">
                  <BsStars />
                  Open for Students
                </div>
              ) : null}
            </div>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Department: {projectData?.department || "Unknown Department"}
            </p>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Phase: {projectData?.projectPhase || "Unknown Phase"}
            </p>
          </div>
        </div>

        {/* Tab Section */}
        <div className="mt-8">
          <div className="flex space-x-6 border-b border-gray-300 pb-2">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                className={`font-semibold pb-2 ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">{tabContent[activeTab]}</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
