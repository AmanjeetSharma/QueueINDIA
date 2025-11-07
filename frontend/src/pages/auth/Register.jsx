import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { browserName, osName, deviceType } from "react-device-detect";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaEnvelope, FaLock, FaCamera, FaTrash } from "react-icons/fa";

const Register = () => {
    const { register } = useAuth();
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
        <div className="min-h-screen bg-linear-to-br from-indigo-50 to-white flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                {/* Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">Q</span>
                            </div>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join QueueINDIA</h1>
                        <p className="text-gray-600">Create your account to get started</p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Avatar Upload */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100"
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
                                        className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <FaCamera className="w-4 h-4" />
                                    </motion.button>
                                    {avatarPreview && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -bottom-2 -left-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <FaTrash className="w-4 h-4" />
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
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 pl-11"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaUser className="w-5 h-5 text-gray-400" />
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 pl-11"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaEnvelope className="w-5 h-5 text-gray-400" />
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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={form.password}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 pl-11 pr-12"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaLock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                        </button>
                                    </div>
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
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={onChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 pl-11 pr-12"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <FaLock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                        </button>
                                    </div>
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
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                                "Create account"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <p className="text-gray-500 text-sm">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">Terms</Link> and{" "}
                        <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        © 2024 QueueINDIA. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;