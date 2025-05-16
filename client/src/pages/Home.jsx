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
    <div>
      <main>
      <Navbar />
      <HeroSection />
      <TopCourseCategories />
      <ProgramAdvantages />
      <CourseGrid />
      <AdvantagesSection />
      <CourseOfferings />
      <OnlineCourseInfo />;
      <Team />
      </main>
      <Footer />
    </div>
    
  );
};

export default Home;
