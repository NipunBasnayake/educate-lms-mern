import React from 'react';

const categories = [
  {
    icon: "🎨",
    title: "Art & Illustration",
    courses: 2,
    color: "indigo",
  },
  {
    icon: "📈",
    title: "Digital Marketing",
    courses: 2,
    color: "green",
  },
  {
    icon: "🎨",
    title: "Graphic Design",
    courses: 1,
    color: "pink",
  },
  {
    icon: "📷",
    title: "Photography",
    courses: 3,
    color: "yellow",
  },
];

const TopCourseCategories = () => {
  return (
    <section className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center animate-slideIn">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Explore Top Course Categories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Discover trending subjects and find your passion.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <div className="mb-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold bg-${item.color}-100 text-${item.color}-600`}
                >
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-500 mt-1 mb-4">
                {item.courses} courses
              </p>
              <button
                className={`text-sm text-white bg-${item.color}-600 hover:bg-${item.color}-700 px-4 py-2 rounded-md`}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCourseCategories;
