import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Section from "../components/Section";

const Home = () => {
  return (
   <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-8xl mx-auto space-y-8 mt-6">
        <Section>
          <Card
            variant="institution"
            className="bg-white border border-gray-300 shadow-sm  h-[600px] md:h-[350px]  p-6"
            title="Completed Courses"     
            content={
              <div className="mt-7">
                {/* Grid container for course cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                  {/* Course Card 1 */}
                  <div className="flex flex-col"> {/* Wrapper div to ensure proper height */}
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex h-[350px] flex-col"
                      title="Advanced Data Structures"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Grade: A (95%)</p>
                          <p>📅 Dec 2023</p>
                        </div>
                        
                      }
                    />
                  </div>

                  {/* Course Card 2 */}
                  <div className="flex flex-col">
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
                      title="Machine Learning"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Honors (Top 10%)</p>
                          <p>📅 Mar 2024</p>
                        </div>
                      }
                    />
                  </div>

                  {/* Course Card 3 */}
                  <div className="flex flex-col">
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
                      title="Web Development"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Capstone: A+</p>
                          <p>📅 May 2024</p>
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            }
          />

 {/* Completed Assessments */}
<div className="flex flex-col">
  <Card
    variant="institution"
    className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
    title="Completed Assessments"
    content={
      <div className="flex flex-col gap-4">
        {/* Assessment Summary */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Capstone Project</p>
            <p className="text-sm text-gray-500">Final year research project</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">A+</span>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center justify-center p-2 bg-green-50 hover:bg-green-100 rounded-lg transition">
            <span className="text-green-600">📅</span>
            <span className="text-xs font-medium mt-1">On-time</span>
          </button>
          <button className="flex flex-col items-center justify-center p-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition">
            <span className="text-yellow-600">⏰</span>
            <span className="text-xs font-medium mt-1">Late</span>
          </button>
          <button className="flex flex-col items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
            <span className="text-blue-600">📊</span>
            <span className="text-xs font-medium mt-1">Feedback</span>
          </button>
        </div>

        {/* View All Link */}
        <a href="#" className="text-xs text-center text-blue-600 hover:text-blue-800 hover:underline">
          View all completed assessments →
        </a>
      </div>
    }
  />
</div>


                 {/* Exam Results */}
<div className="flex flex-col">
  <Card
    variant="institution"
    className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
    title="Exam Results"
    content={
      <div className="flex flex-col gap-4 p-2">
        {/* Header with Summary Stats */}
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-sm">Completed Exams: <span className="text-blue-600">5</span></p>
            <p className="text-xs text-gray-500">Current GPA: 3.8/4.0</p>
          </div>
          <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition">
            View Transcript
          </button>
        </div>

        {/* Exam List */}
        <div className="space-y-3">
          {/* Exam Item 1 */}
          <div className="flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50 transition">
            <div>
              <p className="font-medium text-sm">Capstone Project</p>
              <p className="text-xs text-gray-500">Final Year Research</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">A+</span>
              <button className="text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Exam Item 2 */}
          <div className="flex justify-between items-center p-2 border-b border-gray-100 hover:bg-gray-50 transition">
            <div>
              <p className="font-medium text-sm">Advanced Algorithms</p>
              <p className="text-xs text-gray-500">Theory Exam</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">A-</span>
              <button className="text-gray-400 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <button className="flex flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 rounded transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">All Exams</span>
          </button>
          <button className="flex flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 rounded transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1">Scores</span>
          </button>
          <button className="flex flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 rounded transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs mt-1">Feedback</span>
          </button>
          <button className="flex flex-col items-center p-2 bg-gray-50 hover:bg-gray-100 rounded transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-xs mt-1">Download</span>
          </button>
        </div>
      </div>
    }
  />
</div>



{/* Assigned Assessments */}
<div className="flex flex-col">
  <Card
    variant="institution"
    className="bg-white border border-gray-200 shadow-sm h-full flex flex-col"
    title="Assigned Assessments"
    content={
      <div className="text-sm text-gray-700 mt-3 space-y-3 flex-grow">
        {[
          {
            title: "Capstone Project",
            date: "May 2024",
            status: "Submitted",
          },
          {
            title: "Research Paper",
            date: "April 2024",
            status: "Submitted",
          },
          {
            title: "Midterm Exam",
            date: "March 2024",
            status: "Submitted",
          },
          {
            title: "Team Presentation",
            date: "February 2024",
            status: "Submitted",
          },
        ].map((assignment, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-800">{assignment.title}</p>
              <p className="text-xs text-gray-500">Assigned • {assignment.date}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${
                assignment.status === "Submitted"
                  ? "text-green-600 bg-green-50 border-green-200"
                  : "text-red-600 bg-red-50 border-red-200"
              }`}
            >
              {assignment.status}
            </span>
          </div>
        ))}
      </div>
    }
  />
</div>



               
                          {/* Performance Summary */}
                  <div className="flex flex-col">
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
                      title="Performance Summary"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Capstone: A+</p>
                          <p>📅 May 2024</p>
                        </div>
                      }
                    />
                  </div>

        </Section>

      </div>
    </main>
  </div>
</div>
  );
};

export default Home;
