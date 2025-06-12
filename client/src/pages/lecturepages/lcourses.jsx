import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LecSidebar from "../lecturepages/Lecsidebar";

const Leccourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    students: "",
    state: "enabled",
  });
  const [activeTab, setActiveTab] = useState("both");
  const navigate = useNavigate();
  const BASE_URL = "{{baseUrl}}"; // Replace with actual API base URL

  // GET: Fetch instructor ID
  useEffect(() => {
    const fetchInstructorId = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) {
          throw new Error("No authentication token found.");
        }
        const response = await axios.get(`${BASE_URL}auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInstructorId(response.data._id);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to fetch instructor profile. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    };
    fetchInstructorId();
  }, [navigate]);

  // GET: Fetch courses
  useEffect(() => {
    if (!instructorId) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await axios.get(`${BASE_URL}instructors/${instructorId}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedCourses = Array.isArray(response.data)
          ? response.data
          : response.data.courses || response.data.data?.courses || [];
        setCourses(fetchedCourses); // Update state with fetched courses
        setLoading(false);
      } catch (err) {
        console.error("Courses fetch error:", err);
        setError(err.message || "Failed to fetch courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, [instructorId]);

  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCourseState = (courseId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course._id === courseId
          ? { ...course, state: course.state === "enabled" ? "disabled" : "enabled" }
          : course
      )
    );
    // Note: Optionally send a PUT request to update state on backend
  };

  const openCreateModal = () => {
    setCurrentCourse(null);
    setFormData({
      title: "",
      code: "",
      description: "",
      students: "",
      state: "enabled",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      description: course.description,
      students: course.students,
      state: course.state,
    });
    setIsModalOpen(true);
  };

  // POST: Create new course
  // PUT: Update existing course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const courseData = {
        ...formData,
        students: parseInt(formData.students),
        instructor: instructorId,
      };

      if (currentCourse) {
        // PUT: Update course
        const response = await axios.put(
          `${BASE_URL}instructors/${instructorId}/courses/${currentCourse._id}`,
          courseData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses((prev) =>
          prev.map((course) => (course._id === currentCourse._id ? response.data : course))
        ); // Update state with modified course
      } else {
        // POST: Create course
        const response = await axios.post(
          `${BASE_URL}instructors/${instructorId}/courses`,
          courseData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses((prev) => [...prev, response.data]); // Append new course to state
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Course save error:", err);
      setError(err.message || "Failed to save course");
    }
  };

  // DELETE: Remove course
  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        await axios.delete(`${BASE_URL}instructors/${instructorId}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses((prev) => prev.filter((course) => course._id !== courseId)); // Remove deleted course from state
      } catch (err) {
        console.error("Course delete error:", err);
        setError(err.message || "Failed to delete course");
      }
    }
  };

  const handleAccessCourse = (course) => {
    console.log("Accessing course:", course);
    alert(`Accessing course: ${course.title}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 h-full w-64 z-50">
          <LecSidebar onLogout={handleLogout} />
        </div>
        <div className="flex-1 ml-64 p-6">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 h-full w-64 z-50">
          <LecSidebar onLogout={handleLogout} />
        </div>
        <div className="flex-1 ml-64 p-6 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 h-full w-64 z-50">
        <LecSidebar onLogout={handleLogout} />
      </div>
      <div className="flex-1 ml-64 bg-neutral-100 overflow-x-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">My Courses</h2>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab("table")}
                  className={`px-3 py-2 text-sm sm:px-4 sm:text-base ${
                    activeTab === "table" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setActiveTab("cards")}
                  className={`px-3 py-2 text-sm sm:px-4 sm:text-base ${
                    activeTab === "cards" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setActiveTab("both")}
                  className={`px-3 py-2 text-sm sm:px-4 sm:text-base ${
                    activeTab === "both" ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  Both
                </button>
              </div>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                + Add New Course
              </button>
            </div>
          </div>

          {(activeTab === "table" || activeTab === "both") && (
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Table View</h3>
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-neutral-200 text-neutral-700">
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">Course Title</th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">Course Code</th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">Students</th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">Actions</th>
                      <th className="p-3 sm:p-4 text-center text-sm sm:text-base">State Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={`table-${course._id}`}
                        className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="p-3 sm:p-4 font-medium text-sm sm:text-base text-center">
                          {course.title}
                        </td>
                        <td className="p-3 sm:p-4 text-neutral-600 text-sm sm:text-base text-center">
                          {course.code}
                        </td>
                        <td className="p-3 sm:p-4 text-sm sm:text-base text-center">
                          {course.students}
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(course)}
                              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                              aria-label={`Edit course ${course.title}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                              aria-label={`Delete course ${course.title}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={course.state === "enabled"}
                              onChange={() => toggleCourseState(course._id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                            <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:translate-x-4 sm:peer-checked:translate-x-5 transition-transform duration-200"></div>
                          </label>
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
              <h3 className="text-base sm:text-lg font-semibold mb-4">Card View</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {courses.map((course) => (
                  <div
                    key={`card-${course._id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                  >
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-1">
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
                          onClick={() => handleAccessCourse(course)}
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md my-8">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">
                    {currentCourse ? "Edit Course" : "Create New Course"}
                  </h3>
                  <form onSubmit={handleSubmit}>
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
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-neutral-700 mb-2" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-neutral-700 mb-2" htmlFor="state">
                        State Control
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      >
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-3 py-1 sm:px-4 sm:py-2 text-neutral-700 border border-neutral-300 rounded hover:bg-neutral-100 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
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
    </div>
  );
};

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 p-6 text-red-600">
          Something went wrong: {this.state.error?.message || "Unknown error"}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function WrappedLeccourses() {
  return (
    <ErrorBoundary>
      <Leccourses />
    </ErrorBoundary>
  );
}