// pages/ForgotPassword.js
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaEnvelope,
    FaPhone,
    FaArrowLeft,
    FaCheck,
    FaSpinner
} from "react-icons/fa";

const ForgotPassword = () => {
    console.log("ForgotPassword mounted");
    const { forgotPasswordEmail, forgotPasswordPhone } = useAuth();
    const navigate = useNavigate();

    const [selectedMethod, setSelectedMethod] = useState(null); // 'email' or 'phone'
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState(""); // Store the email that was sent to

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        setEmailSent(false);
        setEmail("");
        setPhone("");
        setSentEmail("");
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const result = await forgotPasswordEmail(email);
            console.log("Forgot password email result:", result);
            setSentEmail(email); // Store the email
            setEmailSent(true); // Set success state
            setEmail(""); // Clear input
        } catch (error) {
            // Toast is already handled in context
            console.error("Email send error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) return;

        setLoading(true);
        try {
            await forgotPasswordPhone(phone);
            // Navigate to reset password page with phone number
            navigate("/reset-password-phone", {
                state: { phone: phone }
            });
        } catch (error) {
            // Toast is already handled in context
            console.error("Phone OTP error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.slice(0, 10);
    };

    const goBack = () => {
        setSelectedMethod(null);
        setEmailSent(false);
        setEmail("");
        setPhone("");
        setSentEmail("");
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
        >
            <FaSpinner className="w-5 h-5" />
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
            {/* Animated Background - Adjusted for mobile */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-64 sm:w-80 h-64 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-32 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
            </div>

            <div className="w-full max-w-md mx-auto relative px-2 sm:px-0">
                {/* Back Button - Responsive positioning */}
                {selectedMethod && !emailSent && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={goBack}
                        className="absolute -top-12 sm:-top-16 left-2 sm:left-0 flex items-center text-slate-600 hover:text-slate-800 transition-colors group z-10"
                    >
                        <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm sm:text-base">Back</span>
                    </motion.button>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 sm:bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-5 sm:p-8"
                >
                    {/* Header - Responsive text sizes */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                            Reset Password
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 px-2">
                            {!selectedMethod && "Choose how you'd like to reset your password"}
                            {selectedMethod === "email" && !emailSent && "Enter your email address"}
                            {selectedMethod === "email" && emailSent && "Check your email"}
                            {selectedMethod === "phone" && !emailSent && "Enter your phone number"}
                        </p>
                    </div>

                    {/* Method Selection - Responsive padding */}
                    {!selectedMethod && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3 sm:space-y-4"
                        >
                            <button
                                onClick={() => handleMethodSelect("email")}
                                className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left flex items-center space-x-3 sm:space-x-4"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Email</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 truncate">Get a reset link via email</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleMethodSelect("phone")}
                                className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-left flex items-center space-x-3 sm:space-x-4"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaPhone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Phone</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 truncate">Receive an OTP via SMS</p>
                                </div>
                            </button>
                        </motion.div>
                    )}

                    {/* Email Input - Responsive */}
                    {selectedMethod === "email" && !emailSent && (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleEmailSubmit}
                            className="space-y-5 sm:space-y-6"
                        >
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-slate-300 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center min-h-[48px] sm:min-h-[56px]"
                            >
                                {loading ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <LoadingSpinner />
                                        <span>Sending...</span>
                                    </motion.div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </motion.form>
                    )}

                    {/* Email Success Message - Responsive */}
                    {selectedMethod === "email" && emailSent && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-5 sm:space-y-6"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                            >
                                <FaCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                            </motion.div>

                            <div className="px-2">
                                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                                    Email Sent!
                                </h3>
                                <p className="text-sm sm:text-base text-slate-600 break-words">
                                    We've sent password reset instructions to <span className="font-medium text-slate-800 block sm:inline mt-1 sm:mt-0">{sentEmail}</span>
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                                    Please check your inbox and follow the link to reset your password.
                                </p>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200 text-sm sm:text-base min-h-[44px] sm:min-h-[56px]"
                                >
                                    Back to Login
                                </button>

                                <button
                                    onClick={goBack}
                                    className="w-full border border-slate-300 text-slate-700 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 text-sm sm:text-base min-h-[44px] sm:min-h-[56px]"
                                >
                                    Try Another Method
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Phone Input - Responsive */}
                    {selectedMethod === "phone" && !emailSent && (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handlePhoneSubmit}
                            className="space-y-5 sm:space-y-6"
                        >
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-3">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <span className="text-slate-500 text-xs sm:text-sm font-medium">+91</span>
                                            <FaPhone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                                        placeholder="Enter your phone number"
                                        className="w-full pl-14 sm:pl-20 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border border-slate-300 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base"
                                        required
                                        maxLength={10}
                                    />
                                </div>

                                {/* Simple digit indicator - Responsive */}
                                {phone.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-3 sm:mt-4"
                                    >
                                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                                            <span>{phone.length} of 10 digits</span>
                                        </div>
                                        <div className="flex space-x-0.5 sm:space-x-1">
                                            {Array.from({ length: 10 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex-1 h-1 sm:h-1.5 rounded-full transition-all ${index < phone.length ? "bg-green-500" : "bg-slate-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || phone.length !== 10}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center min-h-[48px] sm:min-h-[56px]"
                            >
                                {loading ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <LoadingSpinner />
                                        <span>Sending OTP...</span>
                                    </motion.div>
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </motion.form>
                    )}

                    {/* Footer Link - Responsive */}
                    {!selectedMethod && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200"
                        >
                            <Link
                                to="/login"
                                className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors group text-sm sm:text-base"
                            >
                                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;