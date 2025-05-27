const ExamResults = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm h-full flex flex-col">
        {/* Card Title */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Exam Results</h3>
        </div>
        
        {/* Card Content */}
        <div className="flex flex-col gap-4 p-4">
          {/* Header with Summary Stats */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">
                Completed Exams: <span className="text-blue-600">5</span>
              </p>
              <p className="text-xs text-gray-500">Current GPA: 3.8/4.0</p>
            </div>
            <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition">
              View Transcript
            </button>
          </div>

          {/* Exam List */}
          <div className="space-y-3">
            {/* Exam Item 1 */}
            <div className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-sm">Capstone Project</p>
                <p className="text-xs text-gray-500">Final Year Research</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  A+
                </span>
                <button className="text-gray-400 hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Exam Item 2 */}
            <div className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition">
              <div>
                <p className="font-medium text-sm">Advanced Algorithms</p>
                <p className="text-xs text-gray-500">Theory Exam</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  A-
                </span>
                <button className="text-gray-400 hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons as 4 Cards */}
          <div className="grid grid-cols-4 gap-3 pt-3">
            {/* All Exams Card */}
            <div className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-xs mt-1">All Exams</span>
            </div>

            {/* Scores Card */}
            <div className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs mt-1">Scores</span>
            </div>

            {/* Feedback Card */}
            <div className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="text-xs mt-1">Feedback</span>
            </div>

            {/* Download Card */}
            <div className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
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
              <span className="text-xs mt-1">Download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;