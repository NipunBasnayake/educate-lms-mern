import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { courses } from "../data/courses";
import CourseHeader from "../components/course/CourseHeaders";
import CourseTabs from "../components/course/CourseTabs";
import OverviewTab from "../components/course/tabs/OverviewTabs";
import LessonsTab from "../components/course/tabs/LessonsTabs";
import AssessmentsTab from "../components/course/tabs/AssessmentsTabs";
import ExamsTab from "../components/course/tabs/ExamsTab";
import MaterialsTab from "../components/course/tabs/MaterialsTab";
import DiscussionsTab from "../components/course/tabs/DiscussionsTab";
import AssignmentsTab from "../components/course/tabs/AssignmentsTab";
import OnlineSessionTab from "../components/course/tabs/OnlineSessionTabs";

const CourseDetails = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState("overview");
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Assignment 1",
      dueDate: "jun 09, 2025 12:00",
      status: "Not Submitted",
      submittedAt: null,
    },
    {
      id: 2,
      title: "Assignment 2",
      dueDate: "Oct 24, 2023 23:59",
      status: "Not Submitted",
      submittedAt: null,
    },
    {
      id: 3,
      title: "Assignment 3",
      dueDate: "Nov 7, 2023 23:59",
      status: "Not Submitted",
      submittedAt: null,
    },
    {
      id: 4,
      title: "Assignment 4",
      dueDate: "Nov 21, 2023 23:59",
      status: "Not Submitted",
      submittedAt: null,
    },
  ]);

  const [submissionStatus] = useState({});

  // Mock data for different sections
  const lessons = [
    {
      id: 1,
      title: "Introduction to Strategic Management",
      duration: "45 min",
      completed: true,
    },
    {
      id: 2,
      title: "Industry Analysis Frameworks",
      duration: "60 min",
      completed: true,
    },
    {
      id: 3,
      title: "Competitive Advantage Strategies",
      duration: "55 min",
      completed: false,
    },
  ];

  const assessments = [
    { id: 1, title: "Week 1 Quiz", due: "Due tomorrow", status: "Pending" },
    {
      id: 2,
      title: "Case Study Analysis",
      due: "Due in 1 week",
      status: "Not Started",
    },
  ];

  const exams = [
    { id: 1, title: "Midterm Exam", date: "Oct 15, 2023", weight: "30%" },
    { id: 2, title: "Final Exam", date: "Dec 10, 2023", weight: "40%" },
  ];

  const studyMaterials = [
    {
      id: 1,
      title: "Strategic Management Textbook",
      type: "PDF",
      size: "4.2 MB",
    },
    { id: 2, title: "Case Study Collection", type: "ZIP", size: "12.1 MB" },
  ];

  const discussions = [
    {
      id: 1,
      title: "Question about Porter's Five Forces",
      author: "John D.",
      replies: 5,
    },
    {
      id: 2,
      title: "Week 2 Reading Discussion",
      author: "Prof. Wilson",
      replies: 12,
    },
  ];

  const onlineSessions = [
    {
      id: 1,
      title: "Live Q&A Session",
      date: "Oct 10, 2023",
      time: "14:00 - 15:30",
      instructor: "Prof. Wilson",
      meetingLink: "https://meet.example.com/abc123",
    },
    {
      id: 2,
      title: "Guest Lecture: Industry Trends",
      date: "Oct 24, 2023",
      time: "10:00 - 11:30",
      instructor: "Dr. Smith (Guest)",
      meetingLink: "https://meet.example.com/xyz456",
    },
  ];

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!course)
    return (
      <div className="flex items-center justify-center h-screen">
        Course not found
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <aside className="fixed top-0 left-0 z-10 w-64 h-full">
        <Sidebar />
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-6 pt-10 ml-0 md:ml-64">
        <CourseHeader course={course} />
        <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "overview" && <OverviewTab course={course} />}
          {activeTab === "lessons" && <LessonsTab lessons={lessons} />}
          {activeTab === "Quizes" && (
            <AssessmentsTab assessments={assessments} />
          )}
          {activeTab === "exams" && <ExamsTab exams={exams} />}
          {activeTab === "materials" && (
            <MaterialsTab studyMaterials={studyMaterials} />
          )}
          {activeTab === "discussions" && (
            <DiscussionsTab discussions={discussions} />
          )}
          {activeTab === "assignments" && (
            <AssignmentsTab
              assignments={assignments}
              setAssignments={setAssignments}
              submissionStatus={submissionStatus}
              formatDateTime={formatDateTime}
            />
          )}
          {activeTab === "online-session" && (
            <OnlineSessionTab sessions={onlineSessions} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;