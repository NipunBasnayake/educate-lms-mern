import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bubblesVideo from '../video/bubble.mp4'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { _id, name, email: userEmail, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ _id, name, email: userEmail }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

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

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            {/* Email Login Form */}
            <form onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                Don’t have an account?{' '}
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