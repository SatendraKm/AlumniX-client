import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateStory from "../InspiringStory/CreateStory";
import CreateJob from "../Job/CreateJob";
import CreateEvent from "../Event/CreateEvent";
// import CreateResources from "../AlmaResource/CreateResource";
import CreateVolunteer from "../Volunteer/CreateVolunteer";
import CreatePost from "./CreatePost";
import CreateReunion from "../Reunion/CreateReunion";
import Cookies from "js-cookie";

const PostPopup = ({ setPopupOpen }) => {
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  //const [showCreateResource, setShowCreateResource] = useState(false);
  const [showCreateVolunteer, setShowCreateVolunteer] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateReunion, setShowCreateReunion] = useState(false);

  const navigate = useNavigate();
  const role = Cookies.get("role");

  const handleStoryClick = () => setShowCreateStory(true);
  const handleJobClick = () => setShowCreateJob(true);
  const handleEventClick = () => setShowCreateEvent(true);

  const handleVolunteerClick = () => setShowCreateVolunteer(true);
  const handlePostClick = () => setShowCreatePost(true);
  const handleReunionClick = () => setShowCreateReunion(true);

  const handleProjectClick = () => {
    setPopupOpen(false);
    navigate("/dashboard/project/create-project");
  };
  const handleResourceClick = () => {
    setPopupOpen(false);
    navigate("/dashboard/alumni-resources");
  };

  const postOptions = [
    { label: "Post", visibility: "Anyone can view", onClick: handlePostClick },
    {
      label: "Project",
      visibility: "Followed People can view",
      onClick: handleProjectClick,
    },
    {
      label: "Event",
      visibility: "Anyone can view",
      onClick: handleEventClick,
    },
    {
      label: "Story",
      visibility: "Anyone can view",
      onClick: handleStoryClick,
    },
    ...(role === "alumni" || role === "faculty"
      ? [
          {
            label: "Job",
            visibility: "Anyone can view",
            onClick: handleJobClick,
          },
        ]
      : []),
    {
      label: "Volunteering",
      visibility: "Anyone can view",
      onClick: handleVolunteerClick,
    },
    ...(role === "alumni" || role === "faculty"
      ? [
          {
            label: "Alma Resources",
            visibility: "Anyone can view",
            onClick: handleResourceClick,
          },
        ]
      : []),
    ...(role === "alumni" || role === "faculty"
      ? [
          {
            label: "Reunion",
            visibility: "Anyone can view",
            onClick: handleReunionClick,
          },
        ]
      : []),
  ];

  return (
    <>
      {!showCreateStory &&
      !showCreateJob &&
      !showCreateEvent &&
      // !showCreateResource &&
      !showCreateVolunteer &&
      !showCreatePost &&
      !showCreateReunion ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-[500px]">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                What do you want to Post?
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => setPopupOpen(false)}
              >
                &times;
              </button>
            </div>
            {/* Options */}
            <div className="p-6 space-y-4">
              {postOptions.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex items-center justify-between w-full border px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg">
                      🌟
                    </div>
                    <span className="text-base font-medium text-gray-800">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.visibility}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : showCreateStory ? (
        <CreateStory onClose={() => setShowCreateStory(false)} />
      ) : showCreateJob ? (
        <CreateJob onClose={() => setShowCreateJob(false)} />
      ) : showCreateEvent ? (
        <CreateEvent onClose={() => setShowCreateEvent(false)} />
      ) : // ) : showCreateResource ? (
      //   <CreateResources onClose={() => setShowCreateResource(false)} />
      showCreateVolunteer ? (
        <CreateVolunteer onClose={() => setShowCreateVolunteer(false)} />
      ) : showCreatePost ? (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      ) : (
        <CreateReunion onClose={() => setShowCreateReunion(false)} />
      )}
    </>
  );
};

export default PostPopup;
