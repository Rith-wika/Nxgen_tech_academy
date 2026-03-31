import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GTMPageView from "./GTMPageView";
import { Helmet } from 'react-helmet-async';
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { TopBar } from "./components/TopBar"; // New Import
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CategoryListing from "./pages/CategoryListing";
import CourseDetail from "./pages/CourseDetail";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import WhyChooseUs from "./pages/WhyChooseUs";
import Mentors from "./pages/Mentors";
import { categories } from './data';

// New Pages
import AllCourses from "./pages/AllCourses";
import Blogs from "./pages/Blogs";
import SAPCategory from "./pages/SAPCategory";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ChangePassword from "./pages/Auth/ChangePassword";
import MainDashboard from "./pages/Admin/MainDashboard";
import StudentsPage from "./pages/Admin/StudentsPage";
import InstructorsPage from "./pages/Admin/InstructorsPage";
import AddInstructor from "./pages/Admin/AddInstructor";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import InstructorProfile from "./pages/Instructor/InstructorProfile";
import InstructorCourses from "./pages/Instructor/InstructorCourses";
import InstructorLessons from "./pages/Instructor/InstructorLessons";
import InstructorModuleLessons from "./pages/Instructor/InstructorModuleLessons";
import InstructorStudents from "./pages/Instructor/InstructorStudents";
import InstructorAssignments from "./pages/Instructor/InstructorAssignments";
import AdminBatches from "./pages/Admin/AdminBatches";
import AdminCourses from "./pages/Admin/AdminCourses";
import InstructorTopics from "./pages/Instructor/InstructorTopics";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentCourses from "./pages/Student/StudentCourses";
import StudentProgress from "./pages/Student/StudentProgress";
import StudentCertificates from "./pages/Student/StudentCertificates";
import StudentProfile from "./pages/Student/StudentProfile";
import BlogDashboard from "./pages/BlogAdmin/BlogDashboard";
import CourseViewer from "./pages/Dashboard/CourseViewer";
import BlogDetail from "./pages/BlogDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import { useLocation, useParams } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const authPages = ["/register", "/login", "/student-login", "/instructor-login", "/admin-login"];
  const isAuthPage = authPages.includes(location.pathname);

  const role = localStorage.getItem("role");
  const isDashboardPage = location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/instructor") ||
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/blog-admin");

  const token = localStorage.getItem("access_token");
  const isUserLoggedIn = !!token;

  // Hide TopBar, Navbar, and Footer for auth pages OR when logged in on any dashboard
  const hideComponents = isAuthPage || (isUserLoggedIn && isDashboardPage);

  return (
    <>
      <GTMPageView />
      <ScrollToTop />
      {!hideComponents && <TopBar />}
      {!hideComponents && <Navbar />}
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="courses" element={<Courses />} />
          <Route path="/all-courses" element={<AllCourses />} />
          <Route path="courses-menu" element={<AllCourses />} />
          <Route path="/sap-courses" element={<SAPCategory />} />
          <Route path="courses/sap-technical" element={<CategoryListing categorySlug="sap-technical" />} />
          <Route path="courses/sap-functional" element={<CategoryListing categorySlug="sap-functional" />} />
          <Route path="courses/python" element={<CategoryListing categorySlug="python" />} />
          <Route path="courses/ai" element={<CourseDetail id="artificial-intelligence-training-hyderabad" />} />
          <Route path="courses/aiml" element={<CourseDetail id="aiml-training-hyderabad" />} />
          <Route path="courses/digital-marketing" element={<CategoryListing categorySlug="digital-marketing" />} />
          <Route path="courses/sap-btp" element={<CategoryListing categorySlug="sap-btp" />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="mentors" element={<Mentors />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="why-choose-us" element={<WhyChooseUs />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:slug" element={<BlogDetail />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Legacy Login Routes (Redirecting to new login) */}
          <Route path="student-login" element={<Login />} />
          <Route path="instructor-login" element={<Login />} />
          <Route path="admin-login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route path="admin/*" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Routes>
                <Route path="/" element={<MainDashboard />} />
                <Route path="dashboard" element={<MainDashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="instructors" element={<InstructorsPage />} />
                <Route path="instructors/add" element={<AddInstructor />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="batches" element={<AdminBatches />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="instructor/*" element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <Routes>
                <Route path="/" element={<InstructorDashboard />} />
                <Route path="dashboard" element={<InstructorDashboard />} />
                <Route path="courses" element={<InstructorCourses />} />
                <Route path="courses/:courseId/lessons" element={<InstructorLessons />} />
                <Route path="courses/:courseId/modules/:moduleId/lessons" element={<InstructorModuleLessons />} />
                <Route path="lessons/:lessonId/topics" element={<InstructorTopics />} />
                <Route path="students" element={<InstructorStudents />} />
                <Route path="assignments" element={<InstructorAssignments />} />
                <Route path="profile" element={<InstructorProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="student/*" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="progress" element={<StudentProgress />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="course/:id" element={<CourseViewer />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="blog-admin/*" element={
            <ProtectedRoute allowedRoles={["blog_admin"]}>
              <BlogDashboard />
            </ProtectedRoute>
          } />

          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideComponents && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen text-black bg-white">
        <Helmet>
          <title>NxGen Tech Academy - Best IT Training & Placement Institute in Hyderabad</title>
          <meta name="description" content="Join Our 100% Job Guarantee Courses. NxGen Tech Academy offers best IT training in Hyderabad." />
          <meta name="keywords" content={categories.map(c => c.name).join(', ')} />
        </Helmet>

        <Toaster />
        <Sonner />
        <Preloader />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
