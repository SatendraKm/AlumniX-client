import chatImage from "../../assets/images/Background7.jpg"; // Replace with the actual path of the chat interface image

const SeventhPage = () => {
  return (
    <div className="px-8 py-16 bg-white ">
      {/* Header Section */}
      <div className=" px-10 mx-6 flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 tracking-tight leading-tight">
          Real-time Chat -{" "}
          <span className="text-blue-600">With Connections, Alumni</span>
        </h2>
        <button className="px-6 py-2 border-2 border-black bg-white font-semibold text-black text-lg rounded-full hover:bg-black hover:text-white transition">
          Learn More
        </button>
      </div>

      {/* Chat Interface */}
      <div className="flex justify-center">
        <div className="w-full lg:w-4/5 xl:w-3/4   bg-white ">
          {/* Chat Interface Image */}
          <img
            src={chatImage}
            alt="Chat Interface"
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SeventhPage;
