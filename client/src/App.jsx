import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "flowbite";
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout & Common Components
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import TostMessages from '../hooks/TostMessages';

// Auth Context
import { AuthProvider } from "../context/AuthContext";

// Public Pages
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/course/CourseDeatils";
import ExamList from "./pages/examPage/ExamList";
import Page from "./pages/Page";

// Private/Common Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Admin + Faculty Pages
import UserManagement from "./pages/Users/UserManagement";
import CreateCourse from "./pages/CourseManager/CreateCourse";

// Student Pages
import StudentDashBoard from "./pages/studentAcess/StudentDashBoard";
import EnrollCourse from "./pages/course/EnrollCourse";

// Exam Routes
import CreateExam from './pages/ExamManagemnt/CreateExam';
import EditExam from './pages/ExamManagemnt/EditExam';
import AllExams from './pages/examPage/AllExams';
import SubmitExam from "./pages/examPage/SubmitExam";
import DeleteExam from "./pages/Admin/Dashboards/DeleteExam";

//Result Routes //
 import StudentResult from "./pages/Results/StudentResult"
 import AdminResult from "./pages/Results/AdminResult"
 import DeleteResult from "./pages/Results/DeleteResult"
import UpdateResultPage from './pages/Results/UpdateResultPage';


// Admin Dashboard
import AdminPanel from "./pages/Admin/Dashboards/AdminPanel";
import UpdateCourse from "./pages/CourseManager/UpdateCourse"
import StudentExams from './pages/studentAcess/StudentExams';
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <TostMessages />
          <Navbar />
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-page" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/page" element={<Page />} />
            <Route path="*" element={<NoPage />} />

            {/* Protected Routes (All Roles) */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "faculty", "student"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/exam/view-exams" element={<AllExams />} />
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/studentDashboard" element={<StudentDashBoard />} />
              <Route path="/:id/enroll-course" element={<EnrollCourse />} />
              <Route path="/student-exam/:id" element={<SubmitExam/>} />     {/*student Attend the exam */}
              <Route path ="/student-exam" element= {<StudentExams/>} />   {/*student see their exmas */}
            </Route>

            {/* Admin + Faculty Only */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "faculty"]} />}>
              <Route path="/users" element={<UserManagement />} />
              <Route path="/exam/create-exam" element={<CreateExam />} />
              <Route path="/exam/edit-exam" element={<EditExam />} />
              <Route path="/exam-deletaiton-approved" element={<DeleteExam />} />
              <Route path="/create-courses" element={<CreateCourse />} />
              <Route path="/update-course" element={<UpdateCourse />} />
            </Route>

            {/* Admin Only */}
            <Route path="/AdminDashboard" element={<AdminPanel />} />
    
             {/* Result Pages */}
              <Route element={<ProtectedRoute allowedRoles={["student , admin", "faculty"]} />}>
                      
                </Route>
                <Route path="/my-results" element={<StudentResult/>} />
                <Route path="/all-results" element={<AdminResult/>} />
                <Route path="/update-result" element={<UpdateResultPage/>} />
                <Route path="/delete-result" element={<DeleteResult/>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
