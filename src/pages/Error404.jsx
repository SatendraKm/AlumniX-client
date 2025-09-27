import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
      {/* Error Message */}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you are looking for doesn&apos;t exist.
        </p>
        <Link
          to="/dashboard/home"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Error404;
