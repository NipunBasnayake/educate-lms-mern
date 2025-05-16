import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import bubblesVideo from "../video/bubble.mp4"; // Adjust the path if needed

const Login = () => {
  return (
    <div>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-0 pt-20">
        {/* Left: Form Area */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Login to access your account
            </p>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition mb-4"
            >
              <FcGoogle className="text-xl" />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>

            <div className="flex items-center gap-2 my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-xs text-gray-400">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Email Login Form */}
            <form>
              <div className="mb-4">
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
              <div className="mb-4">
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Video Area */}
        <div className="hidden lg:block lg:w-1/2 h-full relative rounded-l-3xl overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bubblesVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
