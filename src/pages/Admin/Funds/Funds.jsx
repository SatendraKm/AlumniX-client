import DonationContent from "./DonationContent";
import RightSidebar from "./RightSidebar";

const Funds = () => (
  <div className="flex justify-between bg-white-100 h-[10%] p-6">
  <div className="basis-3/4">
    <DonationContent />
  </div>
  <div className="basis-1/4 flex-shrink-0">
    <RightSidebar />
  </div>
</div>
);

export default Funds;
