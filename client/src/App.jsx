import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Institution from "./pages/Institution";
import Profile from "./pages/profile"; // Assuming you have a Profile page
import Goals from "./pages/goals"; // Assuming you have a Goals page
import Units from "./pages/units"; // Assuming you have a Unit page


function App() {
  return (
    <Router>
      {/* Optional: Global Navbar */}
      <Navbar />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/" element={<Home />} />
        <Route path="/institution" element={<Institution />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Activity" element={<Goals />} />
        <Route path="/units" element={<Units />} />


        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
