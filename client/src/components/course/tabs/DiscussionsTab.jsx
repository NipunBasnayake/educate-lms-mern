import React from "react";

const DiscussionsTab = ({ discussions }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Discussions</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          New Discussion
        </button>
      </div>
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
              {discussion.title}
            </h3>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-500">
                Posted by {discussion.author}
              </p>
              <p className="text-sm text-gray-500">
                {discussion.replies} replies
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionsTab;