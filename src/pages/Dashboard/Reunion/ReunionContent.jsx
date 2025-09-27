import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import ReunionCard from "./ReunionCard";

// ReunionContent Component
const ReunionContent = () => {
  const [reunions, setReunions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reunions from the API
  useEffect(() => {
    const fetchReunions = async () => {
      try {
        const response = await axiosInstance.get("/reunions/get-all-reunions");
        if (response.data.success) {
          setReunions(response.data.data || []);
        } else {
          console.error("Error fetching reunions:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching reunions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReunions();
  }, []);

  if (loading) {
    return <p>Loading reunions...</p>;
  }

  if (!reunions.length) {
    return <p>No reunions found.</p>;
  }

  return (
    <div>
      {/* Reunion Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border-gray-200">
        {reunions.map((reunion) => (
          <ReunionCard key={reunion._id} reunion={reunion} />
        ))}
      </div>

      {/* Previous Reunion Videos Section */}
      <h2 className="text-xl font-bold mb-4">Previous Reunion Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Placeholder for videos */}
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">Video 1</div>
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">Video 2</div>
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">Video 3</div>
      </div>
    </div>
  );
};

export default ReunionContent;
