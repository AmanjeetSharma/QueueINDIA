import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../lib/http";
import toast from "react-hot-toast";
import { FaEnvelope } from 'react-icons/fa';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);      // null until loaded, object when logged in
    const [loading, setLoading] = useState(true);

    // Fetch current profile (requires valid access token cookie)
    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/users/profile");
            setUser(data?.data || data?.user || null);
        } catch (err) {
            console.error("❌ Fetch profile error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Attempt silent auth on mount: profile -> if 401 then interceptor will try /auth/refresh
        fetchProfile();
    }, [fetchProfile]);

    const register = async (formData) => {
        try {
            await axiosInstance.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Registration successful! Please login.", {
                duration: 3000,
                position: "bottom-left"
            });
        } catch (err) {
            console.error("❌ Register error:", err);
            const msg = err?.response?.data?.message || "Registration failed. Please try again.";
            toast.error(msg, {
                duration: 4000,
                position: "bottom-left"
            });
            throw err;
        }
    };

    const login = async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data);

            // ✅ allow cookies to settle
            await new Promise((resolve) => setTimeout(resolve, 120));

            // ✅ try profile fetch, but don't override login toast if it fails
            try {
                await fetchProfile();
                // console.log("Avatar from DB:", user.avatar);

            } catch (e) {
                console.warn("Profile fetch after login failed (ignored):", e);
            }

            toast.success(`Welcome back! ${res.data?.data?.user.name || 'User'}`, {
                duration: 5000,
                position: "bottom-left",
            });

            return res.data;

        } catch (err) {
            console.log("Login error:", err.response?.data); // <-- we see actual backend error now

            const msg = err?.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(msg, {
                duration: 3000,
                position: "bottom-left",
            });

            throw err;
        }
    };



    // Add this to your AuthContext functions
    const googleLogin = async (googleData) => {
        try {
            const res = await axiosInstance.post('/oauth2/google-login', googleData);
            const { user } = res.data.data;
            fetchProfile(); // refresh profile
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success(res.data.message || "Successfully logged in with Google!", {
                duration: 3000,
                position: "bottom-left"
            });
        } catch (err) {
            handleError(err);
            throw err;
        }
    };



    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setUser(null);
            toast.success("Logged out successfully", {
                duration: 3000,
                position: "bottom-left"
            });
        } catch (err) {
            console.error("❌ Logout error:", err);
            const msg = err?.response?.data?.message || "Logout failed";
            toast.error(msg, {
                duration: 3000,
                position: "bottom-left"
            });
            throw err;
        }
    };




    const logoutAll = async () => {
        try {
            await axiosInstance.post("/auth/logout-all");
            setUser(null);
            toast.success("Logged out from all devices", {
                duration: 3000,
                position: "bottom-left"
            });
        } catch (err) {
            console.error("❌ Logout all error:", err);
            const msg = err?.response?.data?.message || "Logout failed";
            toast.error(msg, {
                duration: 3000,
                position: "bottom-left"
            });
            throw err;
        }
    };




    const updateProfile = async (formData) => {
        try {
            const isFormData = formData instanceof FormData;
            // console.log("Updating profile with data:", formData);
            const res = await axiosInstance.patch("/users/update-profile", formData, {
                headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined
            });
            setUser(res.data?.data || res.data?.user || null);
            toast.success("Profile updated successfully!", {
                duration: 3000,
                position: "bottom-left"
            });
            return res.data;
        } catch (err) {
            console.error("❌ Update profile error:", err);
            const msg = err?.response?.data?.message || "Profile update failed";
            toast.error(msg, {
                duration: 3000,
                position: "bottom-left"
            });
            throw err;
        }
    };




    const changePassword = async (passwordData) => {
        try {
            const payload = {
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            };

            const res = await axiosInstance.patch("/users/change-password", payload);

            toast.success("Password changed successfully. Please log in again.", {
                duration: 5000,
                position: "bottom-left"
            });

            // Just clear auth state — DO NOT REDIRECT HERE
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            return res.data;
        } catch (err) {
            const msg = err?.response?.data?.message || "Password change failed";
            toast.error(msg, { duration: 3000, position: "bottom-left" });
            throw err;
        }
    };





    const deleteAccount = async () => {
        try {
            const res = await axiosInstance.delete("/users/delete-account");
            setUser(null);
            toast.success("Account deleted successfully!", {
                duration: 3000,
                position: "bottom-left"
            });
            return res.data;
        } catch (err) {
            console.error("❌ Delete account error:", err);
            const msg = err?.response?.data?.message || "Account deletion failed";
            toast.error(msg, {
                duration: 3000,
                position: "bottom-left"
            });
            throw err;
        }
    };




    const sessions = async () => {
        try {
            const res = await axiosInstance.get("/users/sessions");
            // console.log("✅ Fetched user sessions");
            return res.data;
        } catch (err) {
            console.error("❌ Fetch sessions error:", err);
            const msg = err?.response?.data?.message || "Failed to fetch sessions";
            toast.error(msg, {
                duration: 3000,
                position: "bottom-left"
            });
            throw err;
        }
    };





    const addPhone = async (phone) => {
        try {
            const res = await axiosInstance.post("/users/phone/add", { phone }, {
                headers: { "Content-Type": "application/json" }
            });
            toast.success(res.data.message + "\nValid for: 10 minutes", {
                duration: 3000,
                position: "bottom-left"
            });
            return res.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP. Please try again.", {
                duration: 3000,
                position: "bottom-left"
            });
            console.error("❌ Add phone error:", error);
            handleError(error);
        }
    };




    // ✅ Verify Phone (Verify OTP)
    const verifyPhone = async (otp) => {
        try {
            const res = await axiosInstance.post("/users/phone/verify", { otp }, {
                headers: { "Content-Type": "application/json" }
            });
            toast.success("Phone verified successfully!", {
                duration: 3000,
                position: "bottom-left"
            });
            await fetchProfile(); // ✅ refresh user
            return res.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Phone verification failed. Please try again.", {
                duration: 3000,
                position: "bottom-left"
            });
            console.error("❌ Verify phone error:", error);
            handleError(error);
        }
    };






    const addSecondaryEmail = async (secondaryEmail) => {
        try {
            const res = await axiosInstance.post("/users/email/add-secondary", { secondaryEmail }, {
                headers: { "Content-Type": "application/json" }
            });
            toast.success("OTP sent to your email!", {
                duration: 3000,
                position: "bottom-left"
            });
            return res.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP. Please try again.", {
                duration: 3000,
                position: "bottom-left"
            });
            handleError(error);
        }
    };

    const verifySecondaryEmail = async (otp) => {
        try {
            // console.log("Verifying secondary email with OTP:", otp);
            const res = await axiosInstance.post("/users/email/verify-secondary", { otp }, {
                headers: { "Content-Type": "application/json" }
            });
            toast.success("Secondary email verified!", {
                duration: 3000,
                position: "bottom-left"
            });
            await fetchProfile(); // refresh user
            return res.data.data;
        } catch (error) {
            handleError(error);
        }
    };






    // Primary Email Verification
    const sendPrimaryEmailVerification = async () => {
        try {
            const res = await axiosInstance.post(`/users/send-verification/${user._id}`);
            toast.success(
                <div className="flex items-center gap-2">
                    <span>Verification email sent! Check your inbox.</span>
                </div>,
                {
                    duration: 5000,
                    position: "bottom-left",
                    style: {
                        background: '#2563eb', // blue-600
                        color: 'white',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }
                }
            );
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send verification email. Please try again.", {
                duration: 3000,
                position: "bottom-left"
            });
            handleError(error);
            throw error;
        }
    };






    const forgotPasswordEmail = async (email) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/reset-password/forgot-password-email', {
                email
            });

            toast.success(response.data.message || 'Password reset instructions sent to your email!', {
                duration: 3000,
                position: "bottom-left"
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email';
            toast.error(errorMessage, {
                duration: 3000,
                position: "bottom-left"
            });
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordEmail = async (token, newPassword, confirmPassword) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/reset-password/reset-password-email', {
                token,
                newPassword,
                confirmPassword,
            });

            toast.success(response.data.message || 'Password reset successfully!', {
                duration: 3000,
                position: "bottom-left"
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password reset failed';
            toast.error(errorMessage, {
                duration: 3000,
                position: "bottom-left"
            });
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const forgotPasswordPhone = async (phone) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/reset-password/forgot-password-phone', {
                phone
            });

            toast.success(response.data.message || 'OTP sent to your phone!', {
                duration: 3000,
                position: "bottom-left"
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send OTP';
            toast.error(errorMessage, {
                duration: 3000,
                position: "bottom-left"
            });
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordPhone = async (phone, otp, newPassword, confirmPassword) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/reset-password/reset-password-phone', {
                phone,
                otp,
                newPassword,
                confirmPassword,
            });

            toast.success(response.data.message || 'Password reset successfully!', {
                duration: 3000,
                position: "bottom-left"
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password reset failed';
            toast.error(errorMessage, {
                duration: 5000,
                position: "bottom-left"
            });
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };







    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user?._id),
        register,
        login,
        googleLogin,
        logout,
        logoutAll,
        updateProfile,
        changePassword,
        deleteAccount,
        sessions,
        addPhone,
        verifyPhone,
        addSecondaryEmail,
        verifySecondaryEmail,
        sendPrimaryEmailVerification,
        forgotPasswordEmail,
        resetPasswordEmail,
        forgotPasswordPhone,
        resetPasswordPhone,
        refreshProfile: fetchProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);