import React from "react";

const MaterialsTab = ({ studyMaterials }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        Study Materials
      </h2>
      <div className="space-y-4">
        {studyMaterials.map((material) => (
          <div
            key={material.id}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{material.title}</h3>
                <p className="text-sm text-gray-500">
                  {material.type} • {material.size}
                </p>
              </div>
            </div>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
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
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsTab;