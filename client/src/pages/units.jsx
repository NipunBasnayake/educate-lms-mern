import React from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

const Institution = () => {
  const cards = [
    {
      title: "Strategic Management",
      courseId: "BUS301",
      credits: 3,
      content: "Understand market forces and develop competitive strategies.",
    },
    {
      title: "Business Ethics",
      courseId: "BUS205",
      credits: 2,
      content: "Explore ethical decision-making in corporate environments.",
    },
    {
      title: "Marketing Analytics",
      courseId: "MKT310",
      credits: 3,
      content: "Use data to drive marketing decisions and measure impact.",
    },
    {
      title: "Operations Research",
      courseId: "OPS320",
      credits: 3,
      content:
        "Model business processes for better efficiency and productivity.",
    },
    {
      title: "Organizational Behavior",
      courseId: "HRM210",
      credits: 3,
      content:
        "Analyze how individuals and groups impact organizational dynamics.",
    },
    {
      title: "Financial Accounting",
      courseId: "ACC101",
      credits: 3,
      content: "Interpret financial statements and track business performance.",
    },
    {
      title: "Leadership & Influence",
      courseId: "HRM315",
      credits: 2,
      content: "Develop skills to lead teams and manage change.",
    },
    {
      title: "Innovation Management",
      courseId: "ENT302",
      credits: 2,
      content: "Foster creativity and bring new products to market.",
    },
    {
      title: "Supply Chain Management",
      courseId: "OPS410",
      credits: 3,
      content: "Coordinate logistics and inventory across global networks.",
    },
    {
      title: "Data-Driven Decision Making",
      courseId: "BUS350",
      credits: 3,
      content: "Leverage analytics for smarter business strategies.",
    },
    {
      title: "International Business",
      courseId: "BUS220",
      credits: 3,
      content: "Navigate global trade, markets, and cultural differences.",
    },
    {
      title: "Human Resource Strategy",
      courseId: "HRM405",
      credits: 3,
      content: "Align HR practices with organizational goals.",
    },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <Card>
          <div className="rounded-2xl border border-gray-300 bg-gray-5000 p-6 shadow-sm">
            <div className="mb- px-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Course Units
              </h2>
              <p className="text-sm text-gray-600">
                Your comprehensive guide to all available courses.
              </p>
            </div>

            <div className="mb-2 mx-auto pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="rounded-2xl shadow-sm border border-gray-200 bg-white p-6 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <h2 className="text-lg font-semibold mb-1">{card.title}</h2>

                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Course ID:</span>{" "}
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {card.courseId}
                      </span>
                    </p>

                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Credits:</span>{" "}
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {card.credits}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600 mb-4">{card.content}</p>
                    <div className="flex justify-end mt-auto">
                      <button className="text-sm px-4 py-1.5 bg-white text-blue-600 
                      border border-blue-600 rounded-md shadow-sm hover:bg-blue-600
                      hover:text-white transition duration-300 ease-in-out  
                      ">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Institution;
