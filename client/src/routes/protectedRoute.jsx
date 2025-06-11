import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "../redux/store-config/store";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedRoles }) => {
  // const token = localStorage.getItem("ACCESS_TOKEN");
  /* const token = Cookies.get('accessToken')
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 

      // Check if token is expired
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem("ACCESS_TOKEN"); 
        return <Navigate to="/login" state={{ message: "Session expired. Please log in again." }} />;
      }

      userRole = decoded.role;
      isAuthenticated = allowedRoles ? allowedRoles.includes(userRole) : true;
      console.log("User role:", userRole);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("ACCESS_TOKEN"); 
      return <Navigate to="/login" state={{ message: "Invalid token. Please log in again." }} />;
    }
  } */

    const {isAuthenticated, loading, data } = useAppSelector((state) => state.auth);
    const userRole = data?.role;

    if(loading) return null;

    console.log("data", userRole);
    
    

    // Checking Authentication and role
    const hasAccess = isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole))

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ message: !isAuthenticated ? "Please log in to access this page." : "You don't have permission to access this page." }}
    />
  );
};

export default ProtectedRoute;