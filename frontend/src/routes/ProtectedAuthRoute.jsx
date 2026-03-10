import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../utils/loader/Loader";

const ProtectedAuthRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAuthRoute;