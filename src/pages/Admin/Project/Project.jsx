import { useState } from "react";
import ProjectList from "./ProjectList";
import PopularProjectCard from "./PopularProjectCard";
import { Link } from "react-router-dom";

const Project = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const tabs = ["All", "Faculty", "Alumni", "Student"];

  const TabBar = () => (
    <div className="flex border border-gray-300 justify-between w-7/12 bg-white rounded-2xl shadow-lg px-4 mx-16 py-1 mt-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`text-sm px-4 py-2 rounded-full font-semibold ${
            selectedTab === tab ? "text-black font-bold" : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <TabBar />
        <Link to={"create-project"}>
          <div className="px-6 py-2 mr-4 mt-4 text-black border border-black rounded-full hover:bg-black hover:text-white flex-between">
            Create Project
          </div>
        </Link>
      </div>
      <div className="flex justify-center">
        {/* Main Content */}
        <div className="ml-8 p-3 w-[65%]">
          <ProjectList selectedTab={selectedTab} />
        </div>

        {/* Sidebar: Popular Projects */}
        <div className="p-3 flex w-[35%]">
          <PopularProjectCard />
        </div>
      </div>
    </div>
  );
};

export default Project;
