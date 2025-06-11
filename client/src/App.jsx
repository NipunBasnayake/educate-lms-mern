import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/appRoute";


function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
