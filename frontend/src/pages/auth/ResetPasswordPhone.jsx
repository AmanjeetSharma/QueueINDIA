import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaKey,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowLeft,
    FaCheckCircle,
} from "react-icons/fa";

const ResetPasswordPhone = () => {
    const { resetPasswordPhone } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Phone is passed from ForgotPassword via navigate state
    const phone = location.state?.phone || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");

    // Redirect back if phone is missing (navigated here directly)
    useEffect(() => {
        if (!phone) {
            navigate("/forgot-password");
        }
    }, [phone, navigate]);

    // Auto-redirect after success popup
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                navigate("/login", {
                    state: {
                        message:
                            "Password reset successfully! Please login with your new password.",
                    },
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess, navigate]);

    // Password strength calculator
    useEffect(() => {
        const calc = (p) => {
            let s = 0;
            if (p.length >= 8) s++;
            if (/[A-Z]/.test(p)) s++;
            if (/[a-z]/.test(p)) s++;
            if (/[0-9]/.test(p)) s++;
            if (/[^A-Za-z0-9]/.test(p)) s++;
            return s;
        };
        setPasswordStrength(calc(formData.newPassword));
    }, [formData.newPassword]);

    /* ── OTP helpers ── */
    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const next = [...otp];
        pasted.split("").forEach((ch, i) => { next[i] = ch; });
        setOtp(next);
        document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    };

    /* ── Submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            // Backend expects: { phone, otp, newPassword, confirmPassword }
            await resetPasswordPhone(
                phone,
                otpValue,
                formData.newPassword,
                formData.confirmPassword
            );
            setShowSuccess(true);
        } catch (err) {
            console.error("Error resetting password:", err);
            setError(
                err?.response?.data?.message ||
                "Invalid OTP or something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ── UI helpers ── */
    const strengthColor =
        passwordStrength <= 2
            ? "bg-red-500"
            : passwordStrength <= 3
                ? "bg-yellow-500"
                : "bg-green-500";

    const strengthText =
        passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong";

    const strengthTextColor =
        passwordStrength <= 2
            ? "text-red-600"
            : passwordStrength <= 3
                ? "text-yellow-600"
                : "text-green-600";

    const otpComplete = otp.join("").length === 6;
    const passwordsMatch =
        formData.newPassword &&
        formData.confirmPassword &&
        formData.newPassword === formData.confirmPassword;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            {/* ── Success Overlay ── */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-4 max-w-xs w-full mx-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                            >
                                <FaCheckCircle className="w-10 h-10 text-green-500" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-slate-800 text-center">
                                Password Reset!
                            </h2>
                            <p className="text-slate-500 text-sm text-center">
                                Your password has been set successfully. Redirecting you to
                                login…
                            </p>
                            {/* Countdown bar */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 3, ease: "linear" }}
                                    className="h-full bg-green-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-md w-full mx-auto relative">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-16 left-0"
                >
                    <Link
                        to="/forgot-password"
                        className="flex items-center text-slate-600 hover:text-slate-800 transition-colors group"
                    >
                        <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <FaLock className="text-white text-xl" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">
                            Set New Password
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Enter the OTP sent to{" "}
                            <span className="font-semibold text-slate-700">+91 {phone}</span>{" "}
                            and choose a new password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* ── OTP ── */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                                6-Digit OTP
                            </label>
                            <div
                                className="flex justify-center space-x-3"
                                onPaste={handleOtpPaste}
                            >
                                {otp.map((digit, index) => (
                                    <motion.input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.06 }}
                                        className={`w-11 h-12 text-center text-lg font-bold bg-white border-2 rounded-xl focus:outline-none transition-all duration-200 ${digit
                                            ? "border-blue-500 text-blue-700 shadow-sm shadow-blue-100"
                                            : "border-slate-300 text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                            }`}
                                    />
                                ))}
                            </div>
                            {otpComplete && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-xs text-green-600 font-medium mt-2"
                                >
                                    ✓ OTP Filled
                                </motion.p>
                            )}
                        </div>

                        {/* ── New Password ── */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        setFormData((p) => ({ ...p, newPassword: e.target.value }))
                                    }
                                    placeholder="Enter your new password"
                                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="w-4 h-4" />
                                    ) : (
                                        <FaEye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Strength meter */}
                            {formData.newPassword && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-2 space-y-1"
                                >
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Password Strength</span>
                                        <span className={`font-semibold ${strengthTextColor}`}>
                                            {strengthText}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(passwordStrength / 5) * 100}%`,
                                            }}
                                            className={`h-1 rounded-full transition-all duration-300 ${strengthColor}`}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ── Confirm Password ── */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            confirmPassword: e.target.value,
                                        }))
                                    }
                                    placeholder="Confirm your new password"
                                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="w-4 h-4" />
                                    ) : (
                                        <FaEye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {/* Match indicator */}
                            {formData.newPassword && formData.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-2 text-xs font-medium ${passwordsMatch ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {passwordsMatch
                                        ? "✓ Passwords match"
                                        : "✗ Passwords don't match"}
                                </motion.p>
                            )}
                        </div>

                        {/* ── Error ── */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Submit ── */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={
                                loading ||
                                !otpComplete ||
                                !passwordsMatch ||
                                !formData.newPassword
                            }
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                    />
                                    Resetting Password…
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-50 transition-all duration-200"
                        >
                            Try Another Method
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPasswordPhone;