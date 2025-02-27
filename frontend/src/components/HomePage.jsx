import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Content */}
      <div className="flex flex-grow justify-center items-center">
        <div className="text-center p-10 bg-white shadow-lg rounded-lg text-gray-900">
          <h2 className="text-3xl font-bold">Welcome to the Home Page!</h2>
          <p className="text-gray-700 mt-4">You have successfully logged in.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
