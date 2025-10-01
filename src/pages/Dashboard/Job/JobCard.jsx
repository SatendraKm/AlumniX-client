import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import bookmark from "../../../assets/icons/bookmark.svg";
import bookmarked from "../../../assets/icons/bookmarked.svg";
import arrowBlockUp from "../../../assets/icons/arrow-block-up.svg";
import arrowBlockdown from "../../../assets/icons/arrow-block-down.svg";

const JobCard = ({
  job,
  currentUserId,
  onLikePost,
  onDislikePost,
  onBookmarkJob,
  onApplyJob,
  // bookmarks,
}) => {
  const {
    _id,
    title = "Job Title",
    company = "Unknown Company",
    location = "Unknown Location",
    description = "No description available.",
    jobphoto,
    skills = [],
    type = "Full-time",
    stipendOrSalary = "Not specified",
    applyLink,
    createdBy = {},
    postedDate,
    likes = [],
    dislikes = [],
    isApplied = false,
  } = job;

  const [applied, setApplied] = useState(isApplied);
  const [creatorName, setCreatorName] = useState("Loading...");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isLiked = likes.includes(currentUserId);
  const isDisliked = dislikes.includes(currentUserId);

  useEffect(() => {
    const savedApplied = localStorage.getItem('applied');
    if (savedApplied === 'true') {
      setApplied(true);
    }
  }, []);
  

  useEffect(() => {
    if (createdBy?.firstName && createdBy?.lastName) {
      setCreatorName(`${createdBy.firstName} ${createdBy.lastName}`);
    } else if (createdBy?._id) {
      const fetchCreatorName = async () => {
        try {
          const response = await axiosInstance.get(`/users/${createdBy._id}`);
          setCreatorName(
            `${response.data.firstName} ${response.data.lastName}`
          );
        } catch (error) {
          console.error("Error fetching creator name:", error);
        }
      };
      fetchCreatorName();
    }
  }, [createdBy]);

  // useEffect(() => {
  //   setIsBookmarked(bookmarks.includes(_id));
  // }, [bookmarks, _id]);

  const handleApply = () => {
    setApplied(true);
    localStorage.setItem('applied', 'true');
  };

  return (
    <div className="w-full max-w-[340px] border rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2">
      {/* Job Image */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={jobphoto || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/150`}
          alt={title}
          className="w-full h-[180px] object-contain"
        />
      </div>

      {/* Job Details */}
      <div className="mt-4">
        <h4 className="text-lg font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {company} • <span className="text-blue-500">{location}</span>
        </p>
        <p className="text-sm text-gray-700 mt-3">
          {description.length > 120
            ? `${description.slice(0, 120)}...`
            : description}
          <a
            href="#"
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Read More
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-3">
          Skills:{" "}
          <span className="text-gray-700 font-medium">
            {skills.length > 0 ? skills.join(", ") : "Not specified"}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Type: <span className="text-red-500">{type}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Salary/Stipend:{" "}
          <span className="text-green-600 font-medium">{stipendOrSalary}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Posted By:{" "}
          <span className="text-gray-800 font-semibold">{creatorName}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Posted On:{" "}
          <span className="text-gray-800 font-medium">
            {postedDate ? new Date(postedDate).toLocaleDateString() : "Unknown"}
          </span>
        </p>
      </div>

      {/* Apply Through Link */}
      <div className="mt-4">
        {applyLink && (
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Apply Through Link
          </a>
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-4">
          {/* Bookmark Button */}
          <button
            onClick={() => onBookmarkJob(_id)}
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-200 transition"
          >
            <img
              src={isBookmarked ? bookmarked : bookmark}
              alt="bookmark"
              className="w-6 h-6"
            />
          </button>

          {/* Like Button */}
          <button
            onClick={() => onLikePost(_id)}
            className={`flex items-center gap-2 ${isLiked ? "text-blue-500" : "text-gray-600"} hover:text-blue-600 transition`}
          >
            <img src={arrowBlockUp} alt="like" className="w-6 h-6" />
            <span className="font-semibold">{likes.length}</span>
          </button>

          {/* Dislike Button */}
          <button
            onClick={() => onDislikePost(_id)}
            className={`flex items-center gap-2 ${isDisliked ? "text-blue-500" : "text-gray-600"} hover:text-blue-600 transition`}
          >
            <img src={arrowBlockdown} alt="dislike" className="w-6 h-6" />
            <span className="font-semibold">{dislikes.length}</span>
          </button>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className={`px-5 py-2 text-white rounded-xl ${
            applied ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
          disabled={applied}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
