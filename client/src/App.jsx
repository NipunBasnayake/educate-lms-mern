import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/appRoute";
import { useAppDispatch } from "./redux/store-config/store";
import { useEffect } from "react";
import { refreshTokenAPI } from "./redux/features/authSlice";

function App() {
  /* const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshTokenAPI());
  },[dispatch]); */

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
