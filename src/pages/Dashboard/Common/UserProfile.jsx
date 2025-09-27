import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";
import ProjectCard from "../Project/ProjectCard";
import PostCard from "../Common/PostCard";
import { FiEdit } from "react-icons/fi";
import { useParams } from "react-router-dom";
import EventCard from "../Event/EventCard";
import JobCard from "../Job/JobCard";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState("");
  const [profileimageUrl, setprofileimageUrl] = useState("");
  const [backgroundimageUrl, setbackgroundimageUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [role, setRole] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [userEvent, setUserEvent] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
  });
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [isEditingExperience, setIsEditingExperience] = useState(false);

  const [certificationsAndLicenses, setCertificationsAndLicenses] = useState(
    []
  );
  const [newCertificationsAndLicenses, setNewCertificationsAndLicenses] =
    useState({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
    });
  const [
    isEditingCertificationsAndLicenses,
    setIsEditingCertificationsAndLicenses,
  ] = useState(false);

  const [publicationsAndResearch, setPublicationsAndResearch] = useState([]);
  const [newPublicationsAndResearch, setNewPublicationsAndResearch] = useState({
    title: "",
    publicationDate: "",
    publisher: "",
    description: "",
    link: "",
  });
  const [
    isEditingPublicationsAndResearch,
    setIsEditingPublicationsAndResearch,
  ] = useState(false);

  const [skills, setSkills] = useState([]);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingTagLine, setIsEditingTagLine] = useState(false);
  const [isEditingOrganization, setIsEditingOrganization] = useState(false);

  const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
  const [isEditingBannerImage, setIsEditingBannerImage] = useState(false);

  const [userFundings, setUserFundings] = useState([]);
  const [allFunds, setAllFunds] = useState([]);
  const [donations, setDonations] = useState([]);

  // const [userProjectDonations, setUserProjectDonations] = useState([]);
  // const [projects, setProjects] = useState([]);
  // const [projectDonations, setProjectDonations] = useState([]);

  const [activeTab, setActiveTab] = useState("Posts");

  const [loading, setLoading] = useState(true);

  const tabs = ["Posts", "Projects", "Events", "Job", "Donations"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, postsResponse, projectsResponse] =
          await Promise.all([
            axiosInstance.get(`/users/${userId}`),
            axiosInstance.get(`/post/user/${userId}`),
            axiosInstance.get(`/project/user/${userId}`),
          ]);

        const data = userResponse.data.data;
        console.log(data);
        setUserData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setAbout(data.about);
        setSkills(data.skills);
        setTagLine(data.tagLine);
        setEducation(data.education);
        setExperience(data.experience);
        setCertificationsAndLicenses(data.certificationsAndLicenses);
        setRole(data.role);
        setEmail(data.email);
        setOrganizationId(data.organization);
        setPublicationsAndResearch(data.publicationsAndResearch);
        setFollowers(data.followers);
        setFollowing(data.following);
        setprofileimageUrl(userData.profileimageUrl || "");
        setbackgroundimageUrl(userData.backgroundimageUrl || "");
        setUserPosts(postsResponse.data || []);
        setUserProjects(projectsResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data or posts:", error);
      }
    };

    fetchUserData();
  }, [userData.backgroundimageUrl, userData.profileimageUrl, userId]);

  useEffect(() => {
    const fetchOrganizationName = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/organizations/${organizationId}`
        );
        setOrganization(response.data.organization.name);
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizationName();
    }
  }, [organizationId]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/event/user/${userId}`);
        setUserEvent(response.data.events);
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [userId]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/jobs/user/${userId}`);
        setUserJobs(response.data.jobs);
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);

  useEffect(() => {
    const fetchUserFundings = async () => {
      try {
        setLoading(true);
        const [fundingResponse, fundsResponse] = await Promise.all([
          axiosInstance.get(`/funding/user-wise-funding/${userId}`),
          axiosInstance.get("/funding/get-all-funds"),
        ]);

        setUserFundings(fundingResponse.data || []);
        setAllFunds(fundsResponse.data.funds || []);

        // Match fund details with user's funding
        const matchedDonations = fundingResponse.data
          .map((funding) => {
            const matchedFund = fundsResponse.data.funds.find(
              (fund) => fund._id === funding.fundID
            );
            return matchedFund
              ? { ...matchedFund, amount: funding.amount }
              : null;
          })
          .filter((donation) => donation !== null);

        setDonations(matchedDonations);
      } catch (error) {
        console.error("Error fetching funding data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFundings();
  }, [userId]);
  // useEffect(() => {
  //   const fetchUserProjectDonations = async () => {
  //     try {
  //       setLoading(true);

  //       // Fetch user donations to projects
  //       const [donationsResponse, projectsResponse] = await Promise.all([
  //         axiosInstance.get(`/project/user-wise-donation/${userId}`),
  //         axiosInstance.get("/project/get-all-projects") // You can modify this as needed
  //       ]);

  //       setUserProjectDonations(donationsResponse.data || []);
  //       setProjects(projectsResponse.data.projects || []);

  //       // Match donations to projects
  //       const matchedProjectDonations = donationsResponse.data.map((donation) => {
  //         const matchedProject = projectsResponse.data.projects.find(
  //           (project) => project._id === donation.projectID
  //         );
  //         return matchedProject
  //           ? { ...matchedProject, donationAmount: donation.amount }
  //           : null;
  //       }).filter((projectDonation) => projectDonation !== null);

  //       setProjectDonations(matchedProjectDonations);
  //     } catch (error) {
  //       console.error("Error fetching project donation data:", error);
  //       toast.error("Failed to fetch project donations.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserProjectDonations();
  // }, [userId]);

  // Update About Section
  const updateAbout = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        about,
      });
      toast.success("Profile updated successfully!");
      setIsEditingAbout(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };
  const updateTagLine = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        tagLine,
      });
      toast.success("Tagline updated successfully!");
      setIsEditingTagLine(false);
    } catch (error) {
      console.error("Error updating Tagline:", error);
    }
  };
  const updateOrganization = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        organization,
      });
      toast.success("Organization updated successfully!");
      setIsEditingTagLine(false);
    } catch (error) {
      console.error("Error updating Organization:", error);
    }
  };
  const updateSkills = async () => {
    try {
      console.log(skills);
      await axiosInstance.put(`/users/update/${userId}`, {
        skills,
      });
      toast.success("Skills updated successfully!");
      setIsEditingSkills(false);
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills.");
    }
  };
  const updateEducation = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        education,
      });
      toast.success("Education updated successfully!");
      setIsEditingEducation(false);
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to update education.");
    }
  };
  const updateExperience = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        experience,
      });
      toast.success("Experience updated successfully!");
      setIsEditingExperience(false);
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to update experience.");
    }
  };
  const updateCertifications = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        certificationsAndLicenses,
      }); // Replace with your backend route
      toast.success("Certifications updated successfully!");
      setIsEditingCertificationsAndLicenses(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating certifications:", error);
      toast.error("Failed to update certifications.");
    }
  };

  // Handle Input Change for About Section
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "about") {
      setAbout(value);
    } else if (name === "tagLine") {
      setTagLine(value);
    } else if (name === "organization") {
      setOrganization(value);
    } else if (name === "skills") {
      setNewSkill(value);
    }
  };
  const handleEducationInputChange = (field, value) => {
    setNewEducation((prev) => ({
      ...prev,
      [field]: value, // Update the specific field within newEducation
    }));
  };
  const handleAddSkills = () => {
    const enteredSkills = newSkill
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    const uniqueSkills = [
      ...new Set([...skills.map((s) => s.skillName), ...enteredSkills]),
    ]
      .slice(0, 7) // Enforce the limit of 7 skills
      .map((skill) => ({ skillName: skill })); // Convert to skill objects

    if (uniqueSkills.length > skills.length) {
      setSkills(uniqueSkills);
      toast.success("Skills added successfully!");
    } else {
      toast.error("No new skills added or limit exceeded!");
    }

    setNewSkill(""); // Clear the input field
  };
  const removeSkill = (skillToRemove) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.skillName !== skillToRemove)
    );
  };
  const handleAddEducation = () => {
    // Validate required fields
    if (
      !newEducation.institution ||
      !newEducation.degree ||
      !newEducation.fieldOfStudy ||
      !newEducation.startDate
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    setEducation((prev) => [...prev, { ...newEducation }]); // Add new entry
    setNewEducation({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
    }); // Reset input fields
    toast.success("Education added successfully!");
  };
  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };
  const handleExperienceInputChange = (field, value) => {
    setNewExperience((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCertificationsInputChange = (field, value) => {
    setNewCertificationsAndLicenses((prev) => ({
      ...prev,
      [field]: value, // Dynamically update fields
    }));
  };

  const handleAddExperience = () => {
    if (!newExperience.title || !newExperience.company) {
      toast.error("Please fill all required fields!");
      return;
    }

    setExperience((prev) => [...prev, { ...newExperience }]); // Add new entry
    setNewExperience({
      title: "",
      company: "",
      location: "",
      description: "",
    }); // Reset input fields
    toast.success("Experience added successfully!");
  };
  const removeExperience = (index) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
    toast.info("Experience removed!");
  };
  const handlePublicationsInputChange = (field, value) => {
    setNewPublicationsAndResearch((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleAddPublication = () => {
    if (
      !newPublicationsAndResearch.title ||
      !newPublicationsAndResearch.publicationDate
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    setPublicationsAndResearch((prev) => [
      ...prev,
      { ...newPublicationsAndResearch },
    ]); // Add new entry

    setNewPublicationsAndResearch({
      title: "",
      publicationDate: "",
      publisher: "",
      description: "",
      link: "",
    }); // Reset input fields

    toast.success("Publication added successfully!");
  };

  const removePublication = (index) => {
    setPublicationsAndResearch((prev) => prev.filter((_, i) => i !== index)); // Remove by index
    toast.info("Publication removed.");
  };
  const updatePublications = async () => {
    try {
      await axiosInstance.put(`/users/update/${userId}`, {
        publicationsAndResearch,
      }); // Replace with your backend route
      toast.success("Publications updated successfully!");
      setIsEditingPublicationsAndResearch(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating publications:", error);
      toast.error("Failed to update publications.");
    }
  };

  const handleAddCertification = () => {
    if (
      !newCertificationsAndLicenses.name ||
      !newCertificationsAndLicenses.issuingOrganization
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    setCertificationsAndLicenses((prev) => [
      ...prev,
      { ...newCertificationsAndLicenses },
    ]); // Add new entry

    setNewCertificationsAndLicenses({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
    }); // Reset input fields

    toast.success("Certification added successfully!");
  };
  const removeCertification = (index) => {
    setCertificationsAndLicenses((prev) => prev.filter((_, i) => i !== index)); // Remove by index
    toast.info("Certification removed.");
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 2;

    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(
        `File size exceeds ${maxSizeMB}MB. Please upload a smaller image.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("displayPicture", file);

    try {
      const response = await axiosInstance.patch(
        `/profile/updateProfileImage/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const updatedImageUrl = URL.createObjectURL(file);
        setprofileimageUrl(updatedImageUrl);
        toast.success("Profile image updated successfully!");
      } else {
        throw new Error(
          response.data.message || "Failed to upload profile image."
        );
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("An error occurred while saving the profile image.");
    }
  };
  const handleBannerImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 2;

    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(
        `File size exceeds ${maxSizeMB}MB. Please upload a smaller image.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("displayPicture", file);

    try {
      const response = await axiosInstance.patch(
        `/profile/updateBackgroundImage/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const updatedBannerUrl = URL.createObjectURL(file);
        setbackgroundimageUrl(updatedBannerUrl);
        toast.success("Banner image updated successfully!");
      } else {
        throw new Error(
          response.data.message || "Failed to upload banner image."
        );
      }
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error("An error occurred while saving the banner image.");
    }
  };
  const getBorderColor = () => {
    switch (role) {
      case "student":
        return "border-yellow-500";
      case "faculty":
        return "border-red-500";
      case "alumni":
        return "border-blue-500";
      default:
        return "border-gray-300";
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading profile...</div>;
  }

  return (
    <div className="flex w-full ">
      {/* Left Section */}
      <div className="w-[60%] p-4 ">
        <div className="flex flex-col items-center">
          {/* Profile Section */}
          <div className="w-[80%] h-80 p-3 bg-white rounded-lg shadow-lg border mx-auto flex flex-col items-center justify-center">
            <div className="relative shadow-md rounded-lg overflow-hidden w-full">
              {/* Banner Image Section */}
              <div className="relative w-full h-60">
                {/* Background Cover Image */}
                <div
                  className="h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${backgroundimageUrl})`, // Use the banner image URL
                  }}
                >
                  {/* Optional Overlay for Dim Effect */}
                  <div className="bg-black bg-opacity-25 w-full h-full"></div>
                </div>

                {/* Edit Button */}
                {!isEditingBannerImage && (
                  <button
                    onClick={() => setIsEditingBannerImage(true)}
                    className="absolute top-2 right-2 bg-white bg-opacity-25 text-white px-2 text-center rounded-full text-md z-30"
                  >
                    <FiEdit className="text-white" />
                  </button>
                )}

                {/* Upload Button */}
                {isEditingBannerImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <label
                      htmlFor="backgroundimageUrl"
                      className="bg-white text-black p-1 rounded-lg font-semibold cursor-pointer"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="backgroundimageUrl"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerImageChange} // Combined upload and save handler
                    />
                  </div>
                )}
              </div>

              {/* Profile Image Section */}
              <div className="absolute top-1/2 transform -translate-y-1/2 w-fit mx-auto left-1/2 -translate-x-1/2">
                {/* Profile Image */}
                <div className="relative">
                  {/* Dimmed Background Overlay */}
                  {isEditingProfileImage && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex justify-center items-center z-40">
                      <label
                        htmlFor="profileimageUrl"
                        className="bg-white text-black px-2 py-1 rounded-lg font-semibold cursor-pointer"
                      >
                        Upload Image
                      </label>
                      <input
                        type="file"
                        id="profileimageUrl"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange} // Combined upload and save handler
                      />
                    </div>
                  )}

                  {/* Profile Image */}
                  <img
                    src={profileimageUrl} // Use temp preview if available
                    alt="Profile"
                    className={`rounded-full w-36 h-36 cursor-pointer border-8 ${getBorderColor()} z-10`}
                    onClick={() => setIsEditingProfileImage(true)} // Open editing mode
                  />

                  {/* Edit Button */}
                  {!isEditingProfileImage && (
                    <button
                      onClick={() => setIsEditingProfileImage(true)}
                      className="absolute bottom-2 right-2 bg-white bg-opacity-25 text-black p-2 rounded-full text-md z-50"
                    >
                      <FiEdit className="text-black" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <h1 className=" text-2xl font-bold text-center">
              {firstName} {lastName}
            </h1>

            <div className="flex space-x-6 gap-2 p-1 mt-1 px-4 border rounded-3xl justify-center">
              <div className="text-center">
                <p className="font-bold text-lg">{followers.length}</p>
                <p className="text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{following.length}</p>
                <p className="text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{userPosts.length}</p>
                <p className="text-gray-500">Posts</p>
              </div>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="flex border justify-around bg-white rounded-2xl shadow-md w-full px-1 py-1 m-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-4 py-2 rounded-full font-semibold ${
                  activeTab === tab ? "text-black font-bold" : "text-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="bg-white h-[calc(66vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-50 ">
            {activeTab === "Posts" && (
              <div>
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      user={userData}
                      currentUserId={userId}
                      onLikePost={(postId) =>
                        console.log(`Liked post ${postId}`)
                      }
                      onDislikePost={(postId) =>
                        console.log(`Disliked post ${postId}`)
                      }
                      onFollowUser={(userId) =>
                        console.log(`Followed user ${userId}`)
                      }
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No posts to show.</p>
                )}
              </div>
            )}
            {activeTab === "Projects" && (
              <div>
                {userProjects.length > 0 ? (
                  userProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No projects to show.
                  </p>
                )}
              </div>
            )}
            {activeTab === "Events" && (
              <div>
                {userEvent.length > 0 ? (
                  userEvent.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No Events to show.
                  </p>
                )}
              </div>
            )}
            {activeTab === "Job" && (
              <div>
                {userJobs.length > 0 ? (
                  userJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      currentUserId={userId}
                      onLikePost
                      onDislikePost
                      onBookmarkJob
                      onApplyJob
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No jobs to show.</p>
                )}
              </div>
            )}
            {activeTab === "Donations" && (
              <div>
                {/* Displaying Donations to Funds */}
                {donations.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Donations to Funds
                    </h2>
                    {donations.map((donation) => (
                      <div
                        key={donation._id}
                        className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center"
                      >
                        <img
                          src={donation.fundImage || donation.fundphoto}
                          alt={donation.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <h3 className="font-bold">{donation.title}</h3>
                          <p className="text-gray-700">
                            {donation.description}
                          </p>
                          <p className="font-semibold text-blue-500">
                            Amount Donated: ${donation.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No donations to show for funds.
                  </p>
                )}

                {/* Displaying Donations to Projects */}
                {/* {projectDonations.length > 0 ? (
      <div>
        <h2 className="text-xl font-semibold mb-4">Donations to Projects</h2>
        {projectDonations.map((projectDonation) => (
          <div
            key={projectDonation._id}
            className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center"
          >
            <img
              src={projectDonation.projectPhoto}
              alt={projectDonation.projectTopic}
              className="w-16 h-16 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="font-bold">{projectDonation.projectTopic}</h3>
              <p className="text-gray-700">{projectDonation.description}</p>
              <p className="font-semibold text-blue-500">
                Amount Donated: ${projectDonation.donationAmount}
              </p>
              <p className="text-gray-600">
                Project Type: {projectDonation.projectType} | Department: {projectDonation.department}
              </p>
              <a
                href={projectDonation.projectLinks.GitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub Link
              </a>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">No donations to show for projects.</p>
    )} */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[40%] mx-auto p-4  bg-white  ">
        <div className="overflow-y-auto h-[calc(100vh-100px)]  scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-50 border p-4 rounded-lg shadow-md drop-shadow-md">
          {/* this is about section */}

          <div className="PersonalInformation p-2 mt-3  ">
            <h1 className="text-xl font-bold mb-4">Personal Information</h1>
            <div className="about relative  items-center justify-start mb-2">
              <h2 className="  mr-2  font-semibold">About- </h2>
              <div>
                {isEditingAbout ? (
                  <textarea
                    name="about"
                    value={about}
                    onChange={handleInputChange}
                    className="w-fit border py-0 h-8 px-2 rounded"
                  />
                ) : (
                  <p className="text-gray-700 text-base">{about}</p>
                )}
                <button
                  onClick={
                    isEditingAbout ? updateAbout : () => setIsEditingAbout(true)
                  }
                  className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black  rounded-md"
                >
                  {isEditingAbout ? (
                    <span>Save</span>
                  ) : (
                    <FiEdit className="text-black" />
                  )}
                </button>
              </div>
            </div>
            <div className="tagline relative flex items-center justify-start mb-2">
              <h2 className="mr-2 font-semibold">Tagline-</h2>
              {isEditingTagLine ? (
                <textarea
                  name="tagLine"
                  value={tagLine}
                  onChange={handleInputChange}
                  className="w-fit border py-0 h-8 px-2 rounded"
                />
              ) : (
                <p className="text-gray-700 text-base">{tagLine}</p>
              )}
              <button
                onClick={
                  isEditingTagLine
                    ? updateTagLine
                    : () => setIsEditingTagLine(true)
                }
                className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black  rounded-md"
              >
                {isEditingTagLine ? (
                  <span>Save</span>
                ) : (
                  <FiEdit className="text-black" />
                )}
              </button>
            </div>
            <div className="email relative flex items-center justify-start mb-2">
              <h2 className="mr-2 font-semibold">Email-</h2>
              <p className="text-gray-700 text-base">{email}</p>
            </div>

            <div className="organization relative flex items-center justify-start">
              <h2 className="  mr-2 font-semibold">Organization-</h2>
              {isEditingOrganization ? (
                <textarea
                  name="organizatoin"
                  value={organization}
                  onChange={handleInputChange}
                  className="w-fit border py-0 h-8 px-2 rounded"
                />
              ) : (
                <p className="text-gray-700">{organization}</p>
              )}
              <button
                onClick={
                  isEditingOrganization
                    ? updateOrganization
                    : () => setIsEditingOrganization(true)
                }
                className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black  rounded-md"
              >
                {isEditingAbout ? (
                  <span>Save</span>
                ) : (
                  <FiEdit className="text-black" />
                )}
              </button>
            </div>
          </div>
          <div className="Skills  p-2  ">
            <div className="SkillsSection relative mt-6">
              <h1 className="text-lg font-semibold">Skills</h1>
              <div className="skills  flex items-center justify-start">
                {isEditingSkills ? (
                  <>
                    <textarea
                      name="skills"
                      value={newSkill}
                      onChange={handleInputChange}
                      className="w-fit border py-0 h-8 px-2 rounded"
                      placeholder="Enter skills separated by commas"
                    />
                    <button
                      onClick={handleAddSkills}
                      className="ml-2 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                    >
                      Add
                    </button>
                  </>
                ) : (
                  <p className="text-gray-700">
                    {skills.length === 0 ? "No skills added" : ""}
                  </p>
                )}
                <button
                  onClick={
                    isEditingSkills
                      ? updateSkills
                      : () => setIsEditingSkills(true)
                  }
                  className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                >
                  {isEditingSkills ? (
                    <span>Save</span>
                  ) : (
                    <FiEdit className="text-black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-sm py-1 px-3 rounded inline-flex items-center"
                >
                  {skill.skillName}
                  {isEditingSkills && (
                    <button
                      onClick={() => removeSkill(skill.skillName)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="Education p-2 mt-4  ">
            <div className="EducationSection relative mt-6">
              <h1 className="text-lg font-semibold">Education</h1>
              <div className="education flex items-center justify-start">
                {isEditingEducation ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      name="institution"
                      value={newEducation.institution}
                      onChange={(e) => {
                        handleEducationInputChange(
                          "institution",
                          e.target.value
                        );
                      }}
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      name="degree"
                      value={newEducation.degree}
                      onChange={(e) =>
                        handleEducationInputChange("degree", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={newEducation.fieldOfStudy}
                      onChange={(e) =>
                        handleEducationInputChange(
                          "fieldOfStudy",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Field of Study"
                    />
                    <input
                      type="date"
                      name="startDate"
                      value={newEducation.startDate}
                      onChange={(e) =>
                        handleEducationInputChange("startDate", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={newEducation.endDate}
                      onChange={(e) =>
                        handleEducationInputChange("endDate", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="End Date (optional)"
                    />
                    <input
                      type="text"
                      name="grade"
                      value={newEducation.grade}
                      onChange={(e) =>
                        handleEducationInputChange("grade", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Grade (optional)"
                    />
                    <button
                      onClick={handleAddEducation}
                      className="mt-2 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    {education.length === 0 ? "No education added" : ""}
                  </p>
                )}
                <button
                  onClick={
                    isEditingEducation
                      ? updateEducation
                      : () => setIsEditingEducation(true)
                  }
                  className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                >
                  {isEditingEducation ? (
                    <span>Save</span>
                  ) : (
                    <FiEdit className="text-black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-sm py-2 px-4 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{edu.institution}</p>
                    <p>
                      {edu.degree} in {edu.fieldOfStudy}
                    </p>
                    <p>
                      {edu.startDate} - {edu.endDate || "Present"}
                    </p>
                    {edu.grade && <p>Grade: {edu.grade}</p>}
                  </div>
                  {isEditingEducation && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="Experience p-2 mt-4  ">
            <div className="ExperienceSection relative mt-6">
              <h1 className="text-lg font-semibold">Experience</h1>
              <div className="experience flex items-center justify-start">
                {isEditingExperience ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={newExperience.title}
                      onChange={(e) =>
                        handleExperienceInputChange("title", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      name="company"
                      value={newExperience.company}
                      onChange={(e) =>
                        handleExperienceInputChange("company", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      name="location"
                      value={newExperience.location}
                      onChange={(e) =>
                        handleExperienceInputChange("location", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Location (optional)"
                    />
                    <textarea
                      name="description"
                      value={newExperience.description}
                      onChange={(e) =>
                        handleExperienceInputChange(
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Description (optional)"
                    ></textarea>
                    <button
                      onClick={handleAddExperience}
                      className="mt-2 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    {experience.length === 0 ? "No experience added" : ""}
                  </p>
                )}
                <button
                  onClick={
                    isEditingExperience
                      ? updateExperience
                      : () => setIsEditingExperience(true)
                  }
                  className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                >
                  {isEditingExperience ? (
                    <span>Save</span>
                  ) : (
                    <FiEdit className="text-black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-sm py-2 px-4 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{exp.title}</p>
                    <p>{exp.company}</p>
                    <p>{exp.location || "Location not specified"}</p>
                    {exp.description && <p>{exp.description}</p>}
                  </div>
                  {isEditingExperience && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="CertificationsAndLicenses p-2 mt-4  ">
            <div className="CertificationsSection relative mt-6">
              <h1 className="text-lg font-semibold">
                Certifications & Licenses
              </h1>
              <div className="certifications flex items-center justify-start">
                {isEditingCertificationsAndLicenses ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      name="name"
                      value={newCertificationsAndLicenses.name}
                      onChange={(e) =>
                        handleCertificationsInputChange("name", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Certification Name"
                    />
                    <input
                      type="text"
                      name="issuingOrganization"
                      value={newCertificationsAndLicenses.issuingOrganization}
                      onChange={(e) =>
                        handleCertificationsInputChange(
                          "issuingOrganization",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Issuing Organization"
                    />
                    <input
                      type="date"
                      name="issueDate"
                      value={newCertificationsAndLicenses.issueDate}
                      onChange={(e) =>
                        handleCertificationsInputChange(
                          "issueDate",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                    />
                    <input
                      type="date"
                      name="expiryDate"
                      value={newCertificationsAndLicenses.expiryDate}
                      onChange={(e) =>
                        handleCertificationsInputChange(
                          "expiryDate",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Expiry Date (optional)"
                    />
                    <input
                      type="text"
                      name="credentialId"
                      value={newCertificationsAndLicenses.credentialId}
                      onChange={(e) =>
                        handleCertificationsInputChange(
                          "credentialId",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Credential ID (optional)"
                    />
                    <input
                      type="text"
                      name="credentialUrl"
                      value={newCertificationsAndLicenses.credentialUrl}
                      onChange={(e) =>
                        handleCertificationsInputChange(
                          "credentialUrl",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Credential URL (optional)"
                    />
                    <button
                      onClick={handleAddCertification}
                      className="mt-2 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    {certificationsAndLicenses.length === 0
                      ? "No certifications added"
                      : ""}
                  </p>
                )}
                <button
                  onClick={
                    isEditingCertificationsAndLicenses
                      ? updateCertifications
                      : () => setIsEditingCertificationsAndLicenses(true)
                  }
                  className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                >
                  {isEditingCertificationsAndLicenses ? (
                    <span>Save</span>
                  ) : (
                    <FiEdit className="text-black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4">
              {certificationsAndLicenses.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-sm py-2 px-4 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{cert.name}</p>
                    <p>{cert.issuingOrganization}</p>
                    <p>
                      {cert.issueDate} - {cert.expiryDate || "No Expiry"}
                    </p>
                    {cert.credentialId && <p>ID: {cert.credentialId}</p>}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                  {isEditingCertificationsAndLicenses && (
                    <button
                      onClick={() => removeCertification(index)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="PublicationsAndResearch p-2 mt-4  ">
            <div className="PublicationsSection relative mt-6">
              <h1 className="text-lg font-semibold">Publications & Research</h1>
              <div className="publications flex items-center justify-start">
                {isEditingPublicationsAndResearch ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={newPublicationsAndResearch.title}
                      onChange={(e) =>
                        handlePublicationsInputChange("title", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Title"
                    />
                    <input
                      type="date"
                      name="publicationDate"
                      value={newPublicationsAndResearch.publicationDate}
                      onChange={(e) =>
                        handlePublicationsInputChange(
                          "publicationDate",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                    />
                    <input
                      type="text"
                      name="publisher"
                      value={newPublicationsAndResearch.publisher}
                      onChange={(e) =>
                        handlePublicationsInputChange(
                          "publisher",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Publisher (optional)"
                    />
                    <textarea
                      name="description"
                      value={newPublicationsAndResearch.description}
                      onChange={(e) =>
                        handlePublicationsInputChange(
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Description (optional)"
                    />
                    <input
                      type="text"
                      name="link"
                      value={newPublicationsAndResearch.link}
                      onChange={(e) =>
                        handlePublicationsInputChange("link", e.target.value)
                      }
                      className="w-full border py-1 px-2 rounded"
                      placeholder="Link (optional)"
                    />
                    <button
                      onClick={handleAddPublication}
                      className="mt-2 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    {publicationsAndResearch.length === 0
                      ? "No publications added"
                      : ""}
                  </p>
                )}
                <button
                  onClick={
                    isEditingPublicationsAndResearch
                      ? updatePublications
                      : () => setIsEditingPublicationsAndResearch(true)
                  }
                  className="absolute top-0 right-0 bg-gray-50 px-2 text-sm py-1 text-black rounded-md"
                >
                  {isEditingPublicationsAndResearch ? (
                    <span>Save</span>
                  ) : (
                    <FiEdit className="text-black" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4">
              {publicationsAndResearch.map((publication, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-sm py-2 px-4 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{publication.title}</p>
                    <p>Published on: {publication.publicationDate}</p>
                    {publication.publisher && (
                      <p>Publisher: {publication.publisher}</p>
                    )}
                    {publication.description && (
                      <p>{publication.description}</p>
                    )}
                    {publication.link && (
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Publication
                      </a>
                    )}
                  </div>
                  {isEditingPublicationsAndResearch && (
                    <button
                      onClick={() => removePublication(index)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
