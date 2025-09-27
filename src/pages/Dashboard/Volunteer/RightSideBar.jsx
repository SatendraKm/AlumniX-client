import { useState } from "react";
import CreateVolunteer from "./CreateVolunteer";

const RightSidebar = () => {
  const [isCreateVolunteerOpen, setIsCreateVolunteerOpen] = useState(false);

  const handleOpenCreateVolunteer = () => {
    setIsCreateVolunteerOpen(true);
  };

  const handleCloseCreateVolunteer = () => {
    setIsCreateVolunteerOpen(false);
  };

  return (
    <div className="w-full p-4 space-y-2 bg-white">
      {/* Popup for CreateVolunteer */}
      {isCreateVolunteerOpen && (
        <CreateVolunteer onClose={handleCloseCreateVolunteer} />
      )}
    </div>
  );
};

export default RightSidebar;
