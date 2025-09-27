import { useState } from "react";
import { useNavigate } from "react-router-dom";
import editIcon from "../../../assets/icons/edit.svg";
import { toast } from "react-toastify";

const FundsCard = ({ fund, currentUserId, onDonate, onEditFund }) => {
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
    <div className="w-full max-w-[340px] border rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-green-50 p-6 flex flex-col justify-between hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 relative">
      {/* Fund Image with Edit Button */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={fund.fundImage}
          alt={fund.title}
          className="w-full h-[180px] object-cover"
        />
        {/* Edit Button */}
        <button
          onClick={handleEditFund}
          className="absolute top-3 right-3 bg-gray-300 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-green-700 transition"
          title="Edit Fund"
        >
          <img src={editIcon} alt="Edit" className="w-4 h-4" />
        </button>
      </div>

      {/* Fund Details */}
      <div className="mt-4">
        <h4 className="text-lg font-bold text-gray-800">{fund.title}</h4>
        <p className="text-sm text-gray-700 mt-3">
          {fund.description?.length > 120
            ? `${fund.description.slice(0, 120)}...`
            : fund.description || "No description available."}
          <a
            href="#"
            className="text-green-600 font-medium hover:underline ml-1"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate();
            }}
          ></a>
        </p>
        <p className="text-xs text-gray-500 mt-3">
          Fund Received:{" "}
          <span className="text-gray-700 font-medium">
            ${fund.currentAmount}
          </span>
        </p>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDonate}
          className="w-3/4 px-5 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl transition"
          disabled={loading}
        >
          {loading ? "Donating..." : "Donate"}
        </button>
      </div>
    </div>
  );
};

export default FundsCard;
