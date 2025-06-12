import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import Dashboard from "../pages/Dashboard";
import Institution from "../pages/Institution";
import Profile from "../pages/profile";
import Goals from "../pages/goals";
import Units from "../pages/units";
import Calendar from "../pages/calendar";
import Messenger from "../pages/messages";
import Marks from "../pages/Marks";
import Tool from "../pages/Tool";
import Logout from "../pages/logout";
import Privacy from "../pages/privacy";
import Terms from "../pages/Terms";
import Accessibility from "../pages/Accessibility";
import CourseDetails from "../pages/CourseDetails";
import Exam from "../pages/Exam";
import ProtectedRoute from "./protectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["Student", "SuperAdmin"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        
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
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
          <Route path="/courses" element={<Courses />} />    
        {/* Add Instructor-specific routes here if needed */}
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        {/* Add SuperAdmin-specific routes here if needed */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;