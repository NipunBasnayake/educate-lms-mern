import React, { useState, useEffect } from "react";

const AssignmentsTab = ({
  assignments,
  setAssignments,
  submissionStatus,
  formatDateTime,
}) => {
  const [file, setFile] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [comments, setComments] = useState("");
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [submissionStatusState, setSubmissionStatusState] = useState({});
  const [timeRemaining, setTimeRemaining] = useState({});

  // Calculate time remaining for each assignment
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const newTimeRemaining = {};
      
      assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const diff = dueDate - now;
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          newTimeRemaining[assignment.id] = `${days}d ${hours}h remaining`;
        } else {
          const lateBy = Math.abs(diff);
          const days = Math.floor(lateBy / (1000 * 60 * 60 * 24));
          const hours = Math.floor((lateBy % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          newTimeRemaining[assignment.id] = `Late by ${days}d ${hours}h`;
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 3600000); // Update every hour
    
    return () => clearInterval(interval);
  }, [assignments]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("assignmentNumber", showUploadForm);
    formData.append("studentName", studentName);
    formData.append("file", file);
    formData.append("comments", comments);

    const now = new Date();
    const submittedAt = now.toISOString();
    
    const assignment = assignments.find(a => a.id === showUploadForm);
    const dueDate = new Date(assignment.dueDate);
    
    const isLate = now > dueDate;
    const status = isLate ? "Submitted Late" : "Submitted On Time";

    setTimeout(() => {
      const updatedAssignments = assignments.map((assignment) => {
        if (assignment.id === showUploadForm) {
          return { 
            ...assignment, 
            status: status,
            submittedAt: submittedAt,
            studentName: studentName,
            fileName: file.name,
            lastModified: now.toISOString(),
            isLate: isLate,
            comments: comments
          };
        }
        return assignment;
      });

      setAssignments(updatedAssignments);
      setSubmissionStatusState({
        assignmentId: showUploadForm,
        fileName: file.name,
        studentName,
        timestamp: now.toLocaleString(),
        status: status,
        isLate: isLate,
        dueDate: assignment.dueDate,
        comments: comments
      });

      setShowSubmissionSuccess(true);
      setFile(null);
      setStudentName("");
      setComments("");
      setShowUploadForm(null);

      setTimeout(() => {
        setShowSubmissionSuccess(false);
      }, 5000);
    }, 1000);
  };

  const handleGradeAssignment = (assignmentId, status) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === assignmentId) {
        return { ...assignment, status };
      }
      return assignment;
    });
    setAssignments(updatedAssignments);
  };

  const getAssignmentStatusColor = (status) => {
    switch(status) {
      case "Submitted On Time":
        return "bg-green-100 text-green-800";
      case "Submitted Late":
        return "bg-red-100 text-red-800";
      case "Graded":
        return "bg-purple-100 text-purple-800";
      case "Not Graded":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Assignments</h2>

      {!showUploadForm && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {formatDateTime(assignment.dueDate)}
                  </p>
                  <p className="text-xs mt-1">
                    {timeRemaining[assignment.id]}
                  </p>
                  {assignment.submittedAt && (
                    <p className="text-sm mt-1">
                      Submitted: {formatDateTime(assignment.submittedAt)}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getAssignmentStatusColor(assignment.status)
                  }`}
                >
                  {assignment.status}
                </span>
              </div>

              <div className="mt-4 flex space-x-2 flex-wrap gap-2">
                <button
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
                  onClick={() => window.open("/sample-assignment.pdf", "_blank")}
                >
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

                <button
                  className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 flex items-center"
                  onClick={() => setShowUploadForm(assignment.id)}
                >
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {assignment.status.startsWith("Submitted") ? "Resubmit" : "Upload"}
                </button>

                {(assignment.status === "Submitted On Time" || assignment.status === "Submitted Late" || assignment.status === "Not Graded") && (
                  <>
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                      onClick={() => handleGradeAssignment(assignment.id, "Graded")}
                    >
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Mark as Graded
                    </button>
                    <button
                      className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 flex items-center"
                      onClick={() => handleGradeAssignment(assignment.id, "Not Graded")}
                    >
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Mark as Not Graded
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Submit Assignment {showUploadForm}
            </h3>
            <button
              onClick={() => {
                setShowUploadForm(null);
                setFile(null);
                setStudentName("");
                setComments("");
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Choose File
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <span className="ml-2 text-sm text-gray-500 truncate max-w-xs">
                  {file ? file.name : "No file chosen"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOCX, PPTX up to 10MB
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any additional comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(null);
                  setFile(null);
                  setStudentName("");
                  setComments("");
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!file || !studentName}
              >
                Submit Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h3 className="font-medium text-gray-900 mb-4">Submission History</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          {submissionStatus.assignmentId ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Assignment {submissionStatus.assignmentId}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    submissionStatus.isLate
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {submissionStatus.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by: {submissionStatus.studentName}
                </p>
                <p className="text-sm text-gray-500">
                  File: {submissionStatus.fileName}
                </p>
                <p className="text-sm text-gray-500">
                  Due Date: {submissionStatus.dueDate}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted on: {submissionStatus.timestamp}
                </p>
                {submissionStatus.comments && (
                  <p className="text-sm text-gray-500 mt-1">
                    Comments: {submissionStatus.comments}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No submissions yet</p>
          )}
        </div>
      </div>

      {showSubmissionSuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${
            submissionStatusState.isLate ? "bg-red-500" : "bg-green-500"
          } text-white`}>
            <svg
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={submissionStatusState.isLate ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M5 13l4 4L19 7"}
              />
            </svg>
            <div>
              <p className="font-medium">
                {submissionStatusState.isLate ? "Late Submission!" : "Assignment Submitted Successfully!"}
              </p>
              <p className="text-sm">
                {submissionStatusState.fileName} has been uploaded for Assignment {submissionStatusState.assignmentId}
              </p>
            </div>
            <button
              onClick={() => setShowSubmissionSuccess(false)}
              className="ml-4 text-green-100 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;