import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Globe,
  Package, // Replaced Cube with Package icon
  Calendar,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  ScrollText,
  Accessibility,
  Users, // Updated to Users icon
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-[280px] bg-blue-800 text-white h-full overflow-y-auto p-7 rounded-r-xl">
      <h2 className="text-lg font-semibold mb-10 mt-16">Dashboard</h2>
      <ul className="space-y-6 text-smbold">
        {/* Institution Link */}
        <li>
          <Link
            to="/institution"
            className="flex items-center gap-3 hover:font-bold"
          >
            <Globe size={20} />
            Institution
          </Link>
        </li>

        {/* User Profile */}
        <li>
          <Link
            to="/profile"
            className="flex items-center gap-3 hover:font-bold"
          >
            <User size={20} />
            Narayanan Prabharan
          </Link>
        </li>

        {/* Other Links */}
        <li>
          <Link to="/goals" className="flex items-center gap-3 hover:font-bold">
            <Globe size={20} />
            Activity
          </Link>
        </li>
        <li>
          <Link
            to="/units"
            className="flex items-center gap-3 hover:font-bold"
          >
            <Package size={20} /> {/* Updated Icon */}
            Units
          </Link>
        </li>
        <li>
          <Link
            to="/organization"
            className="flex items-center gap-3 hover:font-bold"
          >
            <Users size={20} /> {/* Updated Icon */}
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
          <Link to="/marks" className="flex items-center gap-3 hover:font-bold">
            <ClipboardList size={20} />
            Marks
          </Link>
        </li>
        <li>
          <Link to="/tools" className="flex items-center gap-3 hover:font-bold">
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
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          Privacy
        </div>
        <div className="flex items-center gap-2">
          <ScrollText size={16} />
          Terms
        </div>
        <div className="flex items-center gap-2">
          <Accessibility size={16} />
          Accessibility
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
