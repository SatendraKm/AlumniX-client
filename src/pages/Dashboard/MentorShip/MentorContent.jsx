import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import pic from "../../../assets/images/image.png";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";

const MentorContent = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    groupProfileImage: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("chat-app-current-user"));
        if (storedUser && storedUser._id) {
          const response = await axiosInstance.get(`/users/${storedUser._id}`);
          const userData = response.data.data;
          setIsMentor(userData.isMentor);
        } else {
          toast.error("No current user found in local storage.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center py-12">
      <div className="max-w-5xl w-full px-6 md:px-12 text-center">
        <h2 className="text-5xl font-extrabold mb-6 text-gray-800">
          Get Trained For The Future, <span className="text-blue-600">Today</span>
        </h2>
        <p className="text-gray-600 mb-8">
          Career Karma gives you the information, tools, and support to figure out the skills you need today that will get you the job you want in the future.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("find-group")}
          >
            Find a Mentor Group/
          </button>
          {isMentor && (
            <button
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
              onClick={() => setShowModal(true)}
            >
              Create Group
            </button>
          )}
        </div>

        {/* Mentfdfsdfor Profile Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img src={pic} alt="Mentor" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Jordan Jackson</h3>
            <p className="text-gray-500">Software Engineer at Twitter</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img src={pic} alt="Mentor" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold">K. Rose Lake</h3>
            <p className="text-gray-500">Software Engineer at Stitch Fix</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img src={pic} alt="Mentor" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Iyanna Admasu</h3>
            <p className="text-gray-500">UI Developer at JPMorgan Chase & Co</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img src={pic} alt="Mentor" className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Kahaan Patel</h3>
            <p className="text-gray-500">Software Engineer at Tesla</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorContent;
