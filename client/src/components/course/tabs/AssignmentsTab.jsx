import React, { useState, useEffect } from "react";

const AssignmentsTab = ({
  assignments,
  setAssignments,
  submissionStatus,
  formatDateTime,
}) => {
  const [files, setFiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [comments, setComments] = useState("");
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [submissionStatusState, setSubmissionStatusState] = useState({});
  const [timeRemaining, setTimeRemaining] = useState({});
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Calculate time remaining for each assignment
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const newTimeRemaining = {};

      assignments.forEach((assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const diff = dueDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[
            assignment.id
          ] = `${days}d ${hours}h ${minutes}m remaining`;
        } else {
          const lateBy = Math.abs(diff);
          const days = Math.floor(lateBy / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (lateBy % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((lateBy % (1000 * 60 * 60)) / (1000 * 60));
          newTimeRemaining[
            assignment.id
          ] = `Late by ${days}d ${hours}h ${minutes}m`;
        }
      });

      setTimeRemaining(newTimeRemaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [assignments]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handlePreviewFile = (file) => {
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("assignmentNumber", showUploadForm);
    formData.append("studentName", studentName);
    files.forEach((file) => formData.append("files", file));
    formData.append("comments", comments);

    const now = new Date();
    const submittedAt = now.toISOString();

    const assignment = assignments.find((a) => a.id === showUploadForm);
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
            files: files.map((file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
            })),
            lastModified: now.toISOString(),
            isLate: isLate,
            comments: comments,
            feedback: "",
            grade: "",
          };
        }
        return assignment;
      });

      setAssignments(updatedAssignments);
      setSubmissionStatusState({
        assignmentId: showUploadForm,
        files: files.map((file) => file.name),
        studentName,
        timestamp: now.toLocaleString(),
        status: status,
        isLate: isLate,
        dueDate: assignment.dueDate,
        comments: comments,
      });

      setShowSubmissionSuccess(true);
      setFiles([]);
      setStudentName("");
      setComments("");
      setShowUploadForm(null);

      setTimeout(() => {
        setShowSubmissionSuccess(false);
      }, 5000);
    }, 1000);
  };

  const handleGradeAssignment = (
    assignmentId,
    status,
    grade = null,
    feedback = ""
  ) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          status,
          grade: grade !== null ? grade : assignment.grade,
          feedback: feedback !== "" ? feedback : assignment.feedback,
        };
      }
      return assignment;
    });
    setAssignments(updatedAssignments);
    setSelectedAssignment(null);
    setGrade("");
    setFeedback("");
  };

  const getAssignmentStatusColor = (status) => {
    switch (status) {
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

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Assignments</h2>

      {!showUploadForm && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {formatDateTime(assignment.dueDate)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      timeRemaining[assignment.id]?.includes("Late")
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {timeRemaining[assignment.id]}
                  </p>
                  {assignment.submittedAt ? (
                    <p className="text-sm mt-1">
                      Submitted: {formatDateTime(assignment.submittedAt)}
                    </p>
                  ) : (
                    <p className="text-sm mt-1 text-gray-500">Not Submitted</p>
                  )}
                  {assignment.grade && (
                    <p className="text-sm mt-1 font-medium">
                      Grade: {assignment.grade}
                    </p>
                  )}
                  <button
                    onClick={() => handleViewDetails(assignment)}
                    className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    View Details
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center"
                  onClick={() =>
                    window.open("/sample-assignment.pdf", "_blank")
                  }
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
                  {assignment.status.startsWith("Submitted")
                    ? "Resubmit"
                    : "Upload"}
                </button>

                {(assignment.status === "Submitted On Time" ||
                  assignment.status === "Submitted Late" ||
                  assignment.status === "Not Graded") && (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                    onClick={() => handleViewDetails(assignment)}
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Grade Assignment
                  </button>
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
                setFiles([]);
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
            {/* Student Name Field */}
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

            {/* File Upload Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Files (Multiple allowed)
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Choose Files
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                    required={files.length === 0}
                  />
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  {files.length > 0
                    ? `${files.length} files selected`
                    : "No files chosen"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOCX, PPTX, JPG, PNG up to 10MB each
              </p>

              {/* Selected Files List */}
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handlePreviewFile(file)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          {file.name}
                        </button>
                        <span className="ml-2 text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="h-4 w-4"
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
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(null);
                  setFiles([]);
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
                disabled={!files.length || !studentName}
              >
                Submit Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment Details/Grading Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAssignment.title} - Submission Details
              </h3>
              <button
                onClick={() => setSelectedAssignment(null)}
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

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">
                  Student Information
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by:{" "}
                  {selectedAssignment.studentName || "Not available"}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted on:{" "}
                  {formatDateTime(selectedAssignment.submittedAt) ||
                    "Not submitted"}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getAssignmentStatusColor(
                      selectedAssignment.status
                    )}`}
                  >
                    {selectedAssignment.status}
                  </span>
                </p>
              </div>

              {selectedAssignment.files &&
                selectedAssignment.files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700">
                      Submitted Files
                    </h4>
                    <div className="mt-2 space-y-2">
                      {selectedAssignment.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          <button
                            onClick={() =>
                              window.open(URL.createObjectURL(file), "_blank")
                            }
                            className="ml-auto text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedAssignment.comments && (
                <div>
                  <h4 className="font-medium text-gray-700">
                    Student Comments
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    {selectedAssignment.comments}
                  </p>
                </div>
              )}

              {(selectedAssignment.status === "Submitted On Time" ||
                selectedAssignment.status === "Submitted Late" ||
                selectedAssignment.status === "Not Graded") && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700">
                    Grade Assignment
                  </h4>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter grade (e.g., A, 95/100)"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feedback
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Provide feedback to the student..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setSelectedAssignment(null)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleGradeAssignment(
                            selectedAssignment.id,
                            "Graded",
                            grade,
                            feedback
                          )
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={!grade}
                      >
                        Submit Grade
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedAssignment.status === "Graded" && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700">
                    Grading Information
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Grade:{" "}
                    <span className="font-medium">
                      {selectedAssignment.grade}
                    </span>
                  </p>
                  {selectedAssignment.feedback && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        Feedback:
                      </h5>
                      <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                        {selectedAssignment.feedback}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        handleGradeAssignment(
                          selectedAssignment.id,
                          "Not Graded"
                        )
                      }
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                    >
                      Reopen for Grading
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showFilePreview && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                File Preview: {previewFile.name}
              </h3>
              <button
                onClick={() => setShowFilePreview(false)}
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
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(previewFile)}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <div className="text-center py-10">
                  <svg
                    className="h-12 w-12 mx-auto text-gray-400"
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
                  <p className="mt-2 text-sm text-gray-500">
                    Preview not available for this file type. Download to view.
                  </p>
                  <button
                    onClick={() =>
                      window.open(URL.createObjectURL(previewFile), "_blank")
                    }
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-medium text-gray-900 mb-4">Submission History</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          {submissionStatus.assignmentId ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="font-medium">
                    Assignment {submissionStatus.assignmentId}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      submissionStatus.isLate
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {submissionStatus.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted by: {submissionStatus.studentName}
                </p>
                {submissionStatus.files &&
                  submissionStatus.files.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">Files:</p>
                      <ul className="list-disc list-inside text-sm text-gray-500 ml-2">
                        {submissionStatus.files.map((file, index) => (
                          <li key={index}>{file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center ${
              submissionStatusState.isLate ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
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
                d={
                  submissionStatusState.isLate
                    ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    : "M5 13l4 4L19 7"
                }
              />
            </svg>
            <div>
              <p className="font-medium">
                {submissionStatusState.isLate
                  ? "Late Submission!"
                  : "Assignment Submitted Successfully!"}
              </p>
              <p className="text-sm">
                {submissionStatusState.files?.join(", ")} has been uploaded for
                Assignment {submissionStatusState.assignmentId}
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
