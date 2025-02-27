import React from 'react'

export default function About() {
    return (
        <div className="py-16 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
            <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
                <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                    <div className="md:5/12 lg:w-5/12">
                        <img
                            src="https://www.esii.com/app/uploads/2022/05/queue-management-esii.webp"
                            alt="image"
                        />
                    </div>
                    <div className="md:7/12 lg:w-6/12">
                        <h2 className="text-2xl text-white font-bold md:text-4xl">
                            Digital Queue Management System
                        </h2>
                        <p className="mt-6 text-gray-200">
                        The Digital Queue Management System is an innovative solution designed to streamline queue management for businesses such as banks, hospitals, and service centers. The system allows users to take virtual tokens, track their position in real time, and receive notifications about their turn.
                        </p>
                        <p className="mt-4 text-gray-200">
                        This project offers a seamless, automated approach to reducing wait times and improving customer experience
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}   