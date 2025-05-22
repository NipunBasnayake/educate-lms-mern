import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card, { CardContent } from "../components/Card";

const CustomSwitch = ({ defaultChecked = false }) => (
  <input
    type="checkbox"
    defaultChecked={defaultChecked}
    className="w-10 h-5 rounded-full bg-gray-300 checked:bg-blue-600 relative appearance-none cursor-pointer transition-all duration-300 
    before:content-[''] before:absolute before:top-0.5 before:left-0.5 
    before:w-4 before:h-4 before:rounded-full before:bg-white 
    before:transition-all checked:before:translate-x-5"
  />
);

const Institution = () => {
  const cardOffset = 120;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar - hidden on mobile, shown on md and up */}
        <aside className="w-full md:w-64 bg-gray-100 dark:bg-gray-900">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-950 overflow-auto">
          {/* Profile Card */}
          <Card className="relative overflow-visible p-0 mt-16 md:mt-20">
            <div className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-700 dark:text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.243.72 5.879 1.933M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              <div className="mt-2 md:mt-3 text-center">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Narayanan Prabharan
                </h2>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">2422367</p>
              </div>
            </div>

            <div className="pt-28 md:pt-36 pb-4 md:pb-6" />
          </Card>

          {/* Cards Section */}
          <div className="space-y-6 md:space-y-10" style={{ marginTop: `${cardOffset}px` }}>
            {/* Basic Information */}
            <Card title="Basic Information">
              <CardContent className="space-y-4 mt-4 md:mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                    </p>
                    <p className="text-sm md:text-base text-gray-900 dark:text-white">
                      Narayanan Prabharan
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </p>
                    <p className="text-sm md:text-base text-gray-900 dark:text-white">
                      narayanan@example.com
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Student ID
                    </p>
                    <p className="text-sm md:text-base text-gray-900 dark:text-white">20251234</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card title="Privacy Settings">
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Only instructors can view my profile information
                  </p>
                  <CustomSwitch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card title="Global Notification Settings">
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Stream Notifications
                  </p>
                  <CustomSwitch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Email Notifications
                  </p>
                  <CustomSwitch />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Push Notifications
                  </p>
                  <CustomSwitch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Institution;