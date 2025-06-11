import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  let isAuthenticated = false;
  let userRole = null;

  console.log("awa");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.log("Token expired");
        localStorage.removeItem("ACCESS_TOKEN");
        return (
          <Navigate
            to="/login"
            state={{ message: "Session expired. Please log in again." }}
          />
        );
      }

      userRole = decoded.role;
      console.log("User role:", userRole, "Allowed roles:", allowedRoles);
      isAuthenticated = allowedRoles ? allowedRoles.includes(userRole) : true;
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("ACCESS_TOKEN");
      return (
        <Navigate
          to="/login"
          state={{ message: "Invalid token. Please log in again." }}
        />
      );
    }
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{
        message: userRole
          ? "You don't have permission to access this page."
          : "Please log in to access this page.",
      }}
    />
  );
};

export default ProtectedRoute;
