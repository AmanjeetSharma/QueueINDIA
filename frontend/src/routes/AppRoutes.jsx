import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "../components/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProtectedAuthRoute from "./ProtectedAuthRoute.jsx";
import AuthorizedRoles from "./AuthorizedRoles.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

/* =======================
   LAZY LOADED PAGES
======================= */

// Public
const Home = lazy(() => import("../pages/home/Home.jsx"));
const Departments = lazy(() => import("../pages/department/Department.jsx"));
const DepartmentDetails = lazy(() => import("../pages/department/DepartmentDetails.jsx"));
const ServiceDetails = lazy(() => import("../pages/DepartmentServices/ServiceDetails.jsx"));

// Info
const HowThingsWork = lazy(() => import("../pages/info/HowThingsWork.jsx"));
const Contact = lazy(() => import("../pages/info/Contact.jsx"));
const Pricing = lazy(() => import("../pages/info/Pricing.jsx"));
const AboutUs = lazy(() => import("../pages/info/AboutUs.jsx"));
const PrivacyPolicy = lazy(() => import("../pages/info/PrivacyPolicy.jsx"));
const Terms = lazy(() => import("../pages/info/Terms.jsx"));

// Auth
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword.jsx"));
const ResetPasswordPhone = lazy(() => import("../pages/auth/ResetPasswordPhone.jsx"));

