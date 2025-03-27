import "flowbite";
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoPage from "./pages/NoPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import StudentDashBoard from "./pages/studentAcess/StudentDashBoard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/course/CourseDeatils";
import ExamList from "./pages/examPage/ExamList";
import ExamDetails from "./pages/examPage/ExamDetails";
import EnrollCourse from "./pages/course/EnrollCourse";
import { AuthProvider } from "../context/AuthContext"; // Fixed import path


function App() {
  return (
    <>
      <Router>
            <AuthProvider>

        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/register-page" element={<Register/>}/>

          {/* Protected Routes - Common for all roles */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "faculty", "student"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exam-details/:id" element={<ExamDetails />} />
          </Route>

          {/* Student-specific routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/studentDashboard" element={<StudentDashBoard />} />
            <Route path="/:id/enroll-course" element={<EnrollCourse />} />
          </Route>

          {/* Add more role-specific route groups as needed */}
        </Routes>
        <Footer />
        </AuthProvider>
      </Router>
   </>
  );
}

export default App;