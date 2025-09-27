import EventContent from "../Event/EventContent";
const Event = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-y-auto">
      <EventContent />
    </div>
  );
};

export default Event;
