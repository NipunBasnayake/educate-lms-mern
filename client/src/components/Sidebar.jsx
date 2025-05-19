import React, { useState } from "react";

import { Link } from "react-router-dom";
import {
  User,
  Globe,
  Package,
  Calendar,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  ScrollText,
  Accessibility,
  Users,
  Landmark,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Arrow Icon on Left Side Center */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-blue-800 text-white h-[2cm] w-[14px] flex items-center justify-center rounded-r-md shadow-lg md:hidden"
      >
        {isOpen ? (
          <span className="rotate-180 text-xs font-bold">&#10148;</span> // Left arrow
        ) : (
          <span className="text-xs font-bold">&#10148;</span> // Right arrow
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-[250px] bg-blue-800 text-white overflow-y-auto p-7 rounded-r-xl transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        <h2 className="text-lg font-semibold mb-10 mt-16">Dashboard</h2>
        <ul className="space-y-6 text-smbold">
          <li>
            <Link
              to="/institution"
              className="flex items-center gap-3 hover:font-bold"
            >
              <Landmark size={20} />
              Institution
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:font-bold"
            >
              <User size={20} />
              Narayanan Prabharan
            </Link>
          </li>
          <li>
            <Link
              to="/Activity "
              className="flex items-center gap-3 hover:font-bold"
            >
              <Globe size={20} />
              Activity
            </Link>
          </li>
          <li>
            <Link
              to="/units"
              className="flex items-center gap-3 hover:font-bold"
            >
              <Package size={20} />
              Units
            </Link>
          </li>
          <li>
            <Link
              to="/organization"
              className="flex items-center gap-3 hover:font-bold"
            >
              <Users size={20} />
              Organization
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className="flex items-center gap-3 hover:font-bold"
            >
              <Calendar size={20} />
              Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className="flex items-center gap-3 hover:font-bold"
            >
              <MessageSquare size={20} />
              Messages
            </Link>
          </li>
          <li>
            <Link
              to="/marks"
              className="flex items-center gap-3 hover:font-bold"
            >
              <ClipboardList size={20} />
              Marks
            </Link>
          </li>
          <li>
            <Link
              to="/tools"
              className="flex items-center gap-3 hover:font-bold"
            >
              <Settings size={20} />
              Tools
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="flex items-center gap-3 hover:font-bold"
            >
              <LogOut size={20} />
              Logout
            </Link>
          </li>
        </ul>

        {/* Footer Links */}
        <div className="mt-10 text-sm space-y-3 text-white/80">
          <Link
            to="/privacy"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <ShieldCheck size={16} />
            Privacy
          </Link>
          <Link
            to="/terms"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <ScrollText size={16} />
            Terms
          </Link>
          <Link
            to="/accessibility"
            className="flex items-center gap-2 hover:text-white transition"
          >
            <Accessibility size={16} />
            Accessibility
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
