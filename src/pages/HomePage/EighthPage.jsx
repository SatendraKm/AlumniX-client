import backgroundImage from "../../assets/images/Background8.jpg"; // Replace with the actual path to your background image

const EighthPage = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Heading */}
      <h2 className="absolute top-8 left-1/4 ml-20 transform -translate-x-1/2 text-3xl md:text-5xl font-bold text-white text-left leading-tight shadow-white ">
        Your Gateway to Success, <br /> Smart Work Increase With Network_Next
      </h2>
    </div>
  );
};

export default EighthPage;
