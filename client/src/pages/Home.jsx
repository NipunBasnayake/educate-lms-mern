import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourseGrid from "../components/CourseGrid";
import AdvantagesSection from "../components/AdvantagesSection";
import CourseOfferings from "../components/CourseOfferings";
import OnlineCourseInfo from "../components/OnlineCourseInfo";
import TopCourseCategories from "../components/TopCourseCategories";
import ProgramAdvantages from "../components/ProgramAdvantages";
import HeroSection from "../components/HeroSection";
import Team from "../components/Team";

const Home = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <HeroSection />
      <main>
        <TopCourseCategories />

        <section className="bg-gray-100 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Let's Get to Know You
            </h2>
            <p className="text-gray-600 mb-12">
              Choose the category that best describes your current learning
              stage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Are you a Beginner?",
                "Are you an Undergraduate?",
                "Are you a Professional?",
                "Are you switching careers?",
              ].map((question, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                >
                  <p className="text-lg font-medium text-gray-700">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProgramAdvantages />

        <CourseGrid />

        <AdvantagesSection />

        <CourseOfferings />

        <OnlineCourseInfo />

        <Team />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
