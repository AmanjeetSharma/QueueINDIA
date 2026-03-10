import { useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { browserName, osName, deviceType } from "react-device-detect";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus, FaShieldAlt } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Animation variants - defined outside component to prevent recreation
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

const scaleIn = {
    initial: { scale: 0 },
    animate: { scale: 1 }
};

const slideInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
};

const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
};

// Memoized device info - computed once
const deviceInfo = `${browserName} on ${osName} (${deviceType})`;

const Login = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        device: deviceInfo
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Use useCallback for event handlers
    const onChange = useCallback((e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (isLoading) return; // Prevent double submission
        
        setIsLoading(true);

        try {
            await login(form);
            navigate("/");
        } catch (err) {
            // Error handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    }, [form, login, navigate, isLoading]);

    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        try {
            await googleLogin({
                tokenId: credentialResponse.credential,
                device: deviceInfo
            });
            navigate("/");
        } catch (error) {
            // Error handled in AuthContext
        }
    }, [googleLogin, navigate]);

    const handleGoogleError = useCallback(() => {
        console.log('Google Login Failed');
    }, []);

    // Memoize password input type
    const passwordInputType = useMemo(() => 
        showPassword ? "text" : "password"
    , [showPassword]);

    // Check if form is valid for submission
    const isFormValid = useMemo(() => 
        form.email && form.password && !isLoading
    , [form.email, form.password, isLoading]);

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Subtle Background Elements - reduced opacity for better performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
                {/* Very subtle grid pattern - using CSS grid instead of background pattern for better performance */}
                <div className="absolute inset-0 opacity-[0.02]" 
                     style={{ 
                         backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                         backgroundSize: '50px 50px'
                     }} 
                />

                {/* Soft gradient orbs - using transform for better performance */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 will-change-transform"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 will-change-transform"></div>
            </div>

            {/* Main Card */}
            <div className="max-w-md w-full mx-auto relative">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 will-change-transform"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            variants={scaleIn}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md will-change-transform">
                                <FaShieldAlt className="text-white text-xl" />
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-gray-800 mb-2"
                        >
                            Welcome to QueueINDIA
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.25 }}
                            className="text-gray-600"
                        >
                            Login to access public services
                        </motion.p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* Email Field */}
                            <motion.div
                                variants={slideInLeft}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: 0.3 }}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12"
                                        required
                                        autoComplete="email"
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <FaEnvelope className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Password Field */}
                            <motion.div
                                variants={slideInLeft}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: 0.35 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-500 transition-colors font-medium"
                                        tabIndex={isLoading ? -1 : 0}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={passwordInputType}
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12 pr-12"
                                        required
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <FaLock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        whileHover={!isLoading ? { scale: 1.05 } : {}}
                                        whileTap={!isLoading ? { scale: 0.95 } : {}}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLoading}
                                        tabIndex={isLoading ? -1 : 0}
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Hidden Device Field */}
                            <input
                                name="device"
                                type="hidden"
                                value={form.device}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.45 }}
                            whileHover={isFormValid ? { scale: 1.01, backgroundColor: "#2563eb" } : {}}
                            whileTap={isFormValid ? { scale: 0.99 } : {}}
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm will-change-transform"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.5 }}
                        className="relative my-6"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </motion.div>

                    {/* Google Login Button */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.55 }}
                        className="flex justify-center"
                    >
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            shape="rectangular"
                            size="large"
                            theme="outline"
                            text="continue_with"
                            width="100%"
                        />
                    </motion.div>

                    {/* Sign Up Link */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.6 }}
                        className="mt-6 pt-6 border-t border-gray-100"
                    >
                        <div className="text-center space-y-3 p-6 bg-linear-to-br from-gray-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="space-y-1">
                                <p className="text-gray-600 font-medium text-base">
                                    Join QueueIndia Today
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Start managing your queues efficiently
                                </p>
                            </div>

                            <Link
                                to="/register"
                                className="group inline-flex items-center justify-center gap-3 px-6 py-3 w-full max-w-xs bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-2 border-blue-200 hover:border-blue-600 rounded-xl font-medium transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 active:scale-95 will-change-transform"
                                tabIndex={isLoading ? -1 : 0}
                            >
                                <FaUserPlus className="w-5 h-5 transition-transform group-hover:scale-110 will-change-transform" />
                                <span>Create New Account</span>
                            </Link>

                            <div className="pt-2">
                                <p className="text-gray-400 text-xs">
                                    <span className="inline-flex items-center gap-1">
                                        <FaLock className="w-3 h-3" />
                                        Google users can set a password later for email login
                                    </span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.65 }}
                    className="text-center mt-6"
                >
                    <p className="text-gray-500 text-sm">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-500">Terms</Link> and{" "}
                        <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        © 2024 QueueINDIA. Secure public service portal.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;