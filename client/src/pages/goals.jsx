import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer"; 



const Institution = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 ">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Activity Page</h1>
            <p className="mt-4 text-lg">
              This is the main content area centered on the page.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Institution;
