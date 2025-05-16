import Navbar from "../components/Navbar"; // ✅ Import Navbar
import Footer from "../components/Footer";
import "swiper/css";
import "swiper/css/pagination";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <main className="w-full">
        <div
          className="bg-white-300 shadow-md rounded-md"
          style={{ height: "700px" }}
        ></div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
