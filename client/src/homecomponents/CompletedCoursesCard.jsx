import React from 'react';

const courses = [
  {
    title: 'Advanced Data Structures',
    details: ['✔ Grade: A (95%)', '📅 Dec 2023'],
  },
  {
    title: 'Machine Learning',
    details: ['✔ Honors (Top 10%)', '📅 Mar 2024'],
  },
  {
    title: 'Web Development',
    details: ['✔ Capstone: A+', '📅 May 2024'],
  },
];

const CompletedCoursesCard = () => {
  return (
    <div className="bg-white border border-gray-300 shadow-sm p-6 rounded-xl flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Completed Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <h3 className="text-md font-semibold text-gray-800">{course.title}</h3>
              <div className="text-sm text-gray-600 mt-3 space-y-1">
                {course.details.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCoursesCard;
