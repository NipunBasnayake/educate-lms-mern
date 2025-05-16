import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // ✅ Import Footer

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 relative">
        {/* Optional Background Block */}
        <div
          className="absolute top-0 left-0 w-full bg-gray-200 shadow-md"
          style={{ height: "700px", zIndex: -1 }}
        ></div>

        {/* Register Card */}
        <div className="h-screen flex items-start justify-end pr-10 pt-24 relative z-10">
          <div className="w-full max-w-sm p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center">Register</h2>
            <form className="mt-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Register;
