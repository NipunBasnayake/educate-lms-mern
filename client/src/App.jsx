import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/appRoute";
import { useAppDispatch, useAppSelector } from "./redux/store-config/store";
import { useEffect } from "react";
import { refreshTokenAPI } from "./redux/features/authSlice";
import Layout from "./components/Layout";

function App() {

  return (
    <Router>
      {/* <Layout> */}
      <AppRoutes />
      {/* </Layout> */}
    </Router>
  );
}

export default App;
