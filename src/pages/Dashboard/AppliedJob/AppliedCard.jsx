import arrowBlockUp from "../../../assets/icons/arrow-block-up.svg";
import arrowBlockdown from "../../../assets/icons/arrow-block-down.svg";

const AppliedCard = ({ job, creatorName }) => {
  const {
    title = "Job Title",
    company = "Unknown Company",
    location = "Unknown Location",
    description = "No description available.",
    jobphoto,
    skills = [],
    type = "Full-time",
    stipendOrSalary = "Not specified",
    applyLink,
    postedDate,
    likes = [],
    dislikes = [],
  } = job;

  return (
    <div className="w-full max-w-[340px] border rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2">
      {/* Job Image */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={jobphoto || `${import.meta.env.VITE_VIA_PLACEHOLDER_IMAGE}/150`}
          alt={title}
          className="w-full h-[180px] object-cover"
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
          <a href="#" className="text-blue-600 font-medium hover:underline ml-1">
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
          Posted By: <span className="text-gray-800 font-semibold">{creatorName}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Posted On:{" "}
          <span className="text-gray-800 font-medium">
            {postedDate ? new Date(postedDate).toLocaleDateString() : "Unknown"}
          </span>
        </p>

        {/* Apply Link */}
        <p className="text-xs text-gray-500 mt-2">
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-medium hover:underline"
          >
            Apply Through Link
          </a>
        </p>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 flex justify-between items-center">
        {/* Left Icons */}
        <div className="flex gap-4">
          {/* Like Button */}
          <button
            disabled
            className="flex items-center gap-2 text-gray-400"
          >
            <img src={arrowBlockUp} alt="Upvote" className="w-6 h-6" />
            <span>{likes.length}</span>
          </button>

          {/* Dislike Button */}
          <button
            disabled
            className="flex items-center gap-2 text-gray-400"
          >
            <img src={arrowBlockdown} alt="Downvote" className="w-6 h-6" />
            <span>{dislikes.length}</span>
          </button>
        </div>

        {/* Applied Button */}
        <button
          className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-green-600 cursor-not-allowed"
          disabled
        >
          Applied
        </button>
      </div>
    </div>
  );
};

export default AppliedCard;
