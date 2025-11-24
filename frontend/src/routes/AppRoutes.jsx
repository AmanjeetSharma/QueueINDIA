import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/Profile/Profile.jsx";
import Navbar from "../components/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedAuthRoute from "./ProtectedAuthRoute";
import Services from "../pages/info/Services.jsx";
import Contact from "../pages/info/Contact.jsx";
import Pricing from "../pages/info/Pricing.jsx";
import AboutUs from "../pages/info/AboutUs.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import AdminPannel from "../pages/admin/AdminPannel.jsx";
import Departments from "../pages/department/Department.jsx";
import DepartmentDetails from "../pages/department/DepartmentDetails.jsx";
import ServiceDetails from "../pages/DepartmentServices/ServiceDetails.jsx";
import SlotBooking from "../pages/DepartmentServices/SlotBooking.jsx";
import NotFound from "../pages/NotFound.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
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
          path="/departments/:deptId/services/:serviceId/book-slot"
          element={
            <ProtectedRoute>
              <SlotBooking />
            </ProtectedRoute>
          } />

        {/* Public department routes */}
        <Route path="/departments" element={<Departments />} />
        <Route path="/departments/:deptId" element={<DepartmentDetails />} />
        <Route path="/departments/:deptId/services/:serviceId" element={<ServiceDetails />} />

        {/* Public routes */}
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />

        {/* 404 route */}
        <Route path="*" element={
          <NotFound />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;