import axiosInstance from "../../../utils/axiosinstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FundsCard from "./FundsCard";
import Cookies from "js-cookie";

const DonationContent = () => {
  const [funds, setFunds] = useState([]); // Manage funds state
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/funding/get-all-funds");
        console.log(response.data.funds);
        if (response.data.success === true) {
          setFunds(response.data.funds);
        } else {
          console.error("Error fetching funding data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching funding data:", error);
      }
    };

    fetchData(); // Fetch data on component mount
  }, []); // Empty dependency array to fetch data only once

  const handleDonate = (fundId) => {
    navigate(`/admin-dashboard/Funds/${fundId}`);
    console.log(`Donating to fund with ID: ${fundId}`);
    // Implement your donation logic here
  };

  const handleEditFund = (fundId) => {
    console.log(`Editing fund with ID: ${fundId}`);
    // Implement your edit fund logic here
  };

  return (
    <div className=" flex flex-wrap gap-6 h-[calc(115vh-225px)] overflow-y-auto hide-scrollbar">
      {/* Conditionally render Cards only if funds are available */}
      {funds.length > 0 &&
        funds.map((fund) => (
          <FundsCard
            key={funds._id}
            fund={fund}
            currentUserId={Cookies.get("id")}
            onDonate={handleDonate}
            onEditFund={handleEditFund}
          />
        ))}
      {/* Display a message if no funds are available */}
      {funds.length === 0 && <p>No funding data available.</p>}
    </div>
  );
};

export default DonationContent;
