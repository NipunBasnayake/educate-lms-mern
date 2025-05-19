import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card"; // Adjust the path if needed

const Institution = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 dark:bg-gray-900">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 flex justify-center items-center bg-gray-50 dark:bg-gray-950">
          <Card
            variant="institution"
            className="max-w-2xl w-full"
            title="Profile Page"
            content="This is the main content area centered on the page."
            animate
          />
        </main>
      </div>
    
    </div>
  );
};

export default Institution;
