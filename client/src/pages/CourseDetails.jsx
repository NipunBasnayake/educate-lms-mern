import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { courses } from "../data/courses";

const CourseDetails = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState('overview');
  const [file, setFile] = useState(null);
  
  if (!course) return <div className="flex items-center justify-center h-screen">Course not found</div>;

  // Mock data for different sections
  const lessons = [
    { id: 1, title: "Introduction to Strategic Management", duration: "45 min", completed: true },
    { id: 2, title: "Industry Analysis Frameworks", duration: "60 min", completed: true },
    { id: 3, title: "Competitive Advantage Strategies", duration: "55 min", completed: false },
  ];

  const assessments = [
    { id: 1, title: "Week 1 Quiz", due: "Due tomorrow", status: "Pending" },
    { id: 2, title: "Case Study Analysis", due: "Due in 1 week", status: "Not Started" },
  ];

  const exams = [
    { id: 1, title: "Midterm Exam", date: "Oct 15, 2023", weight: "30%" },
    { id: 2, title: "Final Exam", date: "Dec 10, 2023", weight: "40%" },
  ];

  const studyMaterials = [
    { id: 1, title: "Strategic Management Textbook", type: "PDF", size: "4.2 MB" },
    { id: 2, title: "Case Study Collection", type: "ZIP", size: "12.1 MB" },
  ];

  const discussions = [
    { id: 1, title: "Question about Porter's Five Forces", author: "John D.", replies: 5 },
    { id: 2, title: "Week 2 Reading Discussion", author: "Prof. Wilson", replies: 12 },
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle file upload logic here
    alert(`File ${file.name} uploaded successfully!`);
    setFile(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>
      
      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        {/* Course Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-lg text-gray-600">{course.id} • {course.department}</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {course.credits} Credits
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {course.duration}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {course.schedule}
            </span>
          </div>
        </div>
        

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'lessons', 'assessments', 'exams', 'materials', 'discussions', 'assignments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Course Description</h2>
                <p className="text-gray-700">{course.description}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Instructor</h2>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <span className="text-indigo-800 font-medium text-lg">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.instructor}</p>
                    <p className="text-sm text-gray-500">{course.department} Department</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Learning Outcomes</h2>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {course.prerequisites.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Prerequisites</h2>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prereq) => (
                      <span 
                        key={prereq}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Course Lessons</h2>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${lesson.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {lesson.completed ? (
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-gray-500 font-medium">{lesson.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{lesson.duration}</p>
                      </div>
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                        {lesson.completed ? 'Review' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Assessments</h2>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{assessment.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{assessment.due}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assessment.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
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
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Exams</h2>
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Date: {exam.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Weight: {exam.weight}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Exam will cover all materials from weeks 1-6</p>
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                        Study Guide
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Study Materials</h2>
              <div className="space-y-4">
                {studyMaterials.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{material.title}</h3>
                        <p className="text-sm text-gray-500">{material.type} • {material.size}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Discussions</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  New Discussion
                </button>
              </div>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">{discussion.title}</h3>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm text-gray-500">Posted by {discussion.author}</p>
                      <p className="text-sm text-gray-500">{discussion.replies} replies</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Assignments</h2>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Submit Assignment</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="My Assignment Submission"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                    <div className="mt-1 flex items-center">
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Choose File
                        </span>
                        <input type="file" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <span className="ml-2 text-sm text-gray-500">
                        {file ? file.name : "No file chosen"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOCX, PPTX up to 10MB
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                    <textarea 
                      rows={3} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Any additional comments for the instructor..."
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!file}
                  >
                    Submit Assignment
                  </button>
                </form>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Previous Submissions</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500">No submissions yet</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;