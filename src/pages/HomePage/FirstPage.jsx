import backgroundImage from "../../assets/images/graduationImage.png"; // Replace with the actual background image path

const FirstPage = () => {
  return (
    <div
      className="h-[850px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4 "
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-black mb-9">
        What is Network_Next???
      </h1>

      {/* Subtitle */}
      <p className="text-md md:text-lg text-gray-800 max-w-2xl mb-8">
        Welcome to <span className="font-bold">Network_Next</span>, where we
        empower individuals with the knowledge and tools to succeed in their
        professional journeys through{" "}
        <span className="font-bold">Making Connections</span>.
      </p>

      {/* Button */}
      <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700">
        Join Now
      </button>
    </div>
  );
};

export default FirstPage;
