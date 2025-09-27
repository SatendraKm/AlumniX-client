import MyEventContent from "../MyEvent/MyEventContent";
const Event = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-y-auto">
      <MyEventContent />
    </div>
  );
};

export default Event;
