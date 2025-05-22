import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Card, { CardContent } from "../components/card";

// Constants
const DASHBOARD_DATA = {
  banner: {
    title: "E-Learning Domain for Upgrading Competence and Teaching Excellence",
    logoText: "EDUCATE"
  },
  stats: [
    { title: "Enrolled Courses", value: "8,532" },
    { title: "Courses Completed", value: "132" },
    { title: "Certificates Earned", value: "47" },
    { title: "New Messages", value: "285" }
  ],
  chart: {
    title: "Weekly User Engagement",
    data: [
      { name: "Mon", users: 400 },
      { name: "Tue", users: 600 },
      { name: "Wed", users: 300 },
      { name: "Thu", users: 500 },
      { name: "Fri", users: 700 }
    ]
  }
};

const Dashboard = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />

        <main className="flex">
          <Sidebar />

          <DashboardContent />
        </main>
      </div>
    </motion.div>
  );
};

const DashboardContent = () => {
  return (
    <div className="flex-1 p-6 mt-16 space-y-6">
      <Banner />
      <StatsGrid />
      <EngagementChart />
    </div>
  );
};

const Banner = () => (
  <motion.div
    className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white rounded-xl shadow-xl p-6 flex items-center gap-6"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-32 h-16 rounded-full bg-white text-blue-800 flex items-center justify-center text-lg font-bold shadow-inner">
      {DASHBOARD_DATA.banner.logoText}
    </div>
    <h2 className="text-lg font-medium">{DASHBOARD_DATA.banner.title}</h2>
  </motion.div>
);

const StatsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {DASHBOARD_DATA.stats.map((stat, index) => (
      <StatCard key={index} title={stat.title} value={stat.value} />
    ))}
  </div>
);

const StatCard = ({ title, value }) => (
  <Card>
    <CardContent>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const EngagementChart = () => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-4">{DASHBOARD_DATA.chart.title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={DASHBOARD_DATA.chart.data}>
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
);

export default Dashboard;