import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import JobListing from "./pages/JobListing";
import Landing from "./pages/Landing";
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/documents" element={<Documents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
