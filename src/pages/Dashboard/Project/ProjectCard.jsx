import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const {
    createdBy,
    projectTopic: title,
    description,
    projectPhoto: image,
    _id,
    mentorContributors,
    studentContributors,
  } = project;
  // console.log(project);

  const [creatorName, setCreatorName] = useState("Loading...");

  useEffect(() => {
    if (createdBy?.firstName && createdBy?.lastName) {
      setCreatorName(`${createdBy.firstName} ${createdBy.lastName}`);
    } else if (createdBy) {
      const fetchCreatorDetails = async () => {
        try {
          const response = await axiosInstance.get(`/users/${createdBy}`);
          console.log(response);
          if (response.data?.success) {
            const { firstName, lastName } = response.data.data;
            setCreatorName(`${firstName} ${lastName}`);
          } else {
            setCreatorName("Unknown");
          }
        } catch (error) {
          console.error("Error fetching creator details:", error);
          setCreatorName("Error fetching user");
        }
      };
      fetchCreatorDetails();
    }
  }, [createdBy]);

  const handleNavigate = () => navigate(`/dashboard/project/${_id}`);

  return (
    <div>
      <div
        className="relative border p-5 m-3 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 cursor-pointer"
        onClick={handleNavigate}
      >
        {/* Request Button */}
        <button className="absolute top-4 right-4 px-3 py-1 text-sm text-gray-600 font-semibold bg-gray-100 rounded-full shadow-md hover:bg-black hover:text-white transition-colors">
          Request
        </button>

        {/* Image and Content */}
        <div className="flex items-center">
          <div>
            <img
              src={image || "https://via.placeholder.com/150"}
              alt={`Image for project: ${title || "Project"}`}
              className="h-20 w-32 object-contain rounded-3xl border-2 border-blue-500 shadow-sm"
            />
            <h2 className="text-center text-xs mt-2 text-gray-600">
              +{mentorContributors.length + studentContributors.length}{" "}
              contributor
            </h2>
          </div>
          <div className="flex flex-col ml-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {title || "Project Title"}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {description?.length > 100
                ? `${description.slice(0, 100)}...`
                : description || "Description not available."}
              <a href="#" className="text-blue-500 font-medium">
                {" "}
                Read More
              </a>
            </p>
          </div>
        </div>

        {/* Created By */}
        <div className="absolute bottom-4 right-4">
          <p className="text-sm text-gray-500">
            Created By -{" "}
            <span className="font-semibold text-gray-800">{creatorName}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
