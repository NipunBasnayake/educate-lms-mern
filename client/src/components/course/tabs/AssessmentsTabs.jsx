import React from "react";

const AssessmentsTab = ({ assessments }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Assessments</h2>
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{assessment.due}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  assessment.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {assessment.status}
              </span>
            </div>
            <div className="mt-4 flex space-x-3">
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                Start Assessment
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsTab;