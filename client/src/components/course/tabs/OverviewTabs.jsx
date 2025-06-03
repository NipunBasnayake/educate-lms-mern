import React from "react";

const OverviewTab = ({ course }) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Course Description
        </h2>
        <p className="text-gray-700">{course.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructor</h2>
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <span className="text-indigo-800 font-medium text-lg">
              {course.instructor
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{course.instructor}</p>
            <p className="text-sm text-gray-500">{course.department} Department</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Learning Outcomes
        </h2>
        <ul className="space-y-2">
          {course.learningOutcomes.map((outcome, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      {course.prerequisites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Prerequisites
          </h2>
          <div className="flex flex-wrap gap-2">
            {course.prerequisites.map((prereq) => (
              <span
                key={prereq}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
              >
                {prereq}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;