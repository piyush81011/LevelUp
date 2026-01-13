import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";

import ProtectedRoute from "./components/secure/ProtectedRoute.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import MyCourses from "./pages/student/MyCourses.jsx";
import Certificates from "./pages/student/Certificates.jsx";
import Settings from "./pages/student/Settings.jsx";
import CoursePlayer from "./pages/student/CoursePlayer.jsx";
import Certificate from "./pages/student/Certificate.jsx";

import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import InstructorCourses from "./pages/instructor/InstructorCourses.jsx";
import InstructorStudents from "./pages/instructor/InstructorStudents.jsx";
import InstructorEarnings from "./pages/instructor/InstructorEarnings.jsx";
import InstructorSettings from "./pages/instructor/InstructorSettings.jsx";
import CreateCourse from "./pages/instructor/CreateCourse.jsx";
import ManageCourse from "./pages/instructor/ManageCourse.jsx";
import EditCourse from "./pages/instructor/EditCourse.jsx";
import InstructorMessages from "./pages/instructor/InstructorMessages.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCourses from "./pages/admin/AdminCourses.jsx";
import AdminEnrollments from "./pages/admin/AdminEnrollments.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

import Home from "./pages/public/Home.jsx";
import CourseDetails from "./pages/public/CourseDetails.jsx";
import Support from "./pages/public/Support.jsx";

// Placeholder Pages
// const Home = () => <div className="p-8 text-center text-3xl font-bold text-gray-800">Welcome to the LMS Platform</div>;
const NotFound = () => <div className="p-8 text-center text-red-500">404 - Page Not Found</div>;

// Layout wrapper to conditionally show footer and navbar
const AppLayout = ({ children }) => {
  const location = useLocation();

  // Hide footer on dashboard pages
  const isDashboardPage = location.pathname.includes('/dashboard') ||
    location.pathname.includes('/instructor/') ||
    location.pathname.includes('/admin/') ||
    location.pathname.includes('/student/');

  // Hide navbar on course player and certificate pages (they have their own nav)
  const isFullscreenPage = location.pathname.includes('/learn') ||
    location.pathname.includes('/certificate');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {!isFullscreenPage && <Navbar />}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {!isDashboardPage && !isFullscreenPage && <Footer />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student", "admin", "instructor"]} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<MyCourses />} />
              <Route path="/student/certificates" element={<Certificates />} />
              <Route path="/student/settings" element={<Settings />} />
              <Route path="/course/:courseId/learn" element={<CoursePlayer />} />
              <Route path="/course/:courseId/certificate" element={<Certificate />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["instructor", "admin"]} />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/courses" element={<InstructorCourses />} />
              <Route path="/instructor/students" element={<InstructorStudents />} />
              <Route path="/instructor/earnings" element={<InstructorEarnings />} />
              <Route path="/instructor/settings" element={<InstructorSettings />} />
              <Route path="/instructor/create-course" element={<CreateCourse />} />
              <Route path="/instructor/course/:courseId/edit" element={<EditCourse />} />
              <Route path="/instructor/course/:courseId/manage" element={<ManageCourse />} />
              <Route path="/instructor/messages" element={<InstructorMessages />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/enrollments" element={<AdminEnrollments />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
