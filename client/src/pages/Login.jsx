import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    navigate("/dashboard");
  };

  return (
    <div className="font-sans">
      <main className="relative min-h-screen flex items-center justify-center bg-neutral-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('src/images/G-img.jpg')` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        {/* Login Card */}
        <div className="relative z-20 w-full lg:w-1/2 flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-95">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to University 
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Login to access your account
            </p>

            {/* Email Login Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-xs text-gray-400">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
            >
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
