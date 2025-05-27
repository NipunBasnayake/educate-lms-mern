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
            className="bg-white border border-gray-300 shadow-sm h-[500px]  p-6"
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

         {/* Completed Assessments*/}
                  <div className="flex flex-col">
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
                      title="Completed Assessments"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Capstone: A+</p>
                          <p>📅 May 2024</p>
                        </div>
                      }
                    />
                  </div>



                   {/* Exam Results*/}
                  <div className="flex flex-col">
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
                      title="Exam Results"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Capstone: A+</p>
                          <p>📅 May 2024</p>
                        </div>
                      }
                    />
                  </div>



                   {/* Assigned Assessments */}
                  <div className="flex flex-col">
                    <Card
                      variant="institution"
                      className="bg-white border border-gray-300 shadow-sm h-full flex flex-col"
                      title="Assigned Assessments"
                      content={
                        <div className="text-sm text-gray-600 mt-2 space-y-1 flex-grow">
                          <p>✔ Capstone: A+</p>
                          <p>📅 May 2024</p>
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
