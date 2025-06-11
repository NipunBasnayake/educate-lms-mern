import React, { useState } from "react";
import Lecsidebar from "../lecturepages/Lecsidebar";

const Leccorces = () => {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      title: "Introduction to React", 
      code: "CS101", 
      students: 50,
      description: "Learn the fundamentals of React including components, state, and props. Build your first React application in this comprehensive introductory course."
    },
    { 
      id: 2, 
      title: "Advanced JavaScript", 
      code: "CS202", 
      students: 35,
      description: "Dive deep into JavaScript concepts like closures, prototypes, async/await. Master the language that powers modern web development."
    },
    { 
      id: 3, 
      title: "Web Development", 
      code: "CS303", 
      students: 45,
      description: "Full-stack web development course covering HTML, CSS, JavaScript, and backend technologies. Build complete web applications from scratch."
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    students: "",
    description: ""
  });
  const [activeTab, setActiveTab] = useState("both");

  const handleLogout = () => {
    console.log("Logout triggered");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openCreateModal = () => {
    setCurrentCourse(null);
    setFormData({
      title: "",
      code: "",
      students: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      students: course.students,
      description: course.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentCourse) {
      // Update existing course
      const updatedCourses = courses.map((course) =>
        course.id === currentCourse.id ? { ...course, ...formData } : course
      );
      setCourses(updatedCourses);
    } else {
      // Create new course
      const newCourse = {
        id: Date.now(),
        title: formData.title,
        code: formData.code,
        students: parseInt(formData.students),
        description: formData.description
      };
      setCourses([...courses, newCourse]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== courseId));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Lecsidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 bg-neutral-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">My Courses</h2>
          <div className="flex space-x-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("table")}
                className={`px-4 py-2 ${
                  activeTab === "table" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setActiveTab("cards")}
                className={`px-4 py-2 ${
                  activeTab === "cards" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setActiveTab("both")}
                className={`px-4 py-2 ${
                  activeTab === "both" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                Both
              </button>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add New Course
            </button>
          </div>
        </div>

        {(activeTab === "table" || activeTab === "both") && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Table View</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-200 text-neutral-700">
                    <th className="p-4">Course Title</th>
                    <th className="p-4">Course Code</th>
                    <th className="p-4">Students</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={`table-${course.id}`}
                      className="border-t border-neutral-200 hover:bg-neutral-50"
                    >
                      <td className="p-4 font-medium">{course.title}</td>
                      <td className="p-4 text-neutral-600">{course.code}</td>
                      <td className="p-4">{course.students}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === "cards" || activeTab === "both") && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Card View</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={`card-${course.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-800 mb-1">
                          {course.title}
                        </h3>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          {course.code}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {course.students} students
                      </span>
                    </div>
                    
                    <div className="mb-4 flex-1">
                      <p className="text-neutral-600 text-sm line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-neutral-100">
                      <button
                        onClick={() => openEditModal(course)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                      >
                        Edit Course
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Create/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {currentCourse ? "Edit Course" : "Create New Course"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-neutral-700 mb-2"
                      htmlFor="title"
                    >
                      Course Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-neutral-700 mb-2"
                      htmlFor="code"
                    >
                      Course Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-neutral-700 mb-2"
                      htmlFor="students"
                    >
                      Students Enrolled
                    </label>
                    <input
                      type="number"
                      id="students"
                      name="students"
                      value={formData.students}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-neutral-700 mb-2"
                      htmlFor="description"
                    >
                      Course Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded hover:bg-neutral-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {currentCourse ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leccorces;