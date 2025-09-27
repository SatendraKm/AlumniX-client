import ReunionCard from "./ReunionCard";

const RightSidebar = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-lg font-bold mb-4">Important Updates</h2>
      {/* Example Card */}
      <ReunionCard
        className="mb-4 w-[200px]"
        title="Reunion Party"
        name="Batman"
        batch="2025"
        date="24 Nov 2023"
        organizer="Soumya Mittal"
        status="Online"
      />
    </div>
  );
};

export default RightSidebar;
