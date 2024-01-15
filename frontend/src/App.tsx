import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";
import JobListingPage from "./pages/JobListingPage";
import LandingPage from "./pages/LandingPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import DocumentsPage from "./pages/DocumentsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ModalProvider from "./components/providers/ModalProvider";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/jobs" element={<JobListingPage />} />
            <Route path="/saved-jobs" element={<SavedJobsPage />} />
            <Route path="/saved-jobs/:id" element={<JobDetailsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Route>
        </Routes>
      </Router>
      <ModalProvider />
    </>
  );
}

export default App;
