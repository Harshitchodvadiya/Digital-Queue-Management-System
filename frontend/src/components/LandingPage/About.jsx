import React from 'react';

export default function About() {
    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">A Better Way to Wait</h2>
                <p className="mt-4 text-gray-600">
                    WaitWise combines simplicity with power to transform how organizations manage queues and how 
                    customers experience waiting.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Real-Time Updates */}
                    <div className="mt-16 text-center max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900">A Better Way to Wait</h2>
        <p className="mt-4 text-lg text-gray-600">
          WaitWise combines simplicity with power to transform how organizations manage queues and how customers experience waiting.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <span className="text-blue-600 text-2xl">⏳</span>
            <h3 className="mt-4 font-semibold">Real-Time Updates</h3>
            <p className="text-sm text-gray-500 text-center">Track your position and estimated wait time with up-to-the-minute accuracy.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <span className="text-blue-600 text-2xl">🔔</span>
            <h3 className="mt-4 font-semibold">Smart Notifications</h3>
            <p className="text-sm text-gray-500 text-center">Receive timely alerts as you approach the front of the queue, so you never miss your turn.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <span className="text-blue-600 text-2xl">💳</span>
            <h3 className="mt-4 font-semibold">Digital Tokens</h3>
            <p className="text-sm text-gray-500 text-center">Request and manage your place in line with elegant digital tokens that replace physical tickets.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <span className="text-blue-600 text-2xl">👨‍💼</span>
            <h3 className="mt-4 font-semibold">Staff Management</h3>
            <p className="text-sm text-gray-500 text-center">Optimize service efficiency with tools designed for staff to manage customer flow.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <span className="text-blue-600 text-2xl">🔄</span>
            <h3 className="mt-4 font-semibold">Flexible Rescheduling</h3>
            <p className="text-sm text-gray-500 text-center">Easily reschedule your token without losing your place in line.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
            <span className="text-blue-600 text-2xl">📊</span>
            <h3 className="mt-4 font-semibold">Analytics & Insights</h3>
            <p className="text-sm text-gray-500 text-center">Gain valuable data on queue patterns and service performance to continuously improve.</p>
          </div>
        </div>
      </div>
                </div>
            </div>
        </div>
    );
}
