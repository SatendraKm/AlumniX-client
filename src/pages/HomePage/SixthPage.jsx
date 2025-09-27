import backgroundImage from "../../assets/images/Background6.png";
// Replace with the actual image path

const SixthPage = () => {
  return (
    <div className="px-8 py-16 bg-white flex flex-col lg:flex-row items-center justify-between gap-6 mx-10">
      {/* Left Section: Text Content */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <h2
          className="text-2xl md:text-6xl font-bold mb-12"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Adding shadow effect
          }}
        >
          Digital Engagement Platform
        </h2>
        <p className="text-lg text-blue-600 font-semibold md:text-3xl mb-6">
          Discover Core Supporters to drive <br className="gap-4" />
          engagement, exceed event goals, and
          <br />
          manage volunteers.
        </p>
        <button className="mt-4 px-6 py-2 border-2 font-semibold border-black bg-black text-white text-lg rounded-full hover:bg-white hover:text-black transition">
          Learn More
        </button>
      </div>

      {/* Right Section: Image */}
      <div className="lg:w-2/4 flex justify-center">
        <img
          src={backgroundImage}
          alt="Digital Engagement Platform"
          className="max-w-full"
        />
      </div>
    </div>
  );
};

export default SixthPage;
