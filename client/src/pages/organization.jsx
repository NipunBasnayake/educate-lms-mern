import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Institution = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 dark:bg-gray-900">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 flex justify-center items-center">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Organization Page</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is the main content area centered on the page. You can add organization-related cards, sections, or widgets here as needed.
            </p>
          </div>
        </main>
      </div>
    
    </div>
  );
};

export default Institution;
