import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Section from "../components/Section";

const Institution = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        
          <Sidebar />
        
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12 mt-28">
            <Section title="Institution">
              <Card
                variant="institution"
                title="Handshake Student Giveaway"
                content="Live rent free and grab exciting giveaways with Handshake!"
              />
              <Card
                variant="institution"
                title="QR Attendance System"
                content="Pilot system update to simplify student attendance tracking."
              />
            </Section>

            <Section title="Reminders & Announcements">
              <Card
                variant="institution"
                title="Module Name Section"
                content="Under paragraph module name section reminders."
              />
              <Card
                variant="institution"
                title="Announcement"
                content="Introducing My Engagement card to track success and performance."
                footer="Track your success and boost your performance!"
              />
            </Section>

            <Section title="Resources & Tools">
              <Card
                variant="institution"
                title="Access Panopto"
                content="Watch recorded lectures anytime with Panopto."
              />
              <Card
                variant="institution"
                title="University Assessment Survey"
                content="Give your feedback to help improve academic experience."
              />
              <Card
                variant="institution"
                title="Use Studiosity"
                content="Get feedback before submitting assignments with Studiosity."
              />
              <Card
                variant="institution"
                title="Mitigation Support"
                content="Need help? Learn how to request mitigation and extensions."
              />
              <Card
                variant="institution"
                title="Timetables"
                content="Access your personal class schedules online."
              />
              <Card
                variant="institution"
                title="Library"
                content="Explore digital and physical resources from the library."
              />
              <Card
                variant="institution"
                title="Assignment Submission Help"
                content="Are you submitting an assignment? Here's how to do it right."
              />
              <Card
                variant="institution"
                title="Educate SU"
                content="Your voice matters. Represent student concerns with Educate SU."
              />
              <Card
                variant="institution"
                title="Welcome to Breo Ultra"
                content="A new experience with enhanced learning tools."
              />
              <Card
                variant="institution"
                title="Accessibility and Live Video"
                content="Work better with accessibility tools during live sessions."
              />
              <Card
                variant="institution"
                title="Exams & Regulations"
                content="Know your rights and responsibilities during exams and assessments."
              />
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Institution;
