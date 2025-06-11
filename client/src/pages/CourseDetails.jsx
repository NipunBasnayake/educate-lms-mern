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
  
  // Common format function
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        Course not found
      </div>
    );
  }

  // Generate course-specific data based on course ID
  const generateCourseData = () => {
    const commonAssignments = [
      {
        id: 1,
        title: "Assignment 1",
        dueDate: "Jun 09, 2025 12:00",
        status: "Not Submitted",
        submittedAt: null,
      },
      {
        id: 2,
        title: "Assignment 2",
        dueDate: "Oct 24, 2025 23:59",
        status: "Not Submitted",
        submittedAt: null,
      },
    ];

    switch (course.id) {
      case "BUS301": // Strategic Management
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "SWOT Analysis Report",
              dueDate: "Nov 7, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
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
          ],
          assessments: [
            { id: 1, title: "Week 1 Quiz", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Case Study: Tesla's Strategy",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Oct 15, 2025", weight: "30%" },
            { id: 2, title: "Final Strategy Plan", date: "Dec 10, 2025", weight: "40%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "Strategic Management Textbook (Porter)",
              type: "PDF",
              size: "4.2 MB",
            },
            { id: 2, title: "Harvard Business Review Cases", type: "ZIP", size: "12.1 MB" },
          ],
          discussions: [
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
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Live Q&A: Corporate Strategy",
              date: "Oct 10, 2025",
              time: "14:00 - 15:30",
              instructor: "Prof. Wilson",
            },
          ],
        };

      case "BUS205": // Business Ethics
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Ethical Dilemma Analysis",
              dueDate: "Nov 14, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Introduction to Business Ethics",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Ethical Decision Making Models",
              duration: "45 min",
              completed: true,
            },
            {
              id: 3,
              title: "Corporate Social Responsibility",
              duration: "60 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "Ethics Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Case Study: Pharma Pricing",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Oct 20, 2025", weight: "30%" },
            { id: 2, title: "Final Ethics Paper", date: "Dec 15, 2025", weight: "40%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "Business Ethics Textbook",
              type: "PDF",
              size: "3.8 MB",
            },
            { id: 2, title: "Ethical Dilemma Scenarios", type: "DOC", size: "2.1 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Whistleblowing Discussion",
              author: "Sarah K.",
              replies: 8,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Guest Lecture: Ethics in Tech",
              date: "Nov 5, 2025",
              time: "10:00 - 11:30",
              instructor: "Dr. Johnson",
            },
          ],
        };

      case "MKT310": // Marketing Analytics
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Customer Segmentation Analysis",
              dueDate: "Nov 21, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Introduction to Marketing Analytics",
              duration: "40 min",
              completed: true,
            },
            {
              id: 2,
              title: "Data Visualization Techniques",
              duration: "55 min",
              completed: true,
            },
            {
              id: 3,
              title: "Predictive Modeling in Marketing",
              duration: "65 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "Analytics Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Google Analytics Report",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Oct 25, 2025", weight: "30%" },
            { id: 2, title: "Final Analytics Project", date: "Dec 12, 2025", weight: "50%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "Marketing Analytics Handbook",
              type: "PDF",
              size: "5.5 MB",
            },
            { id: 2, title: "Sample Datasets", type: "CSV", size: "3.2 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "ROI Calculation Questions",
              author: "Mike T.",
              replies: 6,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Tableau Workshop",
              date: "Nov 8, 2025",
              time: "13:00 - 15:00",
              instructor: "Prof. Chen",
            },
          ],
        };

      // Add cases for other courses following the same pattern
      case "OPS320": // Operations Research
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Linear Programming Problem Set",
              dueDate: "Nov 28, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Introduction to OR Models",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Linear Programming Fundamentals",
              duration: "60 min",
              completed: true,
            },
            {
              id: 3,
              title: "Transportation Problems",
              duration: "55 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "OR Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Simplex Method Problem Set",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Oct 30, 2025", weight: "35%" },
            { id: 2, title: "Final OR Project", date: "Dec 14, 2025", weight: "45%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "Operations Research Textbook",
              type: "PDF",
              size: "6.1 MB",
            },
            { id: 2, title: "Case Studies in OR", type: "DOC", size: "2.8 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Shadow Price Explanation",
              author: "David L.",
              replies: 4,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Excel Solver Tutorial",
              date: "Nov 12, 2025",
              time: "14:00 - 16:00",
              instructor: "Prof. Rodriguez",
            },
          ],
        };

      // Continue with other courses...
      case "HRM210": // Organizational Behavior
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Team Dynamics Analysis",
              dueDate: "Dec 5, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Introduction to OB",
              duration: "45 min",
              completed: true,
            },
            {
              id: 2,
              title: "Motivation Theories",
              duration: "50 min",
              completed: true,
            },
            {
              id: 3,
              title: "Organizational Culture",
              duration: "55 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "OB Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Leadership Style Analysis",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Nov 5, 2025", weight: "30%" },
            { id: 2, title: "Final OB Paper", date: "Dec 20, 2025", weight: "40%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "OB Case Studies",
              type: "PDF",
              size: "3.5 MB",
            },
            { id: 2, title: "Personality Assessment Tools", type: "DOC", size: "1.8 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Maslow vs Herzberg Debate",
              author: "Emily R.",
              replies: 7,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Virtual Team Simulation",
              date: "Nov 15, 2025",
              time: "11:00 - 12:30",
              instructor: "Prof. Davis",
            },
          ],
        };

      case "ACC101": // Financial Accounting
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Financial Statement Analysis",
              dueDate: "Dec 12, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Accounting Principles",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Double-Entry Bookkeeping",
              duration: "60 min",
              completed: true,
            },
            {
              id: 3,
              title: "Financial Statements Preparation",
              duration: "65 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "Accounting Basics Quiz", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Journal Entries Exercise",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Nov 10, 2025", weight: "35%" },
            { id: 2, title: "Final Accounting Project", date: "Dec 22, 2025", weight: "45%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "GAAP Standards Guide",
              type: "PDF",
              size: "4.8 MB",
            },
            { id: 2, title: "Practice Problems Set", type: "DOC", size: "2.5 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Accrual vs Cash Accounting",
              author: "Robert K.",
              replies: 9,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "QuickBooks Tutorial",
              date: "Nov 18, 2025",
              time: "13:00 - 15:00",
              instructor: "Prof. Thompson",
            },
          ],
        };

      // Continue with remaining courses...
      case "HRM315": // Leadership & Influence
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Leadership Style Reflection",
              dueDate: "Dec 19, 2025 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Leadership Theories Overview",
              duration: "45 min",
              completed: true,
            },
            {
              id: 2,
              title: "Emotional Intelligence in Leadership",
              duration: "50 min",
              completed: true,
            },
            {
              id: 3,
              title: "Change Management Strategies",
              duration: "55 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "Leadership Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Influence Case Study",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Nov 15, 2025", weight: "30%" },
            { id: 2, title: "Final Leadership Project", date: "Jan 5, 2026", weight: "40%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "Leadership Challenge Book",
              type: "PDF",
              size: "3.9 MB",
            },
            { id: 2, title: "360° Feedback Tools", type: "DOC", size: "2.2 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Servant Leadership Discussion",
              author: "Lisa M.",
              replies: 6,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Guest Speaker: CEO Panel",
              date: "Nov 22, 2025",
              time: "14:00 - 16:00",
              instructor: "Various Executives",
            },
          ],
        };

      case "ENT302": // Innovation Management
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Innovation Audit Report",
              dueDate: "Jan 9, 2026 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Innovation Process Models",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Design Thinking Principles",
              duration: "55 min",
              completed: true,
            },
            {
              id: 3,
              title: "Open Innovation Strategies",
              duration: "60 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "Innovation Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Ideation Workshop Report",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Nov 20, 2025", weight: "30%" },
            { id: 2, title: "Final Innovation Pitch", date: "Jan 12, 2026", weight: "50%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "Innovator's Dilemma Excerpts",
              type: "PDF",
              size: "3.7 MB",
            },
            { id: 2, title: "Case Studies in Disruption", type: "DOC", size: "2.4 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Blue Ocean Strategy Examples",
              author: "Alex P.",
              replies: 8,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Virtual Ideation Session",
              date: "Nov 25, 2025",
              time: "10:00 - 12:00",
              instructor: "Prof. Garcia",
            },
          ],
        };

      case "OPS410": // Supply Chain Management
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Supply Chain Risk Analysis",
              dueDate: "Jan 16, 2026 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "SCM Fundamentals",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Inventory Management",
              duration: "55 min",
              completed: true,
            },
            {
              id: 3,
              title: "Global Supply Chains",
              duration: "60 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "SCM Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Logistics Network Design",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Nov 25, 2025", weight: "35%" },
            { id: 2, title: "Final SCM Simulation", date: "Jan 19, 2026", weight: "45%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "SCM Best Practices",
              type: "PDF",
              size: "4.5 MB",
            },
            { id: 2, title: "ERP System Overview", type: "DOC", size: "2.7 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Just-in-Time Challenges",
              author: "Kevin S.",
              replies: 5,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Guest Lecture: Amazon SCM",
              date: "Dec 2, 2025",
              time: "13:00 - 15:00",
              instructor: "Amazon Logistics Director",
            },
          ],
        };

      case "BUS350": // Data-Driven Decision Making
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Data Visualization Project",
              dueDate: "Jan 23, 2026 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Introduction to DDDM",
              duration: "45 min",
              completed: true,
            },
            {
              id: 2,
              title: "Data Collection Methods",
              duration: "50 min",
              completed: true,
            },
            {
              id: 3,
              title: "Statistical Analysis Basics",
              duration: "55 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "DDDM Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "KPIs Dashboard Creation",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Dec 1, 2025", weight: "30%" },
            { id: 2, title: "Final Data Analysis Project", date: "Jan 26, 2026", weight: "50%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "DDDM Case Studies",
              type: "PDF",
              size: "4.1 MB",
            },
            { id: 2, title: "Sample Business Datasets", type: "CSV", size: "3.5 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Choosing the Right Metrics",
              author: "Daniel W.",
              replies: 7,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Power BI Workshop",
              date: "Dec 8, 2025",
              time: "14:00 - 16:00",
              instructor: "Prof. Lee",
            },
          ],
        };

      case "BUS220": // International Business
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "Market Entry Strategy",
              dueDate: "Jan 30, 2026 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Globalization Trends",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Cultural Dimensions",
              duration: "55 min",
              completed: true,
            },
            {
              id: 3,
              title: "International Trade Laws",
              duration: "60 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "IB Quiz 1", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Country Risk Analysis",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Dec 5, 2025", weight: "30%" },
            { id: 2, title: "Final IB Plan", date: "Feb 2, 2026", weight: "40%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "International Business Textbook",
              type: "PDF",
              size: "4.9 MB",
            },
            { id: 2, title: "WTO Regulations Summary", type: "DOC", size: "2.3 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Brexit Impact Discussion",
              author: "Olivia B.",
              replies: 9,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "Guest Speaker: Global CEO",
              date: "Dec 12, 2025",
              time: "11:00 - 12:30",
              instructor: "Maria Gonzalez (GlobalCorp CEO)",
            },
          ],
        };

      case "HRM405": // Human Resource Strategy
        return {
          assignments: [
            ...commonAssignments,
            {
              id: 3,
              title: "HR Strategy Proposal",
              dueDate: "Feb 6, 2026 23:59",
              status: "Not Submitted",
              submittedAt: null,
            },
          ],
          lessons: [
            {
              id: 1,
              title: "Strategic HR Overview",
              duration: "50 min",
              completed: true,
            },
            {
              id: 2,
              title: "Talent Management",
              duration: "55 min",
              completed: true,
            },
            {
              id: 3,
              title: "HR Analytics",
              duration: "60 min",
              completed: false,
            },
          ],
          assessments: [
            { id: 1, title: "HR Strategy Quiz", due: "Due tomorrow", status: "Pending" },
            {
              id: 2,
              title: "Workforce Planning Exercise",
              due: "Due in 1 week",
              status: "Not Started",
            },
          ],
          exams: [
            { id: 1, title: "Midterm Exam", date: "Dec 10, 2025", weight: "30%" },
            { id: 2, title: "Final HR Strategy Plan", date: "Feb 9, 2026", weight: "50%" },
          ],
          studyMaterials: [
            {
              id: 1,
              title: "HR Strategy Framework",
              type: "PDF",
              size: "3.8 MB",
            },
            { id: 2, title: "Employee Engagement Tools", type: "DOC", size: "2.0 MB" },
          ],
          discussions: [
            {
              id: 1,
              title: "Remote Work Policies Debate",
              author: "Nathan T.",
              replies: 11,
            },
          ],
          onlineSessions: [
            {
              id: 1,
              title: "HR Tech Tools Demo",
              date: "Dec 15, 2025",
              time: "13:00 - 15:00",
              instructor: "TechHR Representative",
            },
          ],
        };

      default:
        return {
          assignments: commonAssignments,
          lessons: [],
          assessments: [],
          exams: [],
          studyMaterials: [],
          discussions: [],
          onlineSessions: [],
        };
    }
  };

  const courseData = generateCourseData();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [assignments, setAssignments] = useState(courseData.assignments);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [submissionStatus] = useState({});

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
          {activeTab === "lessons" && <LessonsTab lessons={courseData.lessons} />}
          {activeTab === "Quizes" && (
            <AssessmentsTab assessments={courseData.assessments} />
          )}
          {activeTab === "exams" && <ExamsTab exams={courseData.exams} />}
          {activeTab === "materials" && (
            <MaterialsTab studyMaterials={courseData.studyMaterials} />
          )}
          {activeTab === "discussions" && (
            <DiscussionsTab discussions={courseData.discussions} />
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
            <OnlineSessionTab sessions={courseData.onlineSessions} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetails;