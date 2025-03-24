// import React from 'react'

// export default function About() {
//     return (
//         <div className="py-16 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
//             <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
//                 <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
//                     <div className="md:5/12 lg:w-5/12">
//                         <img
//                             src="https://www.esii.com/app/uploads/2022/05/queue-management-esii.webp"
//                             alt="image"
//                         />
//                     </div>
//                     <div className="md:7/12 lg:w-6/12">
//                         <h2 className="text-2xl text-white font-bold md:text-4xl">
//                             Digital Queue Management System
//                         </h2>
//                         <p className="mt-6 text-gray-200">
//                         The Digital Queue Management System is an innovative solution designed to streamline queue management for businesses such as banks, hospitals, and service centers. The system allows users to take virtual tokens, track their position in real time, and receive notifications about their turn.
//                         </p>
//                         <p className="mt-4 text-gray-200">
//                         This project offers a seamless, automated approach to reducing wait times and improving customer experience
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }   

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
