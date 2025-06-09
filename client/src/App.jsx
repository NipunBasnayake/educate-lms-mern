import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Institution from "./pages/Institution";
import Profile from "./pages/profile"; // Assuming you have a Profile page
import Goals from "./pages/goals"; // Assuming you have a Goals page
import Units from "./pages/units"; // Assuming you have a Unit page
import Calendar from "./pages/calendar"; // Assuming you have a Calendar page
import Messenger from "./pages/messages"; // Assuming you have a Messenger page
import Marks from "./pages/Marks"; // Assuming you have a Marks page
import Tool from "./pages/Tool"; // Assuming you have a Tool page
import Logout from "./pages/logout"; // Assuming you have a Logout page
import Privacy from "./pages/privacy"; // Assuming you have a Privacy Policy page
import Terms from "./pages/Terms"; // Assuming you have a Terms of Service page
import Accessibility from "./pages/Accessibility"; // Assuming you have an Accessibility page
import CourseList from "./pages/CourseList";
import CourseDetails from "./pages/CourseDetails"; // Ensure CourseDetails has a default export
import Exam from './pages/Exam'; // Make sure the path is correct




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/" element={<Home />} />
        <Route path="/institution" element={<Institution />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Activity" element={<Goals />} />
        <Route path="/units" element={<Units />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<Messenger />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/tools" element={<Tool />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/accessibility" element={<Accessibility />} />

        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/exam-application" element={<Exam />} />
      </Routes>
    </Router>
  );
}

export default App;
