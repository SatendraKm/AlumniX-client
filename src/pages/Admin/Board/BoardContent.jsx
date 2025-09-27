import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import React from "react";
import Cookies from "js-cookie";
import {
  FaUsers,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaCalendarCheck,
  FaSearch,
  FaDownload,
} from "react-icons/fa"; // Importing icons for tabs
import * as XLSX from "xlsx"; // Importing XLSX for Excel export

// Define API URL
const organizationId = Cookies.get("id");

const DashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState("students");
  const [studentsData, setStudentsData] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [alumniData, setAlumniData] = useState([]);
  const [facultyData, setFacultyData] = useState([]); // Assuming faculty data will be added in the future
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/organizations/dashboard/${organizationId}`
        );
        setStudentsData(response.data.data.student);
        setAlumniData(response.data.data.alumni);
        setFacultyData(response.data.data.faculty);
        setUpcomingEvents(response.data.data.upcomingEvents);
        setPastEvents(response.data.data.pastEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to safely join array values
  const safeJoin = (arr) =>
    arr && Array.isArray(arr) ? arr.join(", ") : "N/A";

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 to month to get the correct month (0-indexed)
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} at ${hours}:${minutes}`;
  };

  // Delete function
  const handleDelete = async (id, type) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (confirmation) {
        const response = await axiosInstance.delete(
          `/organizations/${type}/${id}`
        );
        if (response.status === 200) {
          alert(
            `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`
          );
          if (type === "student") {
            setStudentsData(
              studentsData.filter((student) => student._id !== id)
            );
          } else if (type === "alumni") {
            setAlumniData(alumniData.filter((alumni) => alumni._id !== id));
          } else if (type === "faculty") {
            setFacultyData(facultyData.filter((faculty) => faculty._id !== id));
          }
        } else {
          alert("Failed to delete the item.");
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Filter data based on search term
  const filterData = (data) => {
    return data.filter((item) =>
      `${item.firstName} ${item.lastName} ${item.email} ${item.phone} ${item.batch || ""} ${item.city || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  // Function to render the list based on selected tab
  const renderList = () => {
    switch (selectedTab) {
      case "students":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Phone Number
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Batch
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData(studentsData).map((student) => (
                  <tr
                    key={student._id}
                    className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-300"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <span
                        className={`bg-green-100 text-green-500 p-1 rounded-full text-xs`}
                      >
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {student.phone}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {student.batch || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {student.city || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(student._id, "student")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "alumni":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Phone Number
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Batch
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData(alumniData).map((alumni) => (
                  <tr
                    key={alumni._id}
                    className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-300"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">{`${alumni.firstName} ${alumni.lastName}`}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {alumni.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <span
                        className={`bg-green-100 text-green-500 p-1 rounded-full text-xs`}
                      >
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {alumni.phone}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {alumni.batch || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {alumni.city || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(alumni._id, "alumni")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "faculty":
        return (
          <div className="overflow-x-auto">
            {facultyData.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Phone Number
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Batch
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Location
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterData(facultyData).map((faculty) => (
                    <tr
                      key={faculty._id}
                      className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-300"
                    >
                      <td className="py-3 px-4 text-sm text-gray-800">{`${faculty.firstName} ${faculty.lastName}`}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {faculty.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        <span
                          className={`bg-green-100 text-green-500 p-1 rounded-full text-xs`}
                        >
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {faculty.phone}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {faculty.batch || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {faculty.city || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <button
                          className="text-red-500"
                          onClick={() => handleDelete(faculty._id, "faculty")}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No faculty data available.</p>
            )}
          </div>
        );
      case "pastEvents":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Event Title
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Speaker
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData(pastEvents).length > 0 ? (
                  filterData(pastEvents).map((event) => (
                    <tr
                      key={event._id}
                      className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-300"
                    >
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {event.title}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(event.date)} at {event.time}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {event.speaker}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-3 px-4 text-sm text-gray-500">
                      No past events available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case "upcomingEvents":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Event Title
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Speaker
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterData(upcomingEvents).length > 0 ? (
                  filterData(upcomingEvents).map((event) => (
                    <tr
                      key={event._id}
                      className="border-t border-gray-200 hover:bg-gray-100 transition-all duration-300"
                    >
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {event.title}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(event.date)} at {event.time}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {event.speaker}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-3 px-4 text-sm text-gray-500">
                      No upcoming events available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  // Function to handle Excel download
  const handleDownload = () => {
    const dataToDownload = {
      Students: studentsData.map((student) => ({
        Name: `${student.firstName} ${student.lastName}`,
        Email: student.email,
        Phone: student.phone,
        Batch: student.batch || "N/A",
        Location: student.city || "N/A",
      })),
      Alumni: alumniData.map((alumni) => ({
        Name: `${alumni.firstName} ${alumni.lastName}`,
        Email: alumni.email,
        Phone: alumni.phone,
        Batch: alumni.batch || "N/A",
        Location: alumni.city || "N/A",
      })),
      Faculty: facultyData.map((faculty) => ({
        Name: `${faculty.firstName} ${faculty.lastName}`,
        Email: faculty.email,
        Phone: faculty.phone,
        Batch: faculty.batch || "N/A",
        Location: faculty.city || "N/A",
      })),
      UpcomingEvents: upcomingEvents.map((event) => ({
        Title: event.title,
        Date: formatDate(event.date),
        Speaker: event.speaker,
      })),
      PastEvents: pastEvents.map((event) => ({
        Title: event.title,
        Date: formatDate(event.date),
        Speaker: event.speaker,
      })),
    };

    const wb = XLSX.utils.book_new();
    for (const [sheetName, sheetData] of Object.entries(dataToDownload)) {
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    XLSX.writeFile(wb, "organization_data.xlsx");
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center space-x-4 w-full">
        {/* Tab selection */}
        <div
          onClick={() => setSelectedTab("students")}
          className={`flex-1 p-4 cursor-pointer text-center rounded-xl transition-all duration-300 ${
            selectedTab === "students"
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl"
              : "bg-white text-gray-600 hover:shadow-lg"
          }`}
        >
          <FaUsers className="mx-auto text-2xl mb-2" />
          <h3 className="font-semibold">Students</h3>
          <p>{studentsData.length}</p>
        </div>
        <div
          onClick={() => setSelectedTab("alumni")}
          className={`flex-1 p-4 cursor-pointer text-center rounded-xl transition-all duration-300 ${
            selectedTab === "alumni"
              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-xl"
              : "bg-white text-gray-600 hover:shadow-lg"
          }`}
        >
          <FaGraduationCap className="mx-auto text-2xl mb-2" />
          <h3 className="font-semibold">Alumni</h3>
          <p>{alumniData.length}</p>
        </div>
        <div
          onClick={() => setSelectedTab("faculty")}
          className={`flex-1 p-4 cursor-pointer text-center rounded-xl transition-all duration-300 ${
            selectedTab === "faculty"
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-xl"
              : "bg-white text-gray-600 hover:shadow-lg"
          }`}
        >
          <FaChalkboardTeacher className="mx-auto text-2xl mb-2" />
          <h3 className="font-semibold">Faculty</h3>
          <p>{facultyData.length}</p>
        </div>
        <div
          onClick={() => setSelectedTab("pastEvents")}
          className={`flex-1 p-4 cursor-pointer text-center rounded-xl transition-all duration-300 ${
            selectedTab === "pastEvents"
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl"
              : "bg-white text-gray-600 hover:shadow-lg"
          }`}
        >
          <FaCalendarCheck className="mx-auto text-2xl mb-2" />
          <h3 className="font-semibold">Past Event</h3>
          <p>{pastEvents.length}</p>
        </div>
        <div
          onClick={() => setSelectedTab("upcomingEvents")}
          className={`flex-1 p-4 cursor-pointer text-center rounded-xl transition-all duration-300 ${
            selectedTab === "upcomingEvents"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
              : "bg-white text-gray-600 hover:shadow-lg"
          }`}
        >
          <FaCalendarAlt className="mx-auto text-2xl mb-2" />
          <h3 className="font-semibold">Upcoming Event</h3>
          <p>{upcomingEvents.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-1/4 mt-4">
        <input
          type="text"
          className="py-2 px-4 pl-10 w-full rounded-lg border border-gray-300"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-xl text-gray-500">Loading...</span>
        </div>
      ) : (
        <div className="mt-6">{renderList()}</div>
      )}

      {/* Download Button */}
      <div
        onClick={handleDownload}
        className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-xl hover:bg-blue-600 transition-all duration-300"
      >
        <FaDownload className="text-2xl" />
      </div>
    </div>
  );
};

export default DashboardPage;
