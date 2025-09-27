import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import axiosInstance from "../../../utils/axiosinstance";
import Cookies from "js-cookie";

const ProjectList = ({ activeTab }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesFetched, setRolesFetched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [userSkills, setUserSkills] = useState([]);
  const currentUserId = Cookies.get("id");

  // Fetch the current user's skills when currentUserId is set
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!currentUserId) return;

      try {
        const response = await axiosInstance.get(`/users/${currentUserId}`);

        if (response.data.success) {
          const skills = response.data.data.skills.map(
            (skill) => skill.skillName
          );
          setUserSkills(skills);
        }
      } catch (error) {
        console.error("Error fetching user skills:", error);
      }
    };

    fetchUserSkills();
  }, [currentUserId]);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("/project/all");
        if (response.data.success) {
          setProjects(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch roles dynamically for each project's creator (existing functionality)
  useEffect(() => {
    const fetchRolesForProjects = async () => {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          if (project.createdBy && !project.createdBy.role) {
            try {
              const response = await axiosInstance.get(
                `/users/${project.createdBy._id}`
              );
              console.log(response);
              return {
                ...project,
                createdBy: {
                  ...project.createdBy,
                  role: response.data.data.role,
                },
              };
            } catch (error) {
              console.error(
                `Failed to fetch role for project ${project._id}:`,
                error
              );
              return project;
            }
          }
          return project;
        })
      );
      setProjects(updatedProjects);
      setRolesFetched(true);
    };

    if (projects.length && !rolesFetched) {
      fetchRolesForProjects();
    }
  }, [projects, rolesFetched]);

  // Filtering logic based on activeTab and selectedFilter
  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "All") return true;

    if (selectedFilter.startsWith("Tech")) {
      const projectTechnologies = project.technologies || [];
      return projectTechnologies.some((tech) => userSkills.includes(tech));
    }

    return false;
  });

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (!filteredProjects.length) {
    return <div>No projects found for this filter.</div>;
  }

  return (
    <div>
      <div className="flex max-md:flex-col p-2">
        {/* Tabs and filter buttons */}
        <div className="ml-8 flex flex-col w-[95%] max-md:ml-0 max-md:w-full">
          {/* Filter options */}
          <div className="flex gap-3">
            <button
              className={`${
                selectedFilter === "All"
                  ? "bg-[#252525] text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-[#252525] hover:text-white"
              } px-4 py-1 rounded-lg transition-colors duration-300`}
              onClick={() => handleFilterChange("All")}
            >
              For You
            </button>

            {userSkills.map((skill, index) => (
              <button
                key={index}
                className={`${
                  selectedFilter === `Tech${index + 1}`
                    ? "bg-[#252525] text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-[#252525] hover:text-white"
                } px-4 py-1 rounded-lg transition-colors duration-300`}
                onClick={() => handleFilterChange(`Tech${index + 1}`)}
              >
                {skill}
              </button>
            ))}
          </div>

          <h2 className="mt-0 text-2xl font-bold tracking-wide leading-none p-2">
            Projects
          </h2>

          <div className="flex flex-col self-stretch h-[calc(100vh-225px)] overflow-y-auto hide-scrollbar mt-3.5 w-full max-md:max-w-full">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
