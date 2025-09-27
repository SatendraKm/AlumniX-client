// Feed.jsx
import React from 'react';
import FeedContent from './FeedContent';

const Feed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="bg-gray-50 rounded-lg shadow-md p-8 max-w-2xl w-full">
        <FeedContent />
      </div>
    </div>
  );
};

export default Feed;
