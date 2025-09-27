// FeedContent.jsx
import React, { useState } from 'react';

const FeedContent = () => {
  const [rating, setRating] = useState(6);
  const [comment, setComment] = useState('');
  const [month, setMonth] = useState('Sep');
  const [year, setYear] = useState('2019');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Feel free to drop us your feedback.</h2>

      {/* Satisfaction Rating */}
      <div>
        <label className="block text-gray-600 mb-2">
          How satisfied are you overall with the support of your Delivery Partner?
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Not at all likely</span>
          <span>Extremely likely</span>
        </div>
      </div>

      {/* Comment Box */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please tell us your reasons for giving this score here.."
          className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows="4"
        />
      </div>

      {/* Month and Year Selection */}
      <div>
  <label className="block text-gray-600 mb-2">
    Now please tell us the month and the year on which the following first happened
  </label>
  <div className="flex space-x-4">
    <select
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      className="border p-2 rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option>Jan</option>
      <option>Feb</option>
      <option>Mar</option>
      <option>Apr</option>
      <option>May</option>
      <option>Jun</option>
      <option>Jul</option>
      <option>Aug</option>
      <option>Sep</option>
      <option>Oct</option>
      <option>Nov</option>
      <option>Dec</option>
    </select>

    <select
      value={year}
      onChange={(e) => setYear(e.target.value)}
      className="border p-2 rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      {Array.from({ length: 10 }, (_, i) => {
        const currentYear = new Date().getFullYear();
        return (
          <option key={i} value={currentYear - i}>
            {currentYear - i}
          </option>
        );
      })}
    </select>
  </div>
</div>

{/* Submit Button */}
<button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition duration-200 w-full mt-4">
  Send Feedback
</button>
</div>
  );
};

export default FeedContent;
