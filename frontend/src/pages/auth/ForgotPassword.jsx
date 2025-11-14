// pages/ForgotPassword.js
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import {
    FaEnvelope,
    FaPhone,
    FaArrowLeft,
    FaCheck,
    FaKey,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

const ForgotPassword = () => {
    const { forgotPasswordEmail, forgotPasswordPhone, resetPasswordPhone } = useAuth();
    const navigate = useNavigate();

    const [activeMethod, setActiveMethod] = useState("email");
    const [step, setStep] = useState(1); // 1: method, 2: input, 3: success/otp+password
    const [loading, setLoading] = useState(false);
    const [userIdentifier, setUserIdentifier] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleMethodSelect = (method) => {
        setActiveMethod(method);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userIdentifier.trim()) return;

        setLoading(true);
        try {
            if (activeMethod === "email") {
                await forgotPasswordEmail(userIdentifier);
                setStep(3);
            } else {
                await forgotPasswordPhone(userIdentifier);
                setStep(3); // Move directly to OTP + Password page
            }
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            alert("Please enter the complete 6-digit OTP");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        if (formData.newPassword.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            await resetPasswordPhone(
                userIdentifier,
                otpValue,
                formData.newPassword,
                formData.confirmPassword
            );

            // Show success and redirect to login
            setTimeout(() => {
                navigate("/login", {
                    state: { message: "Password reset successfully! Please login with your new password." }
                });
            }, 2000);
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setUserIdentifier("");
        setOtp(["", "", "", "", "", ""]);
        setFormData({ newPassword: "", confirmPassword: "" });
    };

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.slice(0, 10);
    };

    const handlePhoneChange = (value) => {
        const formattedNumber = formatPhoneNumber(value);
        setUserIdentifier(formattedNumber);
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength <= 2) return "bg-red-500";
        if (strength <= 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = (strength) => {
        if (strength <= 2) return "Weak";
        if (strength <= 3) return "Medium";
        return "Strong";
    };

    useEffect(() => {
        const strength = calculatePasswordStrength(formData.newPassword);
        setPasswordStrength(strength);
    }, [formData.newPassword]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
            </div>

            <div className="max-w-md w-full mx-auto relative">
                {/* Back Button */}
                {step > 1 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => step === 2 ? setStep(1) : resetFlow()}
                        className="absolute -top-16 left-0 flex items-center text-slate-600 hover:text-slate-800 transition-colors group"
                    >
                        <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </motion.button>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8"
                >
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((stepNumber) => (
                                <div key={stepNumber} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${step >= stepNumber
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-slate-200 text-slate-400"
                                            }`}
                                    >
                                        {step > stepNumber ? <FaCheck className="w-3 h-3" /> : stepNumber}
                                    </div>
                                    {stepNumber < 3 && (
                                        <div
                                            className={`w-6 h-1 transition-all duration-300 ${step > stepNumber ? "bg-blue-600" : "bg-slate-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

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

                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            {step === 1 && "Reset Password"}
                            {step === 2 && `Reset via ${activeMethod}`}
                            {step === 3 && activeMethod === "email" && "Check Your Email"}
                            {step === 3 && activeMethod === "phone" && "Set New Password"}
                        </h1>

                        <p className="text-slate-600">
                            {step === 1 && "Choose how you'd like to reset your password"}
                            {step === 2 && `Enter your ${activeMethod} to receive reset instructions`}
                            {step === 3 && activeMethod === "email" && "We've sent instructions to your email"}
                            {step === 3 && activeMethod === "phone" && "Enter OTP and set new password"}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Method Selection */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                <motion.button
                                    variants={itemVariants}
                                    onClick={() => handleMethodSelect("email")}
                                    className="w-full p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group text-left"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <FaEnvelope className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Email</h3>
                                            <p className="text-sm text-slate-600">Get a reset link via email</p>
                                        </div>
                                    </div>
                                </motion.button>

                                <motion.button
                                    variants={itemVariants}
                                    onClick={() => handleMethodSelect("phone")}
                                    className="w-full p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-green-500 hover:bg-green-50 transition-all duration-300 group text-left"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <FaPhone className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">Phone</h3>
                                            <p className="text-sm text-slate-600">Receive an OTP via SMS</p>
                                        </div>
                                    </div>
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Step 2: Input */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        {activeMethod === "email" ? "Email Address" : "Phone Number"}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {activeMethod === "email" ? (
                                                <FaEnvelope className="h-5 w-5 text-slate-400" />
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-slate-500 text-sm font-medium">+91</span>
                                                    <FaPhone className="h-4 w-4 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type={activeMethod === "email" ? "email" : "tel"}
                                            value={activeMethod === "phone" ? userIdentifier : userIdentifier}
                                            onChange={(e) =>
                                                activeMethod === "email"
                                                    ? setUserIdentifier(e.target.value)
                                                    : handlePhoneChange(e.target.value)
                                            }
                                            placeholder={
                                                activeMethod === "email"
                                                    ? "Enter your email address"
                                                    : "Enter your phone number"
                                            }
                                            className={`w-full bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${activeMethod === "email"
                                                ? "pl-10 pr-4 py-4"
                                                : "pl-16 pr-4 py-4"
                                                }`}
                                            required
                                            maxLength={activeMethod === "phone" ? 10 : undefined}
                                        />
                                    </div>

                                    {/* Phone Number Digit Indicator */}
                                    {activeMethod === "phone" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-slate-600">Phone number digits</span>
                                                <span className="text-xs font-medium text-slate-700">
                                                    {userIdentifier.length}/10
                                                </span>
                                            </div>
                                            <div className="flex space-x-1">
                                                {Array.from({ length: 10 }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${index < userIdentifier.length
                                                            ? "bg-green-500"
                                                            : "bg-slate-300"
                                                            } ${index === userIdentifier.length
                                                                ? "ring-2 ring-green-400 ring-opacity-50"
                                                                : ""
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || !userIdentifier.trim() || (activeMethod === "phone" && userIdentifier.length !== 10)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        `Send ${activeMethod === "email" ? "Reset Link" : "OTP"}`
                                    )}
                                </motion.button>
                            </motion.form>
                        )}

                        {/* Step 3: Success/OTP+Password */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {activeMethod === "email" ? (
                                    // Email Success
                                    <div className="text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                        >
                                            <FaCheck className="w-8 h-8 text-green-600" />
                                        </motion.div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                                Check Your Email
                                            </h3>
                                            <p className="text-slate-600">
                                                We've sent password reset instructions to {userIdentifier}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => navigate("/login")}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-200"
                                            >
                                                Back to Login
                                            </button>

                                            <button
                                                onClick={resetFlow}
                                                className="w-full border border-slate-300 text-slate-700 py-4 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200"
                                            >
                                                Try Another Method
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Phone OTP + Password Form
                                    <motion.form
                                        onSubmit={handlePasswordReset}
                                        className="space-y-6"
                                    >
                                        {/* OTP Section */}
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200 }}
                                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <FaKey className="w-6 h-6 text-blue-600" />
                                            </motion.div>

                                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                                Enter OTP Code
                                            </h3>
                                            <p className="text-slate-600 mb-4">
                                                Enter the 6-digit code sent to +91 {userIdentifier}
                                            </p>

                                            {/* OTP Input Boxes */}
                                            <div className="flex justify-center space-x-3 mb-6">
                                                {otp.map((digit, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="relative"
                                                    >
                                                        <input
                                                            id={`otp-${index}`}
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            maxLength="1"
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                            className="w-12 h-12 text-center text-xl font-bold bg-white border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Password Section */}
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-slate-800 text-center">
                                                Set New Password
                                            </h4>

                                            {/* New Password Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.newPassword}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        placeholder="Enter your new password"
                                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-12 pr-12"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                    >
                                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                                    </button>
                                                </div>

                                                {/* Password Strength Meter */}
                                                {formData.newPassword && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="mt-2 space-y-1"
                                                    >
                                                        <div className="flex justify-between text-xs text-slate-600">
                                                            <span>Password Strength</span>
                                                            <span className={`font-semibold ${passwordStrength <= 2 ? "text-red-600" :
                                                                passwordStrength <= 3 ? "text-yellow-600" : "text-green-600"
                                                                }`}>
                                                                {getPasswordStrengthText(passwordStrength)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 rounded-full h-1">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                                className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Confirm Password Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        placeholder="Confirm your new password"
                                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 pl-12 pr-12"
                                                        required
                                                    />
                                                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Password Match Indicator */}
                                            {formData.newPassword && formData.confirmPassword && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`p-3 rounded-lg text-sm font-medium ${formData.newPassword === formData.confirmPassword
                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                        : "bg-red-100 text-red-700 border border-red-200"
                                                        }`}
                                                >
                                                    {formData.newPassword === formData.confirmPassword
                                                        ? "✓ Passwords match"
                                                        : "✗ Passwords don't match"
                                                    }
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading || otp.join("").length !== 6 || formData.newPassword !== formData.confirmPassword || !formData.newPassword}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                                    />
                                                    Resetting Password...
                                                </>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </motion.button>

                                        <button
                                            type="button"
                                            onClick={resetFlow}
                                            className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200"
                                        >
                                            Try Another Method
                                        </button>
                                    </motion.form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Links */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center pt-6 mt-6 border-t border-slate-200"
                        >
                            <Link
                                to="/login"
                                className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors group"
                            >
                                <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
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