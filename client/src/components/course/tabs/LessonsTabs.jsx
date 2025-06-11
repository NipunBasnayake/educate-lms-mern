import React from "react";

const LessonsTab = ({ lessons }) => {

  // Function to handle opening a book on Open Library
  const handleViewBook = () => {
    window.open(`https://openlibrary.org/`, '_blank');
  };

  // Function to handle downloading (if available)
  const handleDownloadBook = () => {
    // Open Library doesn't always provide direct PDF downloads,
    // so we redirect to the book page where users can check availability
    window.open(`https://schoolict.net/download/Teacher%20Term%20Notes/13.docx`, '_blank');
  };

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
              <div className="flex space-x-2">
                {lesson.completed && (
                  <button 
                    onClick={() => handleDownloadBook(lesson.bookId)}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                    title="Check Download Options"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                )}
                <button 
                  onClick={() => lesson.completed ? handleViewBook(lesson.bookId) : null}
                  className={`px-3 py-1 rounded-md text-sm ${
                    lesson.completed 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!lesson.completed}
                >
                  {lesson.completed ? "Read Online" : "Start"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsTab;