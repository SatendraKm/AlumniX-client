// import React from "react";
import NsquareLogo from "../../assets/icons/nsqure.svg";

const JoinCommunitySection = () => {
  return (
    <>
      <div className="py-6"></div>
      <div className="max-w-7xl mx-auto mt-8 mb-12 px-8 py-6 bg-white border border-gray-300 rounded-lg shadow-md flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div>
            <img src={NsquareLogo} alt="Network Next" className="w-16 h-16" />
          </div>
          {/* Text Content */}
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Join Network_Next Community
            </h3>
            <p className="text-sm text-gray-600">
              Get your questions answered quickly. Browse through our FAQs for{" "}
              <br />
              instant support on common topics of inquiry.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Community Members */}
          <div className="flex -space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-gray-500 font-medium">U1</span>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-gray-500 font-medium">U2</span>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-gray-500 font-medium">U3</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 border-2 border-white text-gray-800 text-sm">
              +10k
            </div>
          </div>
          {/* Join Button */}
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800">
            Join Community
          </button>
        </div>
      </div>
      <div className="py-6"></div>
    </>
  );
};

export default JoinCommunitySection;
