// import React from "react";
import DonationContent from "./DonationContent";
import RightSidebar from "./RightSidebar";

const Funds = () => {
  return (
    <div className="flex justify-between bg-white-100 min-h-screen p-6">
      <DonationContent />
      <RightSidebar />
    </div>
  );
};

export default Funds;
