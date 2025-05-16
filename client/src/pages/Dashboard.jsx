import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Footer from "../components/Footer";
import "swiper/css";
import "swiper/css/pagination";

import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar

const Dashboard = () => {
  return (
    <div>
      <Navbar />

      <main className="flex w-full">
        <Sidebar />

        {/* Blue Card Container */}
        <div className="flex-1 p-8 bg-gray-100 mt-16">
          <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 text-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            {/* Circle with EDUCATE */}
            <div className="w-32 h-16 rounded-full bg-white text-blue-800 flex items-center justify-center text-sm font-bold">
              EDUCATE
            </div>

            {/* Full Form */}
            <h2 className="text-lg font-medium">
              E-Learning Domain for Upgrading Competence and Teaching Excellence
            </h2>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
