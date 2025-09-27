import alumniIcon from "../../assets/icons/alumni-directory-icon.svg"; // Replace with actual icon paths
import networkingIcon from "../../assets/icons/networking-icon.svg";
import jobsIcon from "../../assets/icons/jobs-icon.svg";

const SecondPage = () => {
  return (
    <div className="h-[500] px-10 py-16 text-center bg-white ">
      {/* Title Section */}
      <h4 className="z-10 text-6xl md:text-4xl font-bold mb-4 p-8 ">
        Unlock Your <span className="text-blue-600 ">Networking Potential</span>{" "}
        with <span className="underline text-red-700">Network Next</span> ! ! !
      </h4>
      <p className="text-md md:text-lg text-gray-700 max-w-3xl mx-auto mb-10">
        Join our vibrant community on Trade Gospel, where you can watch and
        participate in live trading sessions. Get real-time insights, expert
        strategies, and make informed trades with confidence.
      </p>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-40 items-start px-10 py-10 mx-20 ">
        {/* Alumni Directory */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={alumniIcon}
              alt="Alumni Directory Icon"
              className="w-16 h-16 bg-blue-100 rounded-full p-4"
            />
          </div>
          <h2 className="text-lg font-semibold mb-2">Alumni Directory</h2>
          <p className="text-gray-600">
            Access real-time Resources and make informed decisions to maximize
            your profits.
          </p>
        </div>

        {/* Networking */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={networkingIcon}
              alt="Networking Icon"
              className="w-16 h-16 bg-blue-100 rounded-full p-4"
            />
          </div>
          <h2 className="text-lg font-semibold mb-2">Networking</h2>
          <p className="text-gray-600">
            Join our vibrant community of Alumni, Faculty to share insights and
            learn from each other.
          </p>
        </div>

        {/* Jobs & Referral */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src={jobsIcon}
              alt="Jobs & Referral Icon"
              className="w-16 h-16 bg-blue-100 rounded-full p-4"
            />
          </div>
          <h2 className="text-lg font-semibold mb-2">Jobs & Referral</h2>
          <p className="text-gray-600">
            Access educational resources designed to equip you with knowledge
            needed to navigate the financial markets effectively.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12">
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700">
          Explore all Program
        </button>
      </div>
    </div>
  );
};

export default SecondPage;
