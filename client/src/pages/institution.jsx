import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import Performance from "../homecomponents/Performance";
import AssignedAssessments from "../homecomponents/assigned";
import Exm from "../homecomponents/Examr";
import CompletedAssessmentsCard from "../homecomponents/CompletedAssessmentsCard";
import Completed from "../homecomponents/CompletedCoursesCard";

const Home = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-8xl mx-auto space-y-8 mt-6">
            <Section>
              <Completed />
              <CompletedAssessmentsCard />
              <Exm />
              <AssignedAssessments />
              <Performance />
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
