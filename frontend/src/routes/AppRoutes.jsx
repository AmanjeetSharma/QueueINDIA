import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/home/Home.jsx";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/Profile/Profile.jsx";
import Navbar from "../components/Navbar";

// Route protection components
import ProtectedRoute from "./ProtectedRoute";
import ProtectedAuthRoute from "./ProtectedAuthRoute";
import AuthorizedRoles from "./AuthorizedRoles";

// Info page imports
import HowThingsWork from "../pages/info/HowThingsWork.jsx";
import Contact from "../pages/info/Contact.jsx";
import Pricing from "../pages/info/Pricing.jsx";
import AboutUs from "../pages/info/AboutUs.jsx";

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
import DashboardTab from "../pages/admin/superAdminPanel/components/DashboardTab.jsx";

import AdminPanel from "../pages/admin/adminPanel/AdminPanel.jsx";
import OfficerPanel from "../pages/admin/officerPanel/OfficerPanel.jsx";

import NotFound from "../pages/NotFound.jsx";

import ScrollToTop from "../components/ScrollToTop.jsx";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        {/* Auth routes - redirect to home if already logged in */}
        <Route
          path="/login"
          element={
            <ProtectedAuthRoute>
              <Login />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedAuthRoute>
              <Register />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedAuthRoute>
              <ForgotPassword />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedAuthRoute>
              <ResetPassword />
            </ProtectedAuthRoute>
          }
        />




        {/* Protected routes - redirect to login if not authenticated */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />







        {/* Role-specific panels with authorization */}


        {/* Super Admin Panel Routes */}
        <Route
          path="/super-admin-panel"
          element={
            <AuthorizedRoles allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminPanel />
            </AuthorizedRoles>
          }
        >
        </Route>

        <Route
          path="/super-admin-panel/dashboard"
          element={
            <AuthorizedRoles allowedRoles={['SUPER_ADMIN']}>
              <DashboardTab />
            </AuthorizedRoles>
          }
        />

        <Route
          path="/super-admin-panel/users"
          element={
            <AuthorizedRoles allowedRoles={['SUPER_ADMIN']}>
              <UserManagementTab />
            </AuthorizedRoles>
          }
        />

        <Route
          path="/super-admin-panel/departments"
          element={
            <AuthorizedRoles allowedRoles={['SUPER_ADMIN']}>
              <DepartmentManagementTab />
            </AuthorizedRoles>
          }
        />








        <Route
          path="/admin-panel"
          element={
            <AuthorizedRoles allowedRoles={['ADMIN']}>
              <AdminPanel />
            </AuthorizedRoles>
          }
        />

        <Route
          path="/officer-panel"
          element={
            <AuthorizedRoles allowedRoles={['DEPARTMENT_OFFICER']}>
              <OfficerPanel />
            </AuthorizedRoles>
          }
        />






        {/* Booking related routes */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <UserBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />

        {/* Booking flow - multi-step protected route */}
        <Route
          path="/departments/:deptId/services/:serviceId/book-slot"
          element={
            <ProtectedRoute>
              <BookingWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="date" replace />} />
          <Route path="date" element={<BookingDateSelect />} />
          <Route path="time" element={<BookingTimeSelect />} />
          <Route path="details" element={<BookingDetailsForm />} />
          <Route path="confirm" element={<BookingConfirmation />} />
          {/* Remove success from here */}
        </Route>

        {/* Add separate success route */}
        <Route
          path="/booking-success/:bookingId"
          element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />









        {/* Public department routes */}
        <Route path="/departments" element={<Departments />} />
        <Route path="/departments/:deptId" element={<DepartmentDetails />} />
        <Route path="/departments/:deptId/services/:serviceId" element={<ServiceDetails />} />

        {/* Public routes */}
        <Route path="/how-things-work" element={<HowThingsWork />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;