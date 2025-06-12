import React, { useState } from "react";
import Lecsidebar from "../lecturepages/Lecsidebar";

const Leccorces = () => {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      title: "Introduction to React", 
      code: "CS101", 
      students: 50,
      description: "Learn the fundamentals of React including components, state, and props. Build your first React application in this comprehensive introductory course.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      state: "enabled"
    },
    { 
      id: 2, 
      title: "Advanced JavaScript", 
      code: "CS202", 
      students: 35,
      description: "Dive deep into JavaScript concepts like closures, prototypes, async/await. Master the language that powers modern web development.",
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      state: "disabled"
    },
    { 
      id: 3, 
      title: "Web Development", 
      code: "CS303", 
      students: 45,
      description: "Full-stack web development course covering HTML, CSS, JavaScript, and backend technologies. Build complete web applications from scratch.",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      state: "enabled"
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    students: "",
    description: "",
    image: "",
    state: "enabled"
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: event.target.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleCourseState = (courseId) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, state: course.state === "enabled" ? "disabled" : "enabled" }
          : course
      )
    );
  };

  const openCreateModal = () => {
    setCurrentCourse(null);
    setFormData({
      title: "",
      code: "",
      students: "",
      description: "",
      image: "",
      state: "enabled"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      students: course.students,
      description: course.description,
      image: course.image,
      state: course.state
    });
    setIsModalOpen(true);
  };

  const handleAccessCourse = (course) => {
    console.log("Accessing course:", course);
    alert(`Accessing course: ${course.title}`);
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
        description: formData.description,
        image: formData.image,
        state: formData.state
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
              + Add New Course
            </button>
          </div>
        </div>

        {(activeTab === "table" || activeTab === "both") && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Table View</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-200 text-neutral-700">
                    <th className="p-4">Image</th>
                    <th className="p-4">Course Title</th>
                    <th className="p-4">Course Code</th>
                    <th className="p-4">Students</th>
                    <th className="p-4">State</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={`table-${course.id}`}
                      className="border-t border-neutral-200 hover:bg-neutral-50"
                    >
                      <td className="p-4">
                        {course.image && (
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="p-4 font-medium">{course.title}</td>
                      <td className="p-4 text-neutral-600">{course.code}</td>
                      <td className="p-4">{course.students}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleCourseState(course.id)}
                          className={`px-3 py-1 rounded text-sm text-white ${
                            course.state === "enabled"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          {course.state === "enabled" ? "Disable" : "Enable"}
                        </button>
                      </td>
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
                  {course.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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
                      <div className="flex space-x-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {course.students} students
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            course.state === "enabled"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.state === "enabled" ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4 flex-1">
                      <p className="text-neutral-600 text-sm line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-end mt-auto pt-4 border-t border-neutral-100 space-x-2">
                      <button
                        onClick={() => toggleCourseState(course.id)}
                        className={`px-3 py-1 rounded text-sm text-white ${
                          course.state === "enabled"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {course.state === "enabled" ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleAccessCourse(course)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Access
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {currentCourse ? "Edit Course" : "Create New Course"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-neutral-700 mb-2">Course Image</label>
                    <div className="flex items-center space-x-4">
                      {formData.image && (
                        <img 
                          src={formData.image} 
                          alt="Course preview" 
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-neutral-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Or enter image URL:</p>
                        <input
                          type="text"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-2 border border-neutral-300 rounded mt-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-neutral-700 mb-2" htmlFor="title">
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
                    <label className="block text-neutral-700 mb-2" htmlFor="code">
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
                    <label className="block text-neutral-700 mb-2" htmlFor="students">
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
                  <div className="mb-4">
                    <label className="block text-neutral-700 mb-2" htmlFor="state">
                      Course State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-neutral-700 mb-2" htmlFor="description">
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