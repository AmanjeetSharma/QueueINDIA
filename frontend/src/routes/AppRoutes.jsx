import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/home/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Navbar from "../components/Navbar.jsx";
import SetPassword from "../pages/Profile/SetPassword.jsx";

// Route protection components
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProtectedAuthRoute from "./ProtectedAuthRoute.jsx";
import AuthorizedRoles from "./AuthorizedRoles.jsx";

// Info page imports
import HowThingsWork from "../pages/info/HowThingsWork.jsx";
import Contact from "../pages/info/Contact.jsx";
import Pricing from "../pages/info/Pricing.jsx";
import AboutUs from "../pages/info/AboutUs.jsx";
import PrivacyPolicy from "../pages/info/PrivacyPolicy.jsx";
import Terms from "../pages/info/Terms.jsx";

import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

//Department related imports
import Departments from "../pages/department/Department.jsx";
import DepartmentDetails from "../pages/department/DepartmentDetails.jsx";
import ServiceDetails from "../pages/DepartmentServices/ServiceDetails.jsx";

//Booking imports
import BookingWrapper from "../pages/booking/BookingWrapper.jsx";
import BookingDateSelect from "../pages/booking/steps/BookingDateSelect.jsx";
import BookingTimeSelect from "../pages/booking/steps/BookingTimeSelect.jsx";
import BookingDetailsForm from "../pages/booking/steps/BookingDetailsForm.jsx";
import BookingConfirmation from "../pages/booking/steps/BookingConfirmation.jsx";
import BookingSuccess from "../pages/booking/steps/BookingSuccess.jsx";
import UserBookings from "../pages/booking/UserBookings.jsx";
import BookingDetails from "../pages/booking/BookingDetails.jsx";

//Dashboard import
import Dashboard from "../pages/dashboard/Dashboard.jsx";



//Panel imports
import SuperAdminPanel from "../pages/admin/superAdminPanel/SuperAdminPanel.jsx";
import UserManagementTab from "../pages/admin/superAdminPanel/components/UserManagement/UserManagementTab.jsx";

import DepartmentManagementTab from "../pages/admin/superAdminPanel/components/DepartmentManagement/DepartmentManagementTab.jsx";
import DepartmentCreate from "../pages/admin/superAdminPanel/components/DepartmentManagement/DepartmentCreate.jsx";

import DashboardTab from "../pages/admin/superAdminPanel/components/DashboardTab.jsx";
import DepartmentEdit from "../pages/admin/superAdminPanel/components/DepartmentManagement/DepartmentEdit.jsx";
import ManageDepartmentWork from "../pages/admin/superAdminPanel/components/DepartmentManagement/ManageDepartmentWork.jsx";



import AdminPanel from "../pages/admin/adminPanel/AdminPanel.jsx";
import StaffList from "../pages/manageStaff/StaffList.jsx";




import OfficerPanel from "../pages/admin/officerPanel/OfficerPanel.jsx";
import BookingsList from "../pages/admin/officerPanel/components/BookingsList.jsx";
import BookingDetailsPage from "../pages/admin/officerPanel/components/BookingDetailsPage.jsx";
import QueueListServices from "../pages/queue/QueueListServices.jsx";
import QueueManagement from "../pages/queue/QueueManagement.jsx";
import AnalyticsPage from "../pages/admin/officerPanel/components/AnalyticsPage.jsx";

import NotFound from "../pages/NotFound.jsx";

import ScrollToTop from "../components/ScrollToTop.jsx";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/departments/:deptId" element={<DepartmentDetails />} />
        <Route path="/departments/:deptId/services/:serviceId" element={<ServiceDetails />} />


        {/* Info Pages */}
        <Route path="/how-things-work" element={<HowThingsWork />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<Terms />} />





        {/* Auth Routes - redirect if logged in */}
        <Route path="/login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />
        <Route path="/register" element={<ProtectedAuthRoute><Register /></ProtectedAuthRoute>} />
        <Route path="/forgot-password" element={<ProtectedAuthRoute><ForgotPassword /></ProtectedAuthRoute>} />
        <Route path="/reset-password" element={<ProtectedAuthRoute><ResetPassword /></ProtectedAuthRoute>} />






        {/* Protected User Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><UserBookings /></ProtectedRoute>} />
        <Route path="/bookings/:bookingId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
        <Route path="/set-google-password" element={<ProtectedRoute><SetPassword /></ProtectedRoute>} />







        {/* Booking Flow */}
        <Route path="/departments/:deptId/services/:serviceId/book-slot" element={<ProtectedRoute><BookingWrapper /></ProtectedRoute>}>
          <Route index element={<Navigate to="date" replace />} />
          <Route path="date" element={<BookingDateSelect />} />
          <Route path="time" element={<BookingTimeSelect />} />
          <Route path="details" element={<BookingDetailsForm />} />
          <Route path="confirm" element={<BookingConfirmation />} />
        </Route>

        <Route path="/booking-success/:bookingId" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />







        {/* Super Admin Routes */}
        <Route path="/super-admin-panel" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><SuperAdminPanel /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/dashboard" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DashboardTab /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/users" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><UserManagementTab /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/departments" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DepartmentManagementTab /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/departments/create" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DepartmentCreate /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/departments/:deptId/edit" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><DepartmentEdit /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/departments/:deptId/manage-work" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><ManageDepartmentWork /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/departments/:deptId/manage-work/bookings" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><BookingsList /></AuthorizedRoles>} />
        <Route path="/super-admin-panel/departments/:deptId/manage-work/bookings/:bookingId" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><BookingDetailsPage /></AuthorizedRoles>} />







        {/* Admin Routes */}
        <Route path="/admin-panel" element={<AuthorizedRoles allowedRoles={['ADMIN']}><AdminPanel /></AuthorizedRoles>} />
        <Route path="/admin-panel/:deptId/edit" element={<AuthorizedRoles allowedRoles={['ADMIN']}><DepartmentEdit /></AuthorizedRoles>} />




        {/* Officer Routes */}
        <Route path="/officer-panel" element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER']}><OfficerPanel /></AuthorizedRoles>} />







        {/* Shared Admin/Staff Routes */}
        <Route path="/department/bookings" element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><BookingsList /></AuthorizedRoles>} />
        <Route path="/department/:departmentId/bookings" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><BookingsList /></AuthorizedRoles>} />
        <Route path="/department/bookings/:bookingId" element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><BookingDetailsPage /></AuthorizedRoles>} />

        <Route path="/department/queue-services" element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><QueueListServices /></AuthorizedRoles>} />
        <Route path="/department/:departmentId/queue-services" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><QueueListServices /></AuthorizedRoles>} />
        <Route path="/department/queue-management/:departmentId/:serviceId" element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><QueueManagement /></AuthorizedRoles>} />
        <Route path="/department/analytics" element={<AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN']}><AnalyticsPage /></AuthorizedRoles>} />
        <Route path="/department/:departmentId/analytics" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN']}><AnalyticsPage /></AuthorizedRoles>} />

        <Route path="/department/:departmentId/admins" element={<AuthorizedRoles allowedRoles={['SUPER_ADMIN', 'ADMIN']}><StaffList /></AuthorizedRoles>} />











        {/* 404 */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;