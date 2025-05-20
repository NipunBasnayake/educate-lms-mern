import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Card = ({ title, content, footer }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md text-left">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{content}</p>
      {footer && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  );
};

const Institution = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 dark:bg-gray-900">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 flex justify-center items-center bg-gray-50 dark:bg-gray-950">
          <div className="space-y-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Unit Page
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is the main content area centered on the page.
            </p>

            <Card
              title="Introduction to Unit XYZ"
              content="Explore topics, assessments, and resources related to this unit. Stay updated with deadlines and announcements."
              footer="Last updated: Today"
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Institution;
