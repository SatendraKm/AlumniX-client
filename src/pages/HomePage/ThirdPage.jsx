import backgroundImage from "../../assets/images/Background3.png";

const ThirdPage = () => {
  return (
    <div className="px-10 py-16 bg-white text-center bg-cover mx-16">
      {/* Title Section */}
      <div className="flex justify-between items-center font-extrabold md-5 ">
        <h2
          className="text-2xl md:text-4xl font-bold text-center"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", // Adding shadow effect
          }}
        >
          Real-Time Insights, Real-World Gains
        </h2>
        <button className="border border-black text-black text-semibold px-6 py-2 rounded-full hover:bg-black hover:text-white transition">
          Learn More
        </button>
      </div>
      <div className="flex justify-center items-center min-h-screen ">
        <div
          className="h-[800px] w-[1600px] bg-cover flex flex-col items-center justify-center px-10 mt-5 corner-rounded"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {/* Content inside the image can go here */}
        </div>
      </div>
    </div>
  );
};
export default ThirdPage;
