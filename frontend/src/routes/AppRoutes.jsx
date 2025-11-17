import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile/Profile.jsx";
import Navbar from "../components/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedAuthRoute from "./ProtectedAuthRoute"; // Import the new component
import Services from "../pages/info/Services.jsx";
import Contact from "../pages/info/Contact.jsx";
import Pricing from "../pages/info/Pricing.jsx";
import AboutUs from "../pages/info/AboutUs.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import AdminPannel from "../pages/admin/AdminPannel.jsx";

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
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPannel />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<div className="p-8">Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;