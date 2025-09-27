import { useState } from "react";
import { useNavigate } from "react-router-dom";
import editIcon from "../../../assets/icons/edit.svg";
import { toast } from "react-toastify";

const FundCard = ({ fund, currentUserId, onDonate, onEditFund }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/dashboard/fund/about-fund`, {
      state: { ...fund },
    });
  };

  const handleEditFund = (e) => {
    e.stopPropagation();
    onEditFund(fund._id);
  };

  const handleDonate = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      await onDonate(fund._id);
      toast.success("Donation successful!");
    } catch (error) {
      console.error("Error during donation:", error);
      toast.error("An error occurred during donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[280px] border rounded-2xl shadow-lg bg-gradient-to-br from-white to-blue-50 p-4 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2">
      {/* Fund Image */}
      <div className="relative rounded-md overflow-hidden">
        <img
          src={fund.fundImage}
          alt={fund.title}
          className="w-full h-[160px] object-cover rounded-md transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Fund Details */}
      <div className="h-full mt-3 flex flex-col justify-between">
        <h4 className="text-lg font-bold text-gray-800 mb-1">{fund.title}</h4>
        <p className="text-sm text-gray-600 mb-2">
          {fund.description?.length > 100
            ? `${fund.description.slice(0, 100)}...`
            : fund.description || "No description available."}
          <a
            href="#"
            className="text-blue-500 font-medium hover:underline ml-1"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate();
            }}
          >
            Read More
          </a>
        </p>
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold text-green-600">Fund Received:</span>{" "}
          <span className="font-bold">${fund.currentAmount}</span>
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Edit Button */}
        <button
          onClick={handleEditFund}
          className="p-2 rounded-full bg-gray-100 hover:bg-blue-300 transition"
        >
          <img src={editIcon} alt="edit" className="w-5 h-5" />
        </button>

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          className={`px-4 py-2 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } transition duration-300 shadow-md`}
          disabled={loading}
        >
          {loading ? "Donating..." : "Donate"}
        </button>
      </div>
    </div>
  );
};

export default FundCard;
