import BulkContent from "./BulkContent";
import backgroundImage from "../../../assets/images/email.jpg";

const Bulk = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 relative">
      {/* Background Blur Effect */}
      <div className="absolute inset-0 backdrop-blur-lg bg-gradient-to-br from-purple-500 via-blue-500 to-green-400 opacity-60"></div>

      {/* Bulk Email Container */}
      <div className="relative z-10 h-[80vh] w-full max-w-7xl bg-white shadow-2xl rounded-3xl grid grid-cols-1 md:grid-cols-[30%_70%] overflow-hidden">
        {/* Title Section */}
        <div className="relative text-black flex flex-col justify-center items-center h-full">
          {/* Background Image with Full Size and Blur */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center blur-lg"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>

          {/* Content Overlay */}
          <div className="relative z-10 text-center p-6">
            <h2 className="text-3xl font-bold mb-3">📧 Bulk Email Sender</h2>
            <p className="text-lg mb-5">
              Easily send bulk emails to your recipients with a single click.
            </p>
          </div>
        </div>

        {/* Bulk Email Content */}
        <div className="bg-gray-50 p-8 flex flex-col">
          <BulkContent />
        </div>
      </div>
    </div>
  );
};

export default Bulk;
