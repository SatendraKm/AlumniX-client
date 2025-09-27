import VolunteerContent from "./VolunteerContent";
import RightSidebar from "./RightSideBar";

const Volunteer = () => {
  return (
    <div className="flex w-full bg-white">
      <div className=" w-[90%] p-2 ">
        <VolunteerContent />
      </div>
      <div className="w-[20%] p-2">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Volunteer;
