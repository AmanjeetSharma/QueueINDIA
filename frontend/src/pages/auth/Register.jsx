import { useState, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { browserName, osName, deviceType } from "react-device-detect";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaEnvelope, FaLock, FaCamera, FaTrash, FaUserPlus } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';

// Animation variants - defined outside component
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

const scaleIn = {
    initial: { scale: 0 },
    animate: { scale: 1 }
};

const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
};

// Memoized device info
const deviceInfo = `${browserName} on ${osName} (${deviceType})`;

// Password strength utility - pure function
const checkPasswordCriteriaUtil = (password) => ({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
});

const getPasswordStrengthUtil = (criteria) => {
    const fulfilledCount = Object.values(criteria).filter(Boolean).length;
    if (fulfilledCount === 5) return "strong";
    if (fulfilledCount >= 3) return "medium";
    if (fulfilledCount >= 1) return "weak";
    return "";
};

const Register = () => {
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        device: deviceInfo
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false
    });

    // Memoized password strength
    const passwordStrength = useMemo(() => 
        getPasswordStrengthUtil(passwordCriteria)
    , [passwordCriteria]);

    // Memoized password match status
    const doPasswordsMatch = useMemo(() => 
        form.password && form.confirmPassword && form.password === form.confirmPassword
    , [form.password, form.confirmPassword]);

    // Memoized form validation
    const isFormValid = useMemo(() => {
        const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
        return form.name && 
               form.email && 
               form.password && 
               form.confirmPassword && 
               form.password === form.confirmPassword &&
               allCriteriaMet &&
               !isLoading;
    }, [form, passwordCriteria, isLoading]);

    // UseCallback for event handlers
    const onChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === "password") {
            const criteria = checkPasswordCriteriaUtil(value);
            setPasswordCriteria(criteria);
        }
    }, []);

    const handleAvatarChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) return;

        // Check file type
        if (!file.type.startsWith('image/')) return;

        setAvatar(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }, []);

    const removeAvatar = useCallback(() => {
        setAvatar(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isFormValid || isLoading) return;

        setIsLoading(true);

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
    }, [form, avatar, register, navigate, isFormValid, isLoading]);

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

    // Memoized password input types
    const passwordInputType = useMemo(() => 
        showPassword ? "text" : "password"
    , [showPassword]);

    const confirmPasswordInputType = useMemo(() => 
        showConfirmPassword ? "text" : "password"
    , [showConfirmPassword]);

    // Memoized strength meter width
    const strengthMeterWidth = useMemo(() => {
        if (passwordStrength === "strong") return "100%";
        if (passwordStrength === "medium") return "66%";
        if (passwordStrength === "weak") return "33%";
        return "0%";
    }, [passwordStrength]);

    // Memoized strength meter color
    const strengthMeterColor = useMemo(() => {
        switch (passwordStrength) {
            case "strong": return "bg-green-500";
            case "medium": return "bg-yellow-500";
            case "weak": return "bg-red-500";
            default: return "bg-gray-200";
        }
    }, [passwordStrength]);

    const strengthText = useMemo(() => {
        switch (passwordStrength) {
            case "strong": return "Strong password";
            case "medium": return "Medium strength";
            case "weak": return "Weak password";
            default: return "Enter a password";
        }
    }, [passwordStrength]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform">
                <div className="absolute inset-0 opacity-[0.02]" 
                     style={{ 
                         backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                         backgroundSize: '50px 50px'
                     }} 
                />
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
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md will-change-transform">
                                <FaUserPlus className="text-white text-xl" />
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-gray-800 mb-2"
                        >
                            Join QueueINDIA
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.25 }}
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
                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 will-change-transform">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FaUser className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-pointer will-change-transform"
                                        disabled={isLoading}
                                    >
                                        <FaCamera className="w-3 h-3" />
                                    </motion.button>
                                    {avatarPreview && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -bottom-2 -left-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors will-change-transform"
                                            disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12"
                                        required
                                        autoComplete="name"
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
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
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={passwordInputType}
                                        placeholder="Create a strong password"
                                        value={form.password}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12 pr-12"
                                        required
                                        autoComplete="new-password"
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
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </motion.button>
                                </div>

                                {/* Password Strength Meter */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Password strength:</span>
                                            <span className={`font-medium ${
                                                passwordStrength === "strong" ? "text-green-600" :
                                                passwordStrength === "medium" ? "text-yellow-600" :
                                                "text-red-600"
                                            }`}>
                                                {strengthText}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${strengthMeterColor}`}
                                                style={{ width: strengthMeterWidth }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                <div className="mt-3 space-y-2">
                                    <RequirementItem
                                        met={passwordCriteria.length}
                                        text="At least 8 characters"
                                    />
                                    <RequirementItem
                                        met={passwordCriteria.lowercase}
                                        text="One lowercase letter"
                                    />
                                    <RequirementItem
                                        met={passwordCriteria.uppercase}
                                        text="One uppercase letter"
                                    />
                                    <RequirementItem
                                        met={passwordCriteria.number}
                                        text="One number"
                                    />
                                    <RequirementItem
                                        met={passwordCriteria.special}
                                        text="One special character (@$!%*?&)"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={confirmPasswordInputType}
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400 pl-12 pr-12"
                                        required
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <FaLock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        whileHover={!isLoading ? { scale: 1.05 } : {}}
                                        whileTap={!isLoading ? { scale: 0.95 } : {}}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </motion.button>
                                </div>
                                {form.confirmPassword && (
                                    <PasswordMatchIndicator
                                        match={doPasswordsMatch}
                                        hasPassword={!!form.password}
                                    />
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
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.3 }}
                            whileHover={isFormValid ? { scale: 1.01, backgroundColor: "#2563eb" } : {}}
                            whileTap={isFormValid ? { scale: 0.99 } : {}}
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm will-change-transform"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                    Creating account...
                                </>
                            ) : (
                                "Register"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
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
                        transition={{ delay: 0.45 }}
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
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.5 }}
                        className="mt-6 pt-6 border-t border-gray-100"
                    >
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                    tabIndex={isLoading ? -1 : 0}
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.55 }}
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

// Extracted sub-components for better performance and reusability
const RequirementItem = ({ met, text }) => (
    <div className={`flex items-center text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
        {met ? (
            <FaCheck className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
        ) : (
            <FaTimes className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
        )}
        <span>{text}</span>
    </div>
);

const PasswordMatchIndicator = ({ match, hasPassword }) => (
    <p className={`text-xs mt-1 ${match ? 'text-green-600' : 'text-red-600'}`}>
        {match ? '✓ Passwords match' : hasPassword ? '✗ Passwords do not match' : ''}
    </p>
);

export default Register;