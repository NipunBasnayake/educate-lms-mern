import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Section from "../components/Section";
import { motion } from "framer-motion";

const CalendarPage = () => {
  const today = new Date();
  const [selected, setSelected] = useState(today.getDate());
  const [year] = useState(today.getFullYear());
  const [month] = useState(today.getMonth());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const totalDays = getDaysInMonth(year, month);

  const centeredDates = () => {
    const days = [];
    for (let offset = -3; offset <= 3; offset++) {
      const d = selected + offset;
      days.push(d >= 1 && d <= totalDays ? d : null);
    }
    return days;
  };

  const dateStrip = centeredDates();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white"
    >
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="fixed h-[calc(100vh)] w-64 z-10"> {/* Adjust 4rem to match your Navbar height */}
          <Sidebar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 ml-64 overflow-y-auto p-6"> {/* ml-64 matches sidebar width */}
          <div className="max-w-7xl mx-auto space-y-12 mt-12">
            {/* Calendar Header Section */}
            <Section title="📅 Smart Calendar">
              <div className="text-center mb-4">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                  {new Date(year, month).toLocaleDateString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Plan your time, view tasks & track course events easily
                </p>
              </div>

              {/* Animated Date Strip */}
              <div className="flex justify-center gap-6 mb-10">
                {dateStrip.map((d, idx) =>
                  d ? (
                    <motion.div
                      key={idx}
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setSelected(d)}
                      className={`cursor-pointer w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-xl border
                        ${
                          d === selected
                            ? "bg-blue-600 text-white border-blue-800 shadow-blue-300 dark:shadow-blue-900"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                        }
                        transition duration-300`}
                    >
                      <div className="text-sm font-medium">
                        {new Date(year, month, d).toLocaleDateString("default", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-xl font-bold">{d}</div>
                    </motion.div>
                  ) : (
                    <div key={idx} className="w-16 h-16"></div>
                  )
                )}
              </div>
            </Section>

            {/* Dashboard Cards */}
            <Section title="Dashboard">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  ["Enrolled Courses", "8,532"],
                  ["Courses Completed", "132"],
                  ["Certificates Earned", "47"],
                  ["New Messages", "285"],
                ].map(([label, value], i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <h4 className="text-sm font-semibold">{label}</h4>
                    <p className="text-xl font-bold">{value}</p>
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* Upcoming Events */}
            <Section title="Upcoming Events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  variant="institution"
                  title="Lecture: Computer Science"
                  content={`${new Date(
                    year,
                    month,
                    selected,
                    10
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(
                    year,
                    month,
                    selected,
                    12
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                  footer="Room 302, Main Building"
                />
                <Card
                  variant="institution"
                  title="Assignment Due"
                  content="Data Structures and Algorithms Project Submission"
                  footer="Due by 11:59 PM"
                />
                <Card
                  variant="institution"
                  title="Group Study Session"
                  content={`${new Date(
                    year,
                    month,
                    selected,
                    14
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${new Date(
                    year,
                    month,
                    selected,
                    16
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                  footer="Library Study Room 5"
                />
              </div>
            </Section>

            {/* Schedule Overview */}
            <Section title="Schedule Overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  variant="institution"
                  title="Today's Classes"
                  content={
                    <ul className="space-y-2">
                      <li>10:00 AM - Computer Science</li>
                      <li>02:00 PM - Mathematics</li>
                      <li>04:00 PM - Research Methods</li>
                    </ul>
                  }
                />
                <Card
                  variant="institution"
                  title="Important Dates"
                  content={
                    <ul className="space-y-2">
                      <li>Midterm Exams: June 15–20</li>
                      <li>Project Submission: June 25</li>
                      <li>Final Exams: July 10–20</li>
                    </ul>
                  }
                />
              </div>
            </Section>

            {/* Tools Section */}
            <Section title="Calendar Tools">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  variant="institution"
                  title="Add New Event"
                  content="Schedule personal study sessions or reminders"
                />
                <Card
                  variant="institution"
                  title="Export Schedule"
                  content="Download your calendar in iCal format"
                />
                <Card
                  variant="institution"
                  title="Sync with LMS"
                  content="Connect with your course deadlines"
                />
                <Card
                  variant="institution"
                  title="Set Reminders"
                  content="Get notifications for important events"
                />
              </div>
            </Section>
          </div>
        </main>
      </div>

      
    </motion.div>
  );
};

export default CalendarPage;