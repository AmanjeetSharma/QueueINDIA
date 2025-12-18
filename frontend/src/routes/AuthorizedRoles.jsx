// components/routes/AuthorizedRoles.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthorizedRoles = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is in allowedRoles array
    if (!allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on role
        switch (user?.role) {
            case 'SUPER_ADMIN':
                return <Navigate to="/super-admin-panel" replace />;
            case 'ADMIN':
                return <Navigate to="/admin-panel" replace />;
            case 'DEPARTMENT_OFFICER':
                return <Navigate to="/officer-panel" replace />;
            default:
                return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default AuthorizedRoles;