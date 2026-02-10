import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaKey, FaLock, FaUnlock, FaCheck, FaGoogle, FaShieldAlt, FaInfoCircle, FaEye, FaEyeSlash } from "react-icons/fa";

const GooglePasswordTab = ({
    googlePasswordData,
    setGooglePasswordData,
    onSetGooglePassword,
    isSettingGooglePassword
}) => {
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState({
        newGooglePassword: false,
        confirmGooglePassword: false
    });
    const [formTouched, setFormTouched] = useState({
        newGooglePassword: false,
        confirmGooglePassword: false
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const password = googlePasswordData.newGooglePassword;
        const confirmPassword = googlePasswordData.confirmGooglePassword;

        if (!password) {
            newErrors.newGooglePassword = "Password is required";
        } else if (password.length < 8) {
            newErrors.newGooglePassword = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(password)) {
            newErrors.newGooglePassword = "Must include lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.newGooglePassword = "Must include uppercase letter";
        } else if (!/(?=.*\d)/.test(password)) {
            newErrors.newGooglePassword = "Must include number";
        }

        if (!confirmPassword) {
            newErrors.confirmGooglePassword = "Please confirm password";
        } else if (password && password !== confirmPassword) {
            newErrors.confirmGooglePassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormTouched({
            newGooglePassword: true,
            confirmGooglePassword: true
        });

        if (!validateForm()) {
            return;
        }

        try {
            await onSetGooglePassword();
            setSubmitSuccess(true);
            setRedirecting(true);
            setTimeout(() => {
                window.location.href = "/profile";
            }, 3000);

        } catch (error) {
            setRedirecting(false);
        }
    };

    const handleFieldChange = (field, value) => {
        setGooglePasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFieldBlur = (field) => {
        setFormTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const passwordStrength = () => {
        const pwd = googlePasswordData.newGooglePassword;
        if (!pwd) return 0;
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/(?=.*[a-z])/.test(pwd)) strength++;
        if (/(?=.*[A-Z])/.test(pwd)) strength++;
        if (/(?=.*\d)/.test(pwd)) strength++;
        if (/(?=.*[!@#$%^&*])/.test(pwd)) strength++;
        return Math.min(strength, 5);
    };

    const getStrengthColor = () => {
        const strength = passwordStrength();
        if (strength === 0) return "bg-gray-300";
        if (strength === 1) return "bg-red-500";
        if (strength === 2) return "bg-orange-500";
        if (strength === 3) return "bg-yellow-500";
        if (strength === 4) return "bg-blue-500";
        return "bg-green-500";
    };

    const getStrengthLabel = () => {
        const strength = passwordStrength();
        if (strength === 0) return "—";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        if (strength === 4) return "Strong";
        return "Very Strong";
    };

    const isFormValid = () => {
        const password = googlePasswordData.newGooglePassword;
        const confirmPassword = googlePasswordData.confirmGooglePassword;

        if (!password || !confirmPassword) return false;
        if (password.length < 8) return false;
        if (password !== confirmPassword) return false;

        return true;
    };

    const getPasswordRequirements = () => {
        const password = googlePasswordData.newGooglePassword || '';
        return {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password)
        };
    };

    const requirements = getPasswordRequirements();
    const requiredsMet = Object.values(requirements).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-3 sm:px-6 py-6 sm:py-10">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8 text-center"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1 sm:mb-2">
                        Set Account Password
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Secure your Google account with a password
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
                >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-500/8 to-indigo-500/8 border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                <FaKey className="text-white text-sm sm:text-base" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold text-sm sm:text-base text-slate-900">Password Setup</h2>
                                <p className="text-xs text-slate-600 truncate">Create a strong password</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                                <FaLock className="text-blue-500 text-xs sm:text-sm" />
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={passwordVisible.newGooglePassword ? "text" : "password"}
                                    value={googlePasswordData.newGooglePassword}
                                    onChange={(e) => handleFieldChange("newGooglePassword", e.target.value)}
                                    onBlur={() => handleFieldBlur("newGooglePassword")}
                                    className={`w-full px-3 sm:px-4 py-2.5 border-2 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${errors.newGooglePassword && formTouched.newGooglePassword
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300 focus:border-blue-500"
                                        }`}
                                    placeholder="Create strong password..."
                                    disabled={isSettingGooglePassword || submitSuccess}
                                />

                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(prev => ({
                                        ...prev,
                                        newGooglePassword: !prev.newGooglePassword
                                    }))}
                                    disabled={isSettingGooglePassword || submitSuccess}
                                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5 disabled:opacity-50"
                                >
                                    {passwordVisible.newGooglePassword ? (
                                        <FaEyeSlash className="text-base" />
                                    ) : (
                                        <FaEye className="text-base" />
                                    )}
                                </button>
                            </div>

                            {/* Strength Indicator - Compact */}
                            <div className="flex items-center justify-between gap-2 mt-2">
                                <span className="text-xs font-medium text-slate-600">Strength:</span>
                                <div className="flex gap-0.5 flex-1 max-w-xs">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength() ? getStrengthColor() : "bg-slate-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className={`text-xs font-semibold min-w-max ${passwordStrength() === 0 ? "text-slate-500" :
                                    passwordStrength() === 1 ? "text-red-500" :
                                        passwordStrength() === 2 ? "text-orange-500" :
                                            passwordStrength() === 3 ? "text-yellow-500" :
                                                passwordStrength() === 4 ? "text-blue-500" :
                                                    "text-green-500"
                                    }`}>
                                    {getStrengthLabel()}
                                </span>
                            </div>

                            {/* Requirements - Compact Grid */}
                            <div className="grid grid-cols-2 gap-1.5 mt-2 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                {[
                                    { label: '8+ chars', key: 'length' },
                                    { label: 'Lowercase', key: 'lowercase' },
                                    { label: 'Uppercase', key: 'uppercase' },
                                    { label: 'Number', key: 'number' }
                                ].map(({ label, key }) => (
                                    <div key={key} className="flex items-center gap-1">
                                        <span className={`text-xs font-semibold ${requirements[key] ? "text-green-600" : "text-slate-400"}`}>
                                            {requirements[key] ? "✓" : "○"}
                                        </span>
                                        <span className={`text-xs ${requirements[key] ? "text-slate-700" : "text-slate-500"}`}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {errors.newGooglePassword && formTouched.newGooglePassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50/70 p-2.5 rounded-lg border border-red-100">
                                            <span className="text-sm flex-shrink-0">⚠</span>
                                            <p className="font-medium">{errors.newGooglePassword}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                                <FaCheck className="text-green-600 text-xs sm:text-sm" />
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input
                                    type={passwordVisible.confirmGooglePassword ? "text" : "password"}
                                    value={googlePasswordData.confirmGooglePassword}
                                    onChange={(e) => handleFieldChange("confirmGooglePassword", e.target.value)}
                                    onBlur={() => handleFieldBlur("confirmGooglePassword")}
                                    className={`w-full px-3 sm:px-4 py-2.5 border-2 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 ${errors.confirmGooglePassword && formTouched.confirmGooglePassword
                                        ? "border-red-400 bg-red-50/50"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300 focus:border-green-500"
                                        }`}
                                    placeholder="Re-enter password..."
                                    disabled={isSettingGooglePassword || submitSuccess}
                                />

                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(prev => ({
                                        ...prev,
                                        confirmGooglePassword: !prev.confirmGooglePassword
                                    }))}
                                    disabled={isSettingGooglePassword || submitSuccess}
                                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5 disabled:opacity-50"
                                >
                                    {passwordVisible.confirmGooglePassword ? (
                                        <FaEyeSlash className="text-base" />
                                    ) : (
                                        <FaEye className="text-base" />
                                    )}
                                </button>
                            </div>

                            {/* Match Indicator */}
                            <AnimatePresence>
                                {googlePasswordData.confirmGooglePassword && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs"
                                    >
                                        {googlePasswordData.newGooglePassword === googlePasswordData.confirmGooglePassword ? (
                                            <div className="flex items-center gap-1.5 text-green-700 bg-green-50/70 p-2.5 rounded-lg border border-green-100">
                                                <FaCheck className="text-sm flex-shrink-0" />
                                                <p className="font-medium">Passwords match</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50/70 p-2.5 rounded-lg border border-orange-100">
                                                <FaKey className="text-sm flex-shrink-0" />
                                                <p className="font-medium">Passwords don't match</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            <AnimatePresence>
                                {errors.confirmGooglePassword && formTouched.confirmGooglePassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50/70 p-2.5 rounded-lg border border-red-100">
                                            <span className="text-sm flex-shrink-0">⚠</span>
                                            <p className="font-medium">{errors.confirmGooglePassword}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Security Info - Compact */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex gap-2 text-xs">
                            <FaShieldAlt className="text-blue-600 flex-shrink-0 mt-0.5 text-sm" />
                            <div>
                                <p className="font-semibold text-slate-900">Secure Login</p>
                                <p className="text-slate-700">Login with Google or email/password</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSettingGooglePassword || !isFormValid() || submitSuccess}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${isSettingGooglePassword || submitSuccess
                                ? "bg-blue-400 cursor-wait opacity-80"
                                : !isFormValid()
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {isSettingGooglePassword ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Setting...</span>
                                    </motion.div>
                                ) : submitSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <FaCheck className="text-base" />
                                        <span>Done!</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="submit"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <FaShieldAlt className="text-base" />
                                        <span>Set Password</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-slate-100 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50/30">
                        <p className="text-xs text-slate-600 text-center">
                            🔒 <span className="font-semibold">End-to-end encrypted</span>
                        </p>
                    </div>
                </motion.div>

                {/* Support Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-600"
                >
                    Need help? <a href="/support" className="text-blue-600 hover:text-blue-700 font-semibold">Contact support</a>
                </motion.p>
            </div>
        </div>
    );
};

export default GooglePasswordTab;