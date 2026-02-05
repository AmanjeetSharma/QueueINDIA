import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { browserName, osName, deviceType } from "react-device-detect";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaEnvelope, FaLock, FaCamera, FaTrash, FaGoogle, FaUserPlus } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        device: `${browserName} on ${osName} (${deviceType})`
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Check password strength and criteria
        if (name === "password") {
            checkPasswordStrength(value);
            checkPasswordCriteria(value);
        }
    };

    const checkPasswordCriteria = (password) => {
        const criteria = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };
        setPasswordCriteria(criteria);
    };

    const checkPasswordStrength = (password) => {
        const criteria = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        const fulfilledCount = Object.values(criteria).filter(Boolean).length;

        if (fulfilledCount === 5) {
            setPasswordStrength("strong");
        } else if (fulfilledCount >= 3) {
            setPasswordStrength("medium");
        } else if (fulfilledCount >= 1) {
            setPasswordStrength("weak");
        } else {
            setPasswordStrength("");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                return;
            }

            setAvatar(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate passwords match
        if (form.password !== form.confirmPassword) {
            setIsLoading(false);
            return;
        }

        // Validate password strength
        if (passwordStrength === "weak" && form.password.length > 0) {
            setIsLoading(false);
            return;
        }

        // Check if all criteria are met for strong password
        const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        if (!allCriteriaMet && form.password.length > 0) {
            setIsLoading(false);
            return;
        }

        try {
            const fd = new FormData();
            fd.append("name", form.name.trim());
            fd.append("email", form.email.trim());
            fd.append("password", form.password);
            fd.append("device", form.device);
            if (avatar) fd.append("avatar", avatar);

            await register(fd);
            navigate("/login");
        } catch (err) {
            // Error handling is now done in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const deviceInfo = `${browserName} on ${osName} (${deviceType})`;
            await googleLogin({
                tokenId: credentialResponse.credential,
                device: deviceInfo
            });
            navigate("/");
        } catch (error) {
            // Error handled in AuthContext
        }
    };

    const handleGoogleError = () => {
        console.log('Google Login Failed');
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case "strong": return "bg-green-500";
            case "medium": return "bg-yellow-500";
            case "weak": return "bg-red-500";
            default: return "bg-gray-200";
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case "strong": return "Strong password";
            case "medium": return "Medium strength";
            case "weak": return "Weak password";
            default: return "Enter a password";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Very subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                {/* Soft gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>

            {/* Main Card */}
            <div className="max-w-md w-full mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                <FaUserPlus className="text-white text-xl" />
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-gray-800 mb-2"
                        >
                            Join QueueINDIA
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-600"
                        >
                            Create your account to access public services
                        </motion.p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* Avatar Upload */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <motion.div
                                        // whileHover={{ scale: 1.05 }}
                                        className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100"
                                    >
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaUser className="w-8 h-8" />
                                            </div>
                                        )}
                                    </motion.div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
                                    >
                                        <FaCamera className="w-3 h-3" />
                                    </motion.button>
                                    {avatarPreview && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -bottom-2 -left-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </motion.button>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                        <FaUser className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                        <FaEnvelope className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={form.password}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12 pr-12"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                        <FaLock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </motion.button>
                                </div>

                                {/* Password Strength Meter */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Password strength:</span>
                                            <span className={`font-medium ${passwordStrength === "strong" ? "text-green-600" :
                                                passwordStrength === "medium" ? "text-yellow-600" :
                                                    "text-red-600"
                                                }`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: passwordStrength === "strong" ? "100%" :
                                                        passwordStrength === "medium" ? "66%" :
                                                            passwordStrength === "weak" ? "33%" : "0%"
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                <div className="mt-3 space-y-2">
                                    <div className="space-y-1">
                                        <div className={`flex items-center text-xs ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordCriteria.length ? <FaCheck className="w-3 h-3 mr-2 text-green-500" /> : <FaTimes className="w-3 h-3 mr-2 text-gray-400" />}
                                            At least 8 characters
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordCriteria.lowercase ? <FaCheck className="w-3 h-3 mr-2 text-green-500" /> : <FaTimes className="w-3 h-3 mr-2 text-gray-400" />}
                                            One lowercase letter
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordCriteria.uppercase ? <FaCheck className="w-3 h-3 mr-2 text-green-500" /> : <FaTimes className="w-3 h-3 mr-2 text-gray-400" />}
                                            One uppercase letter
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordCriteria.number ? <FaCheck className="w-3 h-3 mr-2 text-green-500" /> : <FaTimes className="w-3 h-3 mr-2 text-gray-400" />}
                                            One number
                                        </div>
                                        <div className={`flex items-center text-xs ${passwordCriteria.special ? 'text-green-600' : 'text-gray-500'}`}>
                                            {passwordCriteria.special ? <FaCheck className="w-3 h-3 mr-2 text-green-500" /> : <FaTimes className="w-3 h-3 mr-2 text-gray-400" />}
                                            One special character (@$!%*?&)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12 pr-12"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                                        <FaLock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </motion.button>
                                </div>
                                {form.confirmPassword && form.password !== form.confirmPassword && (
                                    <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                                )}
                                {form.confirmPassword && form.password === form.confirmPassword && (
                                    <p className="text-green-600 text-xs mt-1">Passwords match</p>
                                )}
                            </div>

                            {/* Hidden Device Field */}
                            <input
                                name="device"
                                type="hidden"
                                value={form.device}
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{
                                scale: 1.01,
                                backgroundColor: "#2563eb"
                            }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                    />
                                    Creating account...
                                </>
                            ) : (
                                "Register"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 }}
                        className="flex justify-center"
                    >
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            shape="rectangular"
                            size="large"
                            theme="outline"
                            text="signup_with"
                            width="100%"
                        />
                    </motion.div>

                    {/* Sign In Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="mt-6 pt-6 border-t border-gray-100"
                    >
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
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

export default Register;