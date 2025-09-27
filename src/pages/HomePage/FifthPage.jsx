const FifthPage = () => {
  return (
    <div className="px-8 py-16 bg-gray-50 text-center  drop-shadow-inner">
      {/* Title */}
      <h2
        className="text-2xl md:text-5xl font-bold mb-12"
        style={{
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", // Adding shadow effect
        }}
      >
        Empowering Connections, Careers, and Communities.
      </h2>

      {/* Buttons Section */}
      <div className="grid grid-cols-3 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Button 1 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">UP TO DATE ALUMNI PROFILE</p>
        </div>
        {/* Button 2 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">VOLUNTEER AND MENTORSHIP MANAGEMENT</p>
        </div>
        {/* Button 3 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">ADVANCE SEGMENTATION</p>
        </div>
        {/* Button 4 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">JOB REFERRAL BOARDS</p>
        </div>
        {/* Button 5 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">ENGAGEMENT INSIGHTS</p>
        </div>
        {/* Button 6 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">COMMUNITY BUILDING</p>
        </div>
        {/* Button 7 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">CAREER TRACKING</p>
        </div>
        {/* Button 8 */}
        <div className="bg-white shadow-lg rounded-lg py-4 px-6">
          <p className="font-semibold">NEWS, STORIES & EVENTS</p>
        </div>
      </div>
    </div>
  );
};

export default FifthPage;
