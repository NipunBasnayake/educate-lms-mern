import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/appRoute";
import { useAppDispatch, useAppSelector } from "./redux/store-config/store";
import { useEffect } from "react";
import { refreshTokenAPI } from "./redux/features/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const {isAuthenticated, loading, data} = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const lastPath = sessionStorage.getItem("lastPath");

  useEffect(() => {
    dispatch(refreshTokenAPI()).then(() => {
      if(isAuthenticated && !loading){
        const redirectPath = lastPath || "/dashboard";
        navigate(redirectPath, {replace: true});
      }
    });
  },[dispatch, isAuthenticated, loading,navigate]);

  useEffect(() => {
    if(isAuthenticated && !loading && location.pathname !== "/login"){
      sessionStorage.setItem("lastPath", location.pathname);
    }
  },[location, isAuthenticated, loading]);

  if(loading) return <div>Loading ...</div>

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
