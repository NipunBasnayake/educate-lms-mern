import React from 'react';
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';

const courses = [
  {
    id: 'CS501',
    title: 'Advanced Data Structures',
    details: ['✔ Grade: A (95%)', '📅 Dec 2023'],
    description: 'Mastered complex data structures and algorithms with practical implementations.',
    image: img1
  },
  {
    id: 'CS502',
    title: 'Machine Learning',
    details: ['✔ Honors (Top 10%)', '📅 Mar 2024'],
    description: 'Developed predictive models using supervised and unsupervised learning techniques.',
    image: img2
  },
  {
    id: 'CS503',
    title: 'Web Development',
    details: ['✔ Capstone: A+', '📅 May 2024'],
    description: 'Built full-stack applications with modern frameworks and responsive design.',
    image: img3
  },
];

const CompletedCoursesCard = () => {
  return (
    <div className="bg-white bordershadow-sm p-2 rounded-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Completed Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Top: Title */}
            <h3 className="text-md font-semibold text-gray-800 mb-2">{course.title}</h3>
            
            {/* Middle: Course Image */}
            <div className="my-3 flex justify-center h-40 overflow-hidden rounded-md">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            
            {/* Details */}
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {course.details.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            
            {/* Bottom: ID and Description with See Details button */}
            <div className="mt-auto space-y-2">
              <p className="text-xs font-mono text-gray-500">ID: {course.id}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              <div className="flex justify-end">
                <button 
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                  onClick={() => console.log(`Details for ${course.id}`)}
                >
                  See Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedCoursesCard;