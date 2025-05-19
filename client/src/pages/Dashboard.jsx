import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import RecentActivity from "../components/RecentActivity";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card, { CardContent } from "../components/card";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

// Removed duplicate Dashboard function, as the main Dashboard component is already defined below.
// Dummy chart data
const data = [
  { name: "Mon", users: 400 },
  { name: "Tue", users: 600 },
  { name: "Wed", users: 300 },
  { name: "Thu", users: 500 },
  { name: "Fri", users: 700 },
];

const Dashboard = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />

        <main className="flex">
          <Sidebar />

          <div className="flex-1 p-6 mt-16 space-y-6">
            {/* EDUCATE Banner */}
            <motion.div
              className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white rounded-xl shadow-xl p-6 flex items-center gap-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-32 h-16 rounded-full bg-white text-blue-800 flex items-center justify-center text-lg font-bold shadow-inner">
                EDUCATE
              </div>
              <h2 className="text-lg font-medium">
                E-Learning Domain for Upgrading Competence and Teaching
                Excellence
              </h2>
            </motion.div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent>
                  <h4 className="text-sm font-semibold">Total Students</h4>
                  <p className="text-xl font-bold">8,532</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h4 className="text-sm font-semibold">Courses Active</h4>
                  <p className="text-xl font-bold">132</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h4 className="text-sm font-semibold">Instructors</h4>
                  <p className="text-xl font-bold">47</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h4 className="text-sm font-semibold">New Signups</h4>
                  <p className="text-xl font-bold">285</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Weekly User Engagement
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            

          </div>
        </main>

        <Footer />
      </div>
    </motion.div>
  );
};

export default Dashboard;