// User
const Profile = lazy(() => import("../pages/Profile/Profile.jsx"));
const SetPassword = lazy(() => import("../pages/Profile/SetPassword.jsx"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.jsx"));
const UserBookings = lazy(() => import("../pages/booking/UserBookings.jsx"));
const BookingDetails = lazy(() => import("../pages/booking/BookingDetails.jsx"));

// Booking Flow
const BookingWrapper = lazy(() => import("../pages/booking/BookingWrapper.jsx"));
const BookingDateSelect = lazy(() => import("../pages/booking/steps/BookingDateSelect.jsx"));
const BookingTimeSelect = lazy(() => import("../pages/booking/steps/BookingTimeSelect.jsx"));
const BookingDetailsForm = lazy(() => import("../pages/booking/steps/BookingDetailsForm.jsx"));
const BookingConfirmation = lazy(() => import("../pages/booking/steps/BookingConfirmation.jsx"));
const BookingSuccess = lazy(() => import("../pages/booking/steps/BookingSuccess.jsx"));

// Super Admin
const SuperAdminPanel = lazy(() => import("../pages/admin/superAdminPanel/SuperAdminPanel.jsx"));
const UserManagementTab = lazy(() => import("../pages/admin/superAdminPanel/components/UserManagement/UserManagementTab.jsx"));
const DepartmentManagementTab = lazy(() => import("../pages/admin/superAdminPanel/components/DepartmentManagement/DepartmentManagementTab.jsx"));
const DepartmentCreate = lazy(() => import("../pages/admin/superAdminPanel/components/DepartmentManagement/DepartmentCreate.jsx"));
const DashboardTab = lazy(() => import("../pages/admin/superAdminPanel/components/DashboardTab.jsx"));
const DepartmentEdit = lazy(() => import("../pages/admin/superAdminPanel/components/DepartmentManagement/DepartmentEdit.jsx"));
const ManageDepartmentWork = lazy(() => import("../pages/admin/superAdminPanel/components/DepartmentManagement/ManageDepartmentWork.jsx"));

// Admin
const AdminPanel = lazy(() => import("../pages/admin/adminPanel/AdminPanel.jsx"));
const StaffList = lazy(() => import("../pages/manageStaff/StaffList.jsx"));

// Officer
const OfficerPanel = lazy(() => import("../pages/admin/officerPanel/OfficerPanel.jsx"));
const BookingsList = lazy(() => import("../pages/admin/officerPanel/components/BookingsList.jsx"));
const BookingDetailsPage = lazy(() => import("../pages/admin/officerPanel/components/BookingDetailsPage.jsx"));
const QueueListServices = lazy(() => import("../pages/queue/QueueListServices.jsx"));
const QueueManagement = lazy(() => import("../pages/queue/QueueManagement.jsx"));
const AnalyticsPage = lazy(() => import("../pages/admin/officerPanel/components/AnalyticsPage.jsx"));

const NotFound = lazy(() => import("../pages/NotFound.jsx"));

/* ======================= */

const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "100px" }}>
    Loading...
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:deptId" element={<DepartmentDetails />} />
          <Route path="/departments/:deptId/services/:serviceId" element={<ServiceDetails />} />



          {/* Info */}
          <Route path="/how-things-work" element={<HowThingsWork />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<Terms />} />



          {/* Auth */}
          <Route path="/login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />
          <Route path="/register" element={<ProtectedAuthRoute><Register /></ProtectedAuthRoute>} />
          <Route path="/forgot-password" element={<ProtectedAuthRoute><ForgotPassword /></ProtectedAuthRoute>} />
          <Route path="/reset-password" element={<ProtectedAuthRoute><ResetPassword /></ProtectedAuthRoute>} />
          <Route path="/reset-password-phone" element={<ProtectedAuthRoute><ResetPasswordPhone /></ProtectedAuthRoute>} />



          {/* Protected User */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><UserBookings /></ProtectedRoute>} />
          <Route path="/bookings/:bookingId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
          <Route path="/set-google-password" element={<ProtectedRoute><SetPassword /></ProtectedRoute>} />







          {/* Booking Flow */}
          <Route path="/departments/:deptId/services/:serviceId/book-slot"
            element={<ProtectedRoute><BookingWrapper /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="date" replace />} />
            <Route path="date" element={<BookingDateSelect />} />
            <Route path="time" element={<BookingTimeSelect />} />
            <Route path="details" element={<BookingDetailsForm />} />
            <Route path="confirm" element={<BookingConfirmation />} />
          </Route>

          <Route path="/booking-success/:bookingId"
            element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>}
          />







          {/* Super Admin */}
          <Route path="/super-admin-panel"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><SuperAdminPanel /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/dashboard"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DashboardTab /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/users"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><UserManagementTab /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/departments"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DepartmentManagementTab /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/departments/create"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DepartmentCreate /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/departments/:deptId/edit"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DepartmentEdit /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/departments/:deptId/manage-work"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><ManageDepartmentWork /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/departments/:deptId/manage-work/bookings"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><BookingsList /></AuthorizedRoles>}
          />
          <Route path="/super-admin-panel/departments/:deptId/manage-work/bookings/:bookingId"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><BookingDetailsPage /></AuthorizedRoles>}
          />






          {/* Admin */}
          <Route path="/admin-panel"
            element={<AuthorizedRoles allowedRoles={['ADMIN']}><AdminPanel /></AuthorizedRoles>}
          />
          <Route path="/admin-panel/:deptId/edit"
            element={<AuthorizedRoles allowedRoles={['ADMIN']}><DepartmentEdit /></AuthorizedRoles>}
          />







          {/* Officer */}
          <Route path="/officer-panel"
            element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER']}><OfficerPanel /></AuthorizedRoles>}
          />








          {/* Shared */}
          <Route path="/department/bookings"
            element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><BookingsList /></AuthorizedRoles>}
          />
          <Route path="/department/:departmentId/bookings"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><BookingsList /></AuthorizedRoles>}
          />
          <Route path="/department/bookings/:bookingId"
            element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><BookingDetailsPage /></AuthorizedRoles>}
          />

          <Route path="/department/queue-services"
            element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><QueueListServices /></AuthorizedRoles>}
          />
          <Route path="/department/:departmentId/queue-services"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><QueueListServices /></AuthorizedRoles>}
          />
          <Route path="/department/queue-management/:departmentId/:serviceId"
            element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><QueueManagement /></AuthorizedRoles>}
          />

          <Route path="/department/analytics"
            element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><AnalyticsPage /></AuthorizedRoles>}
          />
          <Route path="/department/:departmentId/analytics"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><AnalyticsPage /></AuthorizedRoles>}
          />

          <Route path="/department/:departmentId/admins"
            element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN', 'ADMIN']}><StaffList /></AuthorizedRoles>}
          />




          {/* 404 */}
          <Route path="*" element={<NotFound />} />



        </Routes>
      </Suspense>

    </BrowserRouter>
  );
};

export default AppRoutes;