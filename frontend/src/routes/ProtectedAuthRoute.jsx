import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAuthRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAuthRoute;