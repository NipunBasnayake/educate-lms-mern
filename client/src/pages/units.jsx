import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { assignment } from "../data/updateAssignmentn";

const Units = () => {
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [progressData, setProgressData] = useState({});

  const cards = [
    {
      title: "Strategic Management",
      courseId: "BUS301",
      credits: 3,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      // Source: Unsplash, no attribution required
    },
    {
      title: "Business Ethics",
      courseId: "BUS205",
      credits: 2,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      // Source: Unsplash, no attribution required
    },
    {
      title: "Marketing Analytics",
      courseId: "MKT310",
      credits: 3,
      image: "https://img.freepik.com/free-photo/business-teamwork-join-hands-together_53876-135517.jpg?size=626&ext=jpg",
      // Source: Unsplash, no attribution required
    },
    {
      title: "Operations Research",
      courseId: "OPS320",
      credits: 3,
      image: "https://img.freepik.com/free-photo/business-teamwork-join-hands-together_53876-135517.jpg?size=626&ext=jpg",
      // Source: Pixabay, no attribution required
    },
    {
      title: "Organizational Behavior",
      courseId: "HRM210",
      credits: 3,
      image: "https://img.freepik.com/free-photo/business-teamwork-join-hands-together_53876-135517.jpg?size=626&ext=jpg",
      // Source: Freepik, attribution required: "Designed by Freepik"
    },
    {
      title: "Financial Accounting",
      courseId: "ACC101",
      credits: 3,
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      // Source: Unsplash, no attribution required
    },
    {
      title: "Leadership & Influence",
      courseId: "HRM315",
      credits: 2,
      image: "https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_1280.jpg",
      // Source: Pixabay, no attribution required
    },
    {
      title: "Innovation Management",
      courseId: "ENT302",
      credits: 2,
      image: "https://img.freepik.com/free-photo/light-bulb-ideas-creative-diagram-concept_53876-144053.jpg?size=626&ext=jpg",
      // Source: Freepik, attribution required: "Designed by Freepik"
    },
    {
      title: "Supply Chain Management",
      courseId: "OPS410",
      credits: 3,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      // Source: Unsplash, no attribution required
    },
    {
      title: "Data-Driven Decision Making",
      courseId: "BUS350",
      credits: 3,
      image: "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg",
      // Source: Pixabay, no attribution required
    },
    {
      title: "International Business",
      courseId: "BUS220",
      credits: 3,
      image: "https://img.freepik.com/free-photo/global-business-internet-network-connection_53876-124672.jpg?size=626&ext=jpg",
      // Source: Freepik, attribution required: "Designed by Freepik"
    },
    {
      title: "Human Resource Strategy",
      courseId: "HRM405",
      credits: 3,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      // Source: Unsplash, no attribution required
    },
  ];

  // Calculate progress metrics
  const calculateProgress = (enrolled, progress) => {
    const enrolledCards = cards.filter(course => enrolled[course.courseId]);
    
    const activeCourses = enrolledCards.length;
    const now = new Date();
    const upcomingDeadlines = assignment.filter(
      (a) => a.dueDate && a.dueDate > now && a.dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;
    const avgProgress = enrolledCards.length > 0 
      ? Math.round(
          enrolledCards.reduce((sum, course) => sum + (progress[course.courseId] || 0), 0) / enrolledCards.length
        ) 
      : 0;

    return { activeCourses, upcomingDeadlines, avgProgress };
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
    
    const { activeCourses, upcomingDeadlines, avgProgress } = calculateProgress(initialEnrolled, initialProgress);
    setEnrolledCourses(prev => ({ ...prev, activeCourses }));
    setProgressData(prev => ({ ...prev, upcomingDeadlines, avgProgress }));
  }, []);

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
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Active Courses</h3>
                <p className="text-2xl font-bold text-green-600">
                  {enrolledCourses.activeCourses || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">Upcoming Deadlines</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {progressData.upcomingDeadlines || 0}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Average Course Progress</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {progressData.avgProgress || 0}%
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
                      <img 
                        src={card.image}
                        alt={`${card.title} course`}
                        className="w-full h-32 object-cover rounded-lg mb-4" />
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
            <div className="text-xs text-gray-500 mt-4">
              Images sourced from Freepik, Unsplash, and Pixabay. Freepik images: Designed by Freepik.
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Units;