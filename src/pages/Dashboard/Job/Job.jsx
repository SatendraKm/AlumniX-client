import JobContent from "./JobContent";
import RightSidebar from "./RightSideBar";
const Home = () => {
  return (
    <div className="flex w-full bg-white">
      {/* Main Content Here */}
      <div className="w-[80%] p-2">
        <JobContent />
      </div>
      <div className="w-[20%] p-2">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
