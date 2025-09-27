import FundsCard from "./FundsCard";
import axiosInstance from "../../../utils/axiosinstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// const fundData = [
//   {
//     _id: "1",
//     title: "Scholarship Fund",
//     description:
//       "Supporting students in need through scholarships is our mission. We aim to provide financial assistance to deserving students who excel in academics but lack the necessary resources. Your donation helps build a brighter future for these students..",
//     goalAmount: 5000,
//     fundImage: "https://via.placeholder.com/150",
//   },
//   {
//     _id: "2",
//     title: "Library Upgrade",
//     description:
//       "Supporting students in need through scholarships is our mission. We aim to provide financial assistance to deserving students who excel in academics but lack the necessary resources. Your donation helps build a brighter future for these students.",
//     goalAmount: 10000,
//     fundImage: "https://via.placeholder.com/150",
//   },
//   {
//     _id: "3",
//     title: "Sports Equipment Fund",
//     description:
//       "Supporting students in need through scholarships is our mission. We aim to provide financial assistance to deserving students who excel in academics but lack the necessary resources. Your donation helps build a brighter future for these students.",
//     goalAmount: 3000,
//     fundImage: "https://via.placeholder.com/150",
//   },
// ];

const DonationContent = () => {
  const [funds, setFunds] = useState([]);
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
    navigate(`/dashboard/Funds/${fundId}`);
    console.log(`Donating to fund with ID: ${fundId}`);
    // Implement your donation logic here
  };

  const handleEditFund = (fundId) => {
    console.log(`Editing fund with ID: ${fundId}`);
    // Implement your edit fund logic here
  };

  return (
    <div className="flex flex-wrap gap-8 h-[calc(115vh-225px)] overflow-y-auto hide-scrollbar">
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
