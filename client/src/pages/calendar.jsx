import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import { motion } from "framer-motion";
import Card, { CardContent } from "../components/Card";

const CalendarPage = () => {
  const today = new Date();
  const [selected, setSelected] = useState(today.getDate());
  const [year] = useState(today.getFullYear());
  const [month] = useState(today.getMonth());

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
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
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-full">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-8xl mx-auto mt-6">
          <Card className="p-10 space-y-12">
            {/* Header and Date Strip */}
            <Section>
              <div className="text-center mb-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">
                  {new Date(year, month).toLocaleDateString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h1>
                <p className="text-gray-500 text-lg">
                  Plan your time, view tasks & track course events easily
                </p>
              </div>

              {/* Date Strip */}
              <div className="flex justify-center gap-6 mb-10">
                {dateStrip.map((d, idx) =>
                  d ? (
                    <motion.div
                      key={idx}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelected(d)}
                      className={`cursor-pointer w-16 h-16 rounded-full flex flex-col items-center justify-center border text-sm shadow
                        ${
                          d === selected
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-800 border-gray-300"
                        }
                        transition duration-300`}
                    >
                      <div className="text-xs font-medium">
                        {new Date(year, month, d).toLocaleDateString("default", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-lg font-bold">{d}</div>
                    </motion.div>
                  ) : (
                    <div key={idx} className="w-16 h-16" />
                  )
                )}
              </div>
            </Section>

            {/* Calendar Summary */}
            <Section title="Calendar Summary">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  ["Tasks Today", "3"],
                  ["Events This Week", "7"],
                  ["Upcoming Deadlines", "5"],
                  ["Meetings Scheduled", "2"],
                ].map(([label, value], i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">
                      {label}
                    </h4>
                    <p className="text-2xl font-bold text-black">{value}</p>
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* Upcoming Events */}
            <Section title="Upcoming Events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="institution" title="Lecture: Computer Science" footer="Room 302, Main Building">
                  <CardContent>
                    {`${new Date(year, month, selected, 10).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${new Date(year, month, selected, 12).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </CardContent>
                </Card>

                <Card variant="institution" title="Assignment Due" footer="Due by 11:59 PM">
                  <CardContent>
                    Data Structures and Algorithms Project Submission
                  </CardContent>
                </Card>

                <Card variant="institution" title="Group Study Session" footer="Library Study Room 5">
                  <CardContent>
                    {`${new Date(year, month, selected, 14).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${new Date(year, month, selected, 16).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Schedule Overview */}
            <Section title="Schedule Overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="institution" title="Today's Classes">
                  <CardContent>
                    <ul className="space-y-2 text-gray-700">
                      <li>10:00 AM - Computer Science</li>
                      <li>02:00 PM - Mathematics</li>
                      <li>04:00 PM - Research Methods</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="institution" title="Important Dates">
                  <CardContent>
                    <ul className="space-y-2 text-gray-700">
                      <li>Midterm Exams: June 15–20</li>
                      <li>Project Submission: June 25</li>
                      <li>Final Exams: July 10–20</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Tools */}
            <Section title="Calendar Tools">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="institution" title="Add New Event">
                  <CardContent>
                    Schedule personal study sessions or reminders
                  </CardContent>
                </Card>

                <Card variant="institution" title="Export Schedule">
                  <CardContent>
                    Download your calendar in iCal format
                  </CardContent>
                </Card>

                <Card variant="institution" title="Sync with LMS">
                  <CardContent>
                    Connect with your course deadlines
                  </CardContent>
                </Card>

                <Card variant="institution" title="Set Reminders">
                  <CardContent>
                    Get notifications for important events
                  </CardContent>
                </Card>
              </div>
            </Section>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
