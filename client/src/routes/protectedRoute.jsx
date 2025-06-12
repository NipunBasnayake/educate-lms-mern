import { Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store-config/store";
import { useEffect } from "react";
import { refreshTokenAPI } from "../redux/features/authSlice";

const ProtectedRoute = ({ allowedRoles }) => {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, data, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated && !loading && !data) {
      dispatch(refreshTokenAPI()).then(() => {
        if (isMounted && !loading && !isAuthenticated) {
          window.location.href = "/login";
        }
      });
    }

    return () => {isMounted = false;};
  }, [dispatch,isAuthenticated,loading,data]);

  if(loading) return null;

  const hasAccess = isAuthenticated && (!allowedRoles || (data?.role && allowedRoles.includes(data.role)));
  console.log("has access", hasAccess);
  

  return hasAccess ? (
    <Outlet/>
  ) : (
    <Navigate to="/login" state={{message: error || "Please log in or check permissions." }} replace />
  );
  
};

export default ProtectedRoute;
