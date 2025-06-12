import { Outlet, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "../redux/store-config/store";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { refreshTokenAPI } from "../redux/features/authSlice";

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

  /*     const {isAuthenticated, loading, data } = useAppSelector((state) => state.auth);
    const userRole = data?.role;

    if(loading) return null;

    console.log("data", userRole);   */

  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, data } = useAppSelector((state) => state.auth);
  const userRole = data?.role;
  const [refreshAttempted, setRefreshAttempted] = useState(false);

  useEffect(() => {
    // Silent Refresh on component mount
    if(!isAuthenticated && !loading && !refreshAttempted){
      dispatch(refreshTokenAPI()).unwrap().finally(() => setRefreshAttempted(true));
    }
  },[dispatch, isAuthenticated, loading, refreshAttempted]);

  if(loading){
    return <div>Loading...</div>
  }

  // Checking Authentication and role
  const hasAccess = isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole));

  /* return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{
        message: !isAuthenticated
          ? "Please log in to access this page."
          : "You don't have permission to access this page.",
      }}
    />
  ); */
  
  if(!hasAccess){
    // Rediret Loggin
    return (
      <Navigate to="/login"
      state={{
        from: location.pathname,
        message: !isAuthenticated
        ? "Please log in to access this page." 
        : "You don't have permission to access this page."
      }}
      replace
      />
    );
  }

  return <Outlet/>
};

export default ProtectedRoute;
