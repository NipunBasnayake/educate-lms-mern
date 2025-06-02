import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { Link } from "react-router-dom";

const Institution = () => {
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [progressData, setProgressData] = useState({});
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

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
      content: "Model business processes for better efficiency and productivity.",
    },
    {
      title: "Organizational Behavior",
      courseId: "HRM210",
      credits: 3,
      content: "Analyze how individuals and groups impact organizational dynamics.",
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

  // Calculate progress metrics
  const calculateProgress = (enrolled, progress) => {
    const enrolledCards = cards.filter(course => enrolled[course.courseId]);
    
    // Calculate total and completed credits
    const total = enrolledCards.reduce((sum, course) => sum + course.credits, 0);
    const completed = enrolledCards.reduce((sum, course) => 
      progress[course.courseId] === 100 ? sum + course.credits : sum, 0);
    
    // Calculate weighted overall progress
    let weightedProgress = 0;
    let totalPossibleWeight = 0;
    
    enrolledCards.forEach(course => {
      weightedProgress += (progress[course.courseId] / 100) * course.credits;
      totalPossibleWeight += course.credits;
    });
    
    const overall = totalPossibleWeight > 0 ? Math.round((weightedProgress / totalPossibleWeight) * 100) : 0;
    
    setTotalCredits(total);
    setCompletedCredits(completed);
    setOverallProgress(overall);
  };

  // Initialize progress data
  useEffect(() => {
    const initialProgress = {};
    const initialEnrolled = {};
    cards.forEach(course => {
      initialProgress[course.courseId] = Math.floor(Math.random() * 100);
      initialEnrolled[course.courseId] = Math.random() > 0.3;
    });
    setProgressData(initialProgress);
    setEnrolledCourses(initialEnrolled);
    calculateProgress(initialEnrolled, initialProgress);
  }, []);

  const handleEnrollToggle = (courseId) => {
    setEnrolledCourses(prev => {
      const newEnrolled = {...prev, [courseId]: !prev[courseId]};
      calculateProgress(newEnrolled, progressData);
      return newEnrolled;
    });
  };

  const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        {/* Progress Summary Card */}
        <Card className="mb-6">
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Course Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Enrolled Courses</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(enrolledCourses).filter(Boolean).length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Credits Completed</h3>
                <p className="text-2xl font-bold text-green-600">
                  {completedCredits} / {totalCredits}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Overall Progress</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {overallProgress}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Courses Card */}
        <Card>
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">
            <div className="px-2">
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
                    className={`rounded-2xl shadow-sm border ${enrolledCourses[card.courseId] ? 'border-blue-300' : 'border-gray-200'} bg-white p-6 hover:shadow-md transition flex flex-col justify-between`}
                  >
                    <div>
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
                    </div>

                    {enrolledCourses[card.courseId] && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{progressData[card.courseId]}%</span>
                        </div>
                        <ProgressBar progress={progressData[card.courseId]} />
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-auto">
                      <button
                        onClick={() => handleEnrollToggle(card.courseId)}
                        className={`text-sm px-3 py-1 rounded-md ${enrolledCourses[card.courseId] 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                      >
                        {enrolledCourses[card.courseId] ? 'Unenroll' : 'Enroll'}
                      </button>
                      
                      <Link
                        to={`/course/${card.courseId}`}
                        state={{ course: card }}
                        className="text-sm px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                      >
                        View
                      </Link>
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