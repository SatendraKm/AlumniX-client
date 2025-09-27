import EventContent from "./EventContent";
const Event = () => {
  return (
    <div className="flex flex-col:3 lg:flex-row w-full min-h-screen overflow-y-auto">
      <EventContent />
    </div>
  );
};

export default Event;
