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

//  Context
import { AuthProvider } from "../context/AuthContext";
import { NoticeProvider } from '../context/NoticeContext';

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
import FacultyRequestCourse from "./pages/CourseManager/FacultyRequestCourse";
import PendingCourseRequest from "./pages/CourseManager/PendingCourseRequests";

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

//Attendance  Routes //
 import MarkAttendance from './pages/attendance/MarkAttendance';
 import AttendanceRequest from './pages/attendance/AttendanceRequest';  
import AttendanceChart from './pages/attendance/AttendanceChart';
import MarkSelfAttendance from './pages/attendance/AdminOrFaculty/MarkSelfAttendance ';
import InstructorAttendanceSummary from './pages/attendance/AdminOrFaculty/InstructorAttendanceSummary';
import MyCourses from './pages/attendance/instructor/MyCourses';

  //Notification Routes //
import NotificationPage from './pages/Notifications/NotificationPage';
import CreateNotification from './pages/Notifications/CreateNotification'
import FacultyDashboard from './pages/Dashboards/FacultyDashboard';
import FacultyDashboardPage from './pages/Dashboards/FacultyDashboardPage';

//Pending requests //
import FacultyRegistration from './pages/panding/FacultyRegistration';

//Leave Routes //
import CreateLeaverequests from './pages/Requests/CreateLeaverequest';
import PendingLeaveRequests from './pages/Panding/Admin/PendingLeaveRequest';
import AllLeaves from './pages/Leave/AllLeaves';
import MyLeaves from './pages/Leave/MyLeaves';

// Activity Routes //
import ActivityList from './pages/Activity/ActivityList';

// Document Routes //
import UploadDocuments from './pages/Document/UploadDocuments';
import DocumentViewer from './pages/Document/DocumentViewer'; 

// NOTICE ROUTES //
import CreateNotice from './pages/Notice/CreateNotice';

// Payment //

import Payment from './components/Payment'

// fee
import CreateFee from './pages/paymentPage/FeeStructure/CreateFee'
import MyFeeDetails from './pages/paymentPage/FeeStructure/MyFeeDetails ';


function App() {
  return (
    <>
      <Router>
        <AuthProvider>  
        <NoticeProvider>
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
              <Route path="/:id/enroll-course" element={<EnrollCourse />} />
              <Route path="/student-exam/:id" element={<SubmitExam/>} />     {/*student Attend the exam */}
              <Route path ="/student-exam" element= {<StudentExams/>} />   {/*student see their exmas */}
            </Route>
            <Route path="/studentDashboard" element={<StudentDashBoard />} />


            {/* Admin + Faculty Only */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "faculty"]} />}>
              <Route path="/users" element={<UserManagement />} />
              <Route path="/exam/create-exam" element={<CreateExam />} />
              <Route path="/exam/edit-exam" element={<EditExam />} />
              <Route path="/exam-deletaiton-approved-page" element={<DeleteExam />} />
              <Route path="/create-courses" element={<CreateCourse />} />
              <Route path="/request-course" element={<FacultyRequestCourse />} />
              <Route path="/update-course" element={<UpdateCourse />} />
            </Route>

            {/* Admin Only */}
            <Route path="/AdminDashboard" element={<AdminPanel />} />
    
             {/* Result Pages */}
              <Route element={<ProtectedRoute allowedRoles={["student , admin", "faculty"]} />}>
           
                <Route path="/all-results" element={<AdminResult/>} />
                <Route path="/update-result" element={<UpdateResultPage/>} />
                <Route path="/delete-result" element={<DeleteResult/>} />
                </Route>
                <Route path="/my-results" element={<StudentResult/>} />
               {/* Attendance pages */}
               <Route path="/attendance" element={<MarkAttendance />} />
               <Route path="/attendance-request" element={<AttendanceRequest />} />
               <Route path="/attendance-record" element={<AttendanceChart />} />
               <Route path="/self-attendance" element={<MarkSelfAttendance />} />
               <Route path="/students-attendance-summary/:courseId" element={<InstructorAttendanceSummary/>} />
               <Route path="/instructor-courses" element={<MyCourses/>} />

                 
                 {/* NOTIFICATION PAGES */}
                  
                  <Route path="/notifications" element={<NotificationPage />} />
                  <Route path="/create-notification" element={<CreateNotification />} />
                  {/* <Route path="/faculty-dashboard" element={<FacultyDashboard />} /> */}
                  <Route path="/faculty-portal" element={<FacultyDashboardPage />} />
                  <Route path="/course-pending-requests" element={<PendingCourseRequest />} />

                     <Route path="/account-requests" element={<FacultyRegistration/>} />


                     {/* LEAVES PAGES */}
                
                <Route element={<ProtectedRoute allowedRoles={["faculty , student"]} />}>
                  
                  </Route>

                  <Route path ="/submit-leave-request" element={<CreateLeaverequests/>} />
                  <Route path ="/pending-request" element={<PendingLeaveRequests/>} />
                  <Route path="/all-leave-record"  element={<AllLeaves/>} />
                  <Route path= "/my-leaves" element={<MyLeaves/>} />

                  {/* Activity page */}
                  <Route path="/activities" element={<ActivityList />} />

                  {/* Documnet pages */}
                  <Route path="/upload-document" element={<UploadDocuments />} />
                  <Route path="/assignment" element={<DocumentViewer/>} />

                  {/* Notice pages  */}
                  <Route path="/create-notice" element={<CreateNotice />} />

                  {/* payments */}

                  <Route path="/payment" element={<Payment/>} />
                  <Route path="/create-fee-structure" element={<CreateFee />} />
                  <Route path="/fee-details" element={<MyFeeDetails/>} />

                  

                 
          </Routes>
          <Footer />
        </NoticeProvider>
        </AuthProvider>
      </Router>
    </>
  );
}
export default App;
