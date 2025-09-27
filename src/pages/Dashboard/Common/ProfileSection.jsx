import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";

const ProfileSection = ({ userData }) => {
  const [organizationName, setOrganizationName] = useState("");
  useEffect(() => {
    const fetchOrganizationName = async () => {
      try {
        const response = await axiosInstance.get(
          `/organizations/${userData.organization}`
        );
        setOrganizationName(response.data.organization.name);
      } catch (err) {
        toast.error(err);
      }
    };

    if (userData.organization) {
      fetchOrganizationName();
    }
  }, [userData.organization]);
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="w-full h-48 bg-white">
        {userData.backgroundimageUrl && (
          <img
            alt="University background"
            className="w-full h-full object-cover"
            src={userData.backgroundimageUrl}
          />
        )}
      </div>

      {/* Organization Badge */}
      <div className="absolute top-2 inset-x-0 flex justify-center">
        <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {organizationName || "No Organization"}
        </span>
      </div>

      {/* Profile Image */}
      <div className="absolute top-10 inset-x-0 flex justify-center">
        <img
          alt={`Profile of ${userData.firstName} ${userData.lastName}`}
          className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          src={userData.profileimageUrl}
        />
      </div>

      {/* User Info */}
      <div className="  absolute top-32 inset-x-0 justify-center text-center">
        <h2 className="text-lg font-semibold text-white">
          {userData.firstName} {userData.lastName}
        </h2>
        <p className="text-sm text-white">{userData.tagLine || "BTech CSE"}</p>
      </div>
    </div>
  );
};

export default ProfileSection;
