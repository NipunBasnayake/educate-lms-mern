import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card"; // Import the card

const Institution = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 dark:bg-gray-900">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 flex justify-center items-center bg-gray-50 dark:bg-gray-950">
          <div className="space-y-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Activity Page
            </h1>
            <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
              This is the main content area centered on the page.
            </p>

            {/* Card(s) */}
            <div className="flex justify-center">
              <Card
                title="Welcome to the Portal"
                content="Access your latest university resources, notifications, and tools all in one place."
                footer="Updated just now"
              />
            </div>
          </div>
        </main>
      </div>
     
    </div>
  );
};

export default Institution;
