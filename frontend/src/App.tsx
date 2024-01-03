import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import JobListing from "./pages/JobListing";
import Landing from "./pages/Landing";
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";
import SavedJobs from "./pages/SavedJobs";
import JobDetails from "./pages/JobDetails";
import ModalProvider from "./components/providers/ModalProvider";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/jobs" element={<JobListing />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/saved-jobs/:id" element={<JobDetails />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/documents" element={<Documents />} />
          </Route>
        </Routes>
      </Router>
      <ModalProvider />
    </>
  );
}

export default App;
