import React from 'react';

const CompletedAssessmentsCard = () => {
  return (
    <div className="flex flex-col bg-white border border-gray-300 shadow-sm rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Completed Assessments</h2>

      {/* Assessment Summary */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div>
          <p className="font-medium text-gray-800">Capstone Project</p>
          <p className="text-sm text-gray-500">Final year research project</p>
        </div>
        <div className="text-right">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            A+
          </span>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className="flex flex-col items-center justify-center p-2 bg-green-50 hover:bg-green-100 rounded-lg transition">
          <span className="text-green-600 text-lg">📅</span>
          <span className="text-xs font-medium mt-1">On-time</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition">
          <span className="text-yellow-600 text-lg">⏰</span>
          <span className="text-xs font-medium mt-1">Late</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
          <span className="text-blue-600 text-lg">📊</span>
          <span className="text-xs font-medium mt-1">Feedback</span>
        </button>
      </div>

      {/* View All Link */}
      <a
        href="#"
        className="text-xs text-center text-blue-600 hover:text-blue-800 hover:underline"
      >
        View all completed assessments →
      </a>
    </div>
  );
};

export default CompletedAssessmentsCard;
