import React from "react";
import Lecsidebar from "../lecturepages/Lecsidebar";

const CoursesWithSidebar = () => {
  const courses = [
    { id: 1, title: "Introduction to React", code: "CS101", students: 50 },
    { id: 2, title: "Advanced JavaScript", code: "CS202", students: 35 },
    { id: 3, title: "Web Development", code: "CS303", students: 45 },
  ];

  // Placeholder logout function
  const handleLogout = () => {
    console.log("Logout triggered");
    // Add actual logout logic here
  };

  return (
    <div className="flex min-h-screen">
      <Lecsidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 bg-neutral-100">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">My Courses</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-200 text-neutral-700">
                <th className="p-4">Course Title</th>
                <th className="p-4">Course Code</th>
                <th className="p-4">Students Enrolled</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-neutral-200">
                  <td className="p-4">{course.title}</td>
                  <td className="p-4">{course.code}</td>
                  <td className="p-4">{course.students}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add New Course
        </button>
      </div>
    </div>
  );
};

export default CoursesWithSidebar;