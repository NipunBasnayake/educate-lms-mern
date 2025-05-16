import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  return (
    <div>
      <Navbar />

      <main className="w-full min-h-screen bg-gray-100 flex items-start justify-end pr-10 pt-24 relative">
        {/* Background block */}
        <div
          className="absolute top-0 left-0 w-full bg-gray-200 shadow-md rounded-md"
          style={{ height: "700px", zIndex: -1 }}
        ></div>

        {/* Login card */}
        <div className="w-full max-w-sm p-6 bg-white border rounded-lg shadow-md z-10">
          <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 mt-1 border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 mt-1 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
