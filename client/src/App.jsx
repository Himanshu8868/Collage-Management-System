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

// Context Providers
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
import UpdateCourse from "./pages/CourseManager/UpdateCourse";

// Student Pages
import StudentDashBoard from "./pages/studentAcess/StudentDashBoard";
import EnrollCourse from "./pages/course/EnrollCourse";
import StudentExams from './pages/studentAcess/StudentExams';

// Exam Pages
import CreateExam from './pages/ExamManagemnt/CreateExam';
import EditExam from './pages/ExamManagemnt/EditExam';
import AllExams from './pages/examPage/AllExams';
import SubmitExam from "./pages/examPage/SubmitExam";
import DeleteExam from "./pages/Admin/Dashboards/DeleteExam";

// Result Pages
import StudentResult from "./pages/Results/StudentResult";
import AdminResult from "./pages/Results/AdminResult";
import DeleteResult from "./pages/Results/DeleteResult";
import UpdateResultPage from './pages/Results/UpdateResultPage';

// Dashboards
import AdminPanel from "./pages/Admin/Dashboards/AdminPanel";
import FacultyDashboardPage from './pages/Dashboards/FacultyDashboardPage';

// Attendance Pages
import MarkAttendance from './pages/attendance/MarkAttendance';
import AttendanceRequest from './pages/attendance/AttendanceRequest';
import AttendanceChart from './pages/attendance/AttendanceChart';
import MarkSelfAttendance from './pages/attendance/AdminOrFaculty/MarkSelfAttendance ';
import InstructorAttendanceSummary from './pages/attendance/AdminOrFaculty/InstructorAttendanceSummary';
import MyCourses from './pages/attendance/instructor/MyCourses';

// Notification Pages
import NotificationPage from './pages/Notifications/NotificationPage';
import CreateNotification from './pages/Notifications/CreateNotification';

// Faculty Registration Requests
import FacultyRegistration from './pages/Panding/FacultyRegistration';

// Leave Pages
import CreateLeaverequests from './pages/Requests/CreateLeaverequest';
import PendingLeaveRequests from './pages/Panding/Admin/PendingLeaveRequest';
import AllLeaves from './pages/Leave/AllLeaves';
import MyLeaves from './pages/Leave/MyLeaves';

// Activities
import ActivityList from './pages/Activity/ActivityList';

// Documents
import UploadDocuments from './pages/Document/UploadDocuments';
import DocumentViewer from './pages/Document/DocumentViewer';

// Notices
import CreateNotice from './pages/Notice/CreateNotice';

// Payments
import Payment from './components/Payment';
import CreateFee from './pages/paymentPage/FeeStructure/CreateFee';
import MyFeeDetails from './pages/paymentPage/FeeStructure/MyFeeDetails ';

// Schedule
import StudentSchedule from './pages/Schedule/StudentSchedule';
import CreateWeeklySchedule from './pages/Schedule/CreateWeeklySchedule';
import ThemeToggleButton from './components/ThemeTogglebutton';

// Rest page 

import ResetPage from './pages/ResetPage/Resetpage';
import ForgotPassword from './pages/ResetPage/ForgotPassword'

// Unauthorized Page
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
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

            {/* All Roles */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "faculty", "student"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/exam/view-exams" element={<AllExams />} />
              <Route path="/all-results" element={<AdminResult />} />
              <Route path="/update-result" element={<UpdateResultPage />} />
              <Route path="/delete-result" element={<DeleteResult />} />
            </Route>

            {/* Student Only */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path=":id/enroll-course" element={<EnrollCourse />} />
              <Route path="/student-exam/:id" element={<SubmitExam />} />
              <Route path="/student-exam" element={<StudentExams />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/fee-details" element={<MyFeeDetails />} />
            </Route>
            <Route path="/studentDashboard" element={<StudentDashBoard />} />
            <Route path="/my-results" element={<StudentResult />} />

            {/* Admin + Faculty */}
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
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/AdminDashboard" element={<AdminPanel />} />
              <Route path="/create-fee-structure" element={<CreateFee />} />
            </Route>

            {/* Faculty Only */}
            <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
              <Route path="/faculty-portal" element={<FacultyDashboardPage />} />
            </Route>

            {/* Attendance */}
            <Route path="/attendance" element={<MarkAttendance />} />
            <Route path="/attendance-request" element={<AttendanceRequest />} />
            <Route path="/attendance-record" element={<AttendanceChart />} />
            <Route path="/self-attendance" element={<MarkSelfAttendance />} />
            <Route path="/students-attendance-summary/:courseId" element={<InstructorAttendanceSummary />} /> 
            <Route path="/instructor-courses" element={<MyCourses />} />

            {/* Notifications */}
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/create-notification" element={<CreateNotification />} />

            {/* Faculty Registration */}
            <Route path="/account-requests" element={<FacultyRegistration />} />
            <Route path="/course-pending-requests" element={<PendingCourseRequest />} />

            {/* Leaves */}
            <Route path="/submit-leave-request" element={<CreateLeaverequests />} />
            <Route path="/pending-request" element={<PendingLeaveRequests />} />
            <Route path="/all-leave-record" element={<AllLeaves />} />
            <Route path="/my-leaves" element={<MyLeaves />} />

            {/* Activities */}
            <Route path="/activities" element={<ActivityList />} />

            {/* Documents */}
            <Route path="/upload-document" element={<UploadDocuments />} />
            <Route path="/assignment" element={<DocumentViewer />} />

            {/* Notices */}
            <Route path="/create-notice" element={<CreateNotice />} />

            {/* Schedule */}
            <Route path="/schedule" element={<StudentSchedule />} />
            <Route path="/create-schedule" element={<CreateWeeklySchedule />} />
            <Route path='/theme' element ={<ThemeToggleButton/>} />

            <Route path="/reset-password/:token" element={<ResetPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Unauthorized page */}

            <Route path="unauthorized" element={<Unauthorized />} />
          </Routes>
          <Footer />
        </NoticeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
