import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-800 border-solid"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Fetching data, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
