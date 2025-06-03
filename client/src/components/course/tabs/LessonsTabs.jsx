import React from "react";

const LessonsTab = ({ lessons }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Course Lessons</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                  lesson.completed ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {lesson.completed ? (
                  <svg
                    className="h-6 w-6 text-green-600"
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
                ) : (
                  <span className="text-gray-500 font-medium">{lesson.id}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{lesson.duration}</p>
              </div>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                {lesson.completed ? "Review" : "Start"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsTab;