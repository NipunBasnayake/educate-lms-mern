import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import registerVideo from "../video/Register.mp4"; // ✅ Ensure this path is correct

const Register = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRegistered(true); // Simulate success
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-0 pt-20">
        {/* Left: Video */}
        <div className="hidden lg:block lg:w-1/2 h-full relative rounded-l-1xl overflow-hidden shadow-xl">
          <video
            src={registerVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right: Registration Form */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account </h2>
            <p className="text-sm text-gray-500 mb-6">
              Register to get started with your learning journey
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  disabled={isRegistered}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  disabled={isRegistered}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  disabled={isRegistered}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isRegistered}
                className={`w-full py-2 rounded-lg transition font-semibold ${
                  isRegistered
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isRegistered ? "✅ Registered" : "Register"}
              </button>
            </form>

            {/* Dashboard Link After Registration */}
            {isRegistered && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Registration successful. You can now go to{" "}
                <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">
                  Dashboard
                </Link>
                .
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;
