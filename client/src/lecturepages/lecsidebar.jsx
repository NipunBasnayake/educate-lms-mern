import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiBook, FiFileText, FiUsers, FiLogOut, FiHome } from "react-icons/fi";
import PropTypes from "prop-types";


// Sidebar component for lecturer navigation
const Lecsidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items with icons and routes
  const navItems = [
    { name: "Dashboard", path: "/lecturepages/lectureashboard", icon: <FiHome className="text-lg" /> },
    { name: "My Courses", path: "/lecturepages/lcourses", icon: <FiBook className="text-lg" /> },
    { name: "Assignments", path: "/lecturepages/lassignments", icon: <FiFileText className="text-lg" /> },
    { name: "Students", path: "/lecturepages/lstudents", icon: <FiUsers className="text-lg" /> },
  ];

  return (
    <aside className="w-64 bg-neutral-800 text-white flex flex-col min-h-screen">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-neutral-700">
        <h1 className="text-2xl font-bold tracking-tight">Lecture Dashboard</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg w-full text-left transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-200 hover:bg-neutral-700"
            }`}
            aria-current={location.pathname === item.path ? "page" : undefined}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-neutral-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-neutral-700 rounded-lg w-full transition"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// PropTypes for type checking
Lecsidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Lecsidebar;