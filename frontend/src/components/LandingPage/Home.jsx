import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: "⏳",
      title: "Real-Time Updates",
      desc: "Track your position and estimated wait time with up-to-the-minute accuracy.",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      desc: "Receive timely alerts as you approach the front of the queue, so you never miss your turn.",
    },
    {
      icon: "💳",
      title: "Digital Tokens",
      desc: "Request and manage your place in line with elegant digital tokens that replace physical tickets.",
    },
    {
      icon: "👨‍💼",
      title: "Staff Management",
      desc: "Optimize service efficiency with tools designed for staff to manage customer flow.",
    },
    {
      icon: "🔄",
      title: "Flexible Rescheduling",
      desc: "Easily reschedule your token without losing your place in line.",
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      desc: "Gain valuable data on queue patterns and service performance to continuously improve.",
    },
  ];

  return (
    <div className="relative bg-gray-50 min-h-screen px-6 md:px-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-12">
        {/* Left Content */}
        <div className="max-w-2xl text-center md:text-left">
          <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            Modernizing Wait Times
          </span>
          <h1 className="mt-4 text-5xl font-bold text-gray-900 leading-tight">
            Elegant Token System for{" "}
            <span className="text-blue-600">Modern Queues</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            WaitWise transforms the waiting experience with our minimalist
            digital token system. No more physical lines, just simplified,
            transparent queue management.
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <Link
              to="/login"
              className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            >
              Get Started →
            </Link>
          </div>
        </div>

        {/* Right Floating Cards */}
        <div className="relative hidden md:flex flex-col items-center space-y-8 w-1/2">
          {[
            { service: "Banking Services", token: "A-103", position: "2" },
            {
              service: "Customer Service",
              token: "C-215",
              position: "4 ~15 min",
            },
            { service: "Healthcare", token: "B-047", position: "1" },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl p-5 w-60 transform transition-all hover:scale-105"
            >
              <p className="text-sm text-gray-500">{card.service}</p>
              <p className="text-2xl font-semibold">{card.token}</p>
              <p className="text-sm text-gray-500">Position: {card.position}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center max-w-5xl mx-auto p-5">
        <h2 className="text-3xl font-bold text-gray-900">A Better Way to Wait</h2>
        <p className="mt-4 text-lg text-gray-600">
          WaitWise combines simplicity with power to transform how organizations
          manage queues and how customers experience waiting.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center transition-transform transform hover:scale-105"
            >
              <span className="text-blue-600 text-4xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-10 text-center md:flex md:justify-between md:items-center max-w-6xl mx-auto my-12">
        <div className="max-w-6xl mx-auto my-12 p-10 bg-white shadow-lg rounded-xl grid md:grid-cols-2 gap-10">

        {/* Left - Contact Details */}
        <div className="bg-gray-100 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900">Get in touch:</h2>
          <p className="text-gray-600 mt-2">Fill in the form to start a conversation</p>
          <div className="mt-4 space-y-3 text-gray-700">
            <p className="flex items-center"><span className="mr-2">📍</span> Acme Inc, Street, State, Postal Code</p>
            <p className="flex items-center"><span className="mr-2">📞</span> +44 1234567890</p>
            <p className="flex items-center"><span className="mr-2">✉️</span> info@acme.org</p>
          </div>
        </div>
        {/* Right - Contact Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Telephone Number"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-all">
            Submit
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
