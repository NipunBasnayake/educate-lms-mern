import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  let isAuthenticate = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;
      if (role == "Student" || role == "SuperAdmin") {
        isAuthenticate = true;
      }
      console.log("User role:", role);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
  return isAuthenticate ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
