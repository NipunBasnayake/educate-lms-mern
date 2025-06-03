import React from "react";

const ExamsTab = ({ exams }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Exams</h2>
      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Date: {exam.date}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Weight: {exam.weight}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Exam will cover all materials from weeks 1-6
              </p>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                Study Guide
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsTab;