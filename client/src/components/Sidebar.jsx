import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-[268px] h-[calc(100vh-64px)] bg-gray-800 text-white fixed top-[64px] left-0 overflow-y-auto p-6">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/courses" className="hover:underline">Courses</Link></li>
        <li><Link to="/login" className="hover:underline">Login</Link></li>
        <li><Link to="/register" className="hover:underline">Register</Link></li>

        {/* Add more items to demonstrate scroll */}
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i}>
            <Link to={`/item${i + 1}`} className="hover:underline">Item {i + 1}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
