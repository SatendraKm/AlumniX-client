import { useState } from "react";
import CreateReunion from "./CreateReunion";
// import memories from "./memories";
import { Link } from "react-router-dom";
import ReunionContent from "./ReunionContent";
import RightSidebar from "./RightSideBar";

const Reunion = () => {
  const [isCreateReunionOpen, setIsCreateReunionOpen] = useState(false);

  const handleOpenCreateReunion = () => setIsCreateReunionOpen(true);
  const handleCloseCreateReunion = () => setIsCreateReunionOpen(false);

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reunion</h1>
        <div className="space-x-4">
          <button
            onClick={handleOpenCreateReunion}
            className="px-4 py-2 text-black border border-black rounded-full hover:bg-black hover:text-white"
          >
            Create Reunion
          </button>
          <Link to={"memories"}>
            <button className="px-4 py-2 text-black border border-black rounded-md hover:bg-black hover:text-white">
              Memories
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <ReunionContent />
        </div>
        {/* Right Sidebar */}
        <div>
          <RightSidebar />
        </div>
      </div>
      {/* Create Reunion Popup */}
      {isCreateReunionOpen && (
        <CreateReunion onClose={handleCloseCreateReunion} />
      )}
    </div>
  );
};

export default Reunion;
