import { useState } from "react";
import CreateJob from "./CreateJob";
import Cookies from "js-cookie";

const RightSidebar = () => {
  const role = Cookies.get("role");
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);

  const handleOpenCreateJob = () => {
    setIsCreateJobOpen(true);
  };

  const handleCloseCreateJob = () => {
    setIsCreateJobOpen(false);
  };

  return (
    <div className="w-full p-4 space-y-2 bg-white">
      {/* Create Job Button. */}
      <div className="flex justify-center">
      {(role === "alumni" || role === "faculty") && (
        <button
          onClick={handleOpenCreateJob}
          className="px-4 py-2 text-black border border-black rounded-full hover:bg-black hover:text-white"
        >
          Create Job
        </button>
        )}
      </div>

      {/* Create Job Popup */}
      {isCreateJobOpen && <CreateJob onClose={handleCloseCreateJob} />}
    </div>
  );
};

export default RightSidebar;
