import { motion, AnimatePresence } from "framer-motion";
import { FaKey, FaLock, FaCalendarAlt, FaShieldAlt, FaDesktop, FaMobile, FaLaptop, FaGlobe, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaEyeSlash, FaCog, FaUserShield, FaArrowLeft, FaGoogle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SecurityTab = ({
    isChangingPassword,
    setIsChangingPassword,
    passwordData,
    setPasswordData,
    onPasswordChange
}) => {
    const navigate = useNavigate();
    const { user, sessions: fetchSessionsFromAPI } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [showSessions, setShowSessions] = useState(false);

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fetchSessions = async () => {
        setLoadingSessions(true);
        try {
            const response = await fetchSessionsFromAPI();
            setSessions(response.data || []);
        } catch (error) { }
        finally {
            setLoadingSessions(false);
        }
    };

    useEffect(() => {
        if (showSessions) {
            fetchSessions();
        }
    }, [showSessions]);

    const getDeviceIcon = (device) => {
        if (device?.toLowerCase().includes('mobile')) return FaMobile;
        if (device?.toLowerCase().includes('tablet')) return FaMobile;
        if (device?.toLowerCase().includes('desktop')) return FaDesktop;
        if (device?.toLowerCase().includes('laptop')) return FaLaptop;
        if (device?.toLowerCase().includes('postman')) return FaGlobe;
        return FaDesktop;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            key="security"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
        >
            {!isChangingPassword ? (
                <>
                    {/* Header - Medium sized */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-5"
                    >
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-md mb-3">
                            <FaUserShield className="w-4 h-4" />
                            <h3 className="text-sm font-semibold">Security</h3>
                        </div>
                        <p className="text-xs text-gray-600 max-w-2xl mx-auto px-2">
                            Manage your security & monitor active sessions
                        </p>
                    </motion.div>

                    {/* Cards Container */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        {/* Set Password for Google Users */}
                        {!user?.hasPassword && (
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <motion.div
                                            whileHover={{ rotate: 5, scale: 1.05 }}
                                            className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                                        >
                                            <FaGoogle className="w-4 h-4 text-white" />
                                        </motion.div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 text-sm">Set Password</h4>
                                            <p className="text-xs text-gray-600 line-clamp-1">
                                                Enable email/password login for your Google account
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate("/set-google-password")}
                                        className="flex items-center gap-1.5 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 shadow-sm text-xs font-medium whitespace-nowrap cursor-pointer"
                                    >
                                        <FaKey className="w-3 h-3" />
                                        <span>Set Now</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Change Password Card */}
                        {user?.hasPassword && (
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <motion.div
                                            whileHover={{ rotate: 5, scale: 1.05 }}
                                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                                        >
                                            <FaLock className="w-4 h-4 text-white" />
                                        </motion.div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 text-sm">Password Security</h4>
                                            <p className="text-xs text-gray-600 line-clamp-1">
                                                Update your password regularly for better security
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsChangingPassword(true)}
                                        className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 shadow-sm text-xs font-medium whitespace-nowrap"
                                    >
                                        <FaKey className="w-3 h-3" />
                                        <span>Change</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Sessions Card */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <motion.div
                                        whileHover={{ rotate: -5, scale: 1.05 }}
                                        className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                                    >
                                        <FaShieldAlt className="w-4 h-4 text-white" />
                                    </motion.div>
                                    <div className="space-y-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-sm">Active Sessions</h4>
                                        <p className="text-xs text-gray-600">
                                            {sessions.filter(s => s.isActive).length} active session(s)
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowSessions(!showSessions)}
                                    className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 shadow-sm text-xs font-medium whitespace-nowrap cursor-pointer"
                                >
                                    <FaCalendarAlt className="w-3 h-3" />
                                    <span>{showSessions ? 'Hide' : 'View'}</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Sessions List */}
                        <AnimatePresence>
                            {showSessions && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm overflow-hidden"
                                >
                                    {/* Sessions Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                                <FaShieldAlt className="w-3 h-3 text-white" />
                                            </div>
                                            <span>All Sessions ({sessions.length})</span>
                                        </h4>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={fetchSessions}
                                            disabled={loadingSessions}
                                            className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 text-xs font-medium disabled:opacity-50 cursor-pointer"
                                        >
                                            <FaCog className={`w-3 h-3 ${loadingSessions ? 'animate-spin' : ''}`} />
                                            <span>Refresh</span>
                                        </motion.button>
                                    </div>

                                    {/* Sessions Content */}
                                    {loadingSessions ? (
                                        <div className="flex justify-center py-6">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                                                <p className="text-gray-600 text-xs mt-2">Loading sessions...</p>
                                            </div>
                                        </div>
                                    ) : sessions.length === 0 ? (
                                        <div className="text-center py-6">
                                            <FaCalendarAlt className="w-10 h-10 mx-auto text-gray-300" />
                                            <p className="text-gray-500 text-sm font-medium mt-2">No active sessions</p>
                                            <p className="text-gray-400 text-xs mt-1">Sessions will appear here when you login</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="space-y-3"
                                        >
                                            {sessions.map((session) => {
                                                const DeviceIcon = getDeviceIcon(session.device);
                                                return (
                                                    <motion.div
                                                        key={session.sessionId}
                                                        variants={itemVariants}
                                                        className={`p-3 rounded-lg border ${
                                                            session.isActive
                                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                                                                : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                                                        }`}
                                                    >
                                                        {/* Device Info Row */}
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                                session.isActive ? 'bg-green-100' : 'bg-gray-100'
                                                            }`}>
                                                                <DeviceIcon className={`w-4 h-4 ${
                                                                    session.isActive ? 'text-green-600' : 'text-gray-500'
                                                                }`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                                    {session.device}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                        session.isActive
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {session.isActive ? (
                                                                            <>
                                                                                <motion.div
                                                                                    animate={{ scale: [1, 1.2, 1] }}
                                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                                    className="w-1.5 h-1.5 bg-green-500 rounded-full"
                                                                                />
                                                                                <span>Active</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaTimesCircle className="w-2.5 h-2.5" />
                                                                                <span>Inactive</span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {getTimeAgo(session.latestLogin)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Session Times */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex items-center gap-2 text-gray-600 bg-white/60 rounded-lg p-2">
                                                                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                    <FaClock className="w-3 h-3 text-blue-600" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-gray-500">First seen</p>
                                                                    <p className="text-xs font-medium text-gray-900 truncate">
                                                                        {formatDate(session.firstLogin)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600 bg-white/60 rounded-lg p-2">
                                                                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                    <FaCalendarAlt className="w-3 h-3 text-purple-600" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs text-gray-500">Last active</p>
                                                                    <p className="text-xs font-medium text-gray-900">
                                                                        {getTimeAgo(session.latestLogin)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </motion.div>
                                    )}

                                    {/* Security Tip */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaShieldAlt className="w-3 h-3 text-blue-600" />
                                            </div>
                                            <p className="text-xs text-blue-700">
                                                <span className="font-semibold">Security Tip:</span> You have{' '}
                                                <span className="font-bold">{sessions.filter(s => s.isActive).length}</span> active session(s). 
                                                Review and logout from unfamiliar devices.
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-md"
                >
                    {/* Back Button */}
                    <motion.button
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordData({
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                        }}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 mb-4 transition-colors text-sm font-medium"
                    >
                        <FaArrowLeft className="w-3.5 h-3.5" />
                        Back to Security
                    </motion.button>

                    <div className="max-w-md mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-5"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md mx-auto mb-2">
                                <FaLock className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-900 text-base mb-1">Update Password</h4>
                            <p className="text-gray-600 text-xs">Enter your current and new password</p>
                        </motion.div>

                        {/* Password Form */}
                        <form onSubmit={onPasswordChange} className="space-y-4">
                            {[
                                {
                                    label: "Current Password",
                                    value: passwordData.oldPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, oldPassword: e.target.value }),
                                    show: showCurrentPassword,
                                    setShow: setShowCurrentPassword,
                                    icon: FaLock,
                                    placeholder: "Enter current password"
                                },
                                {
                                    label: "New Password",
                                    value: passwordData.newPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, newPassword: e.target.value }),
                                    show: showNewPassword,
                                    setShow: setShowNewPassword,
                                    icon: FaKey,
                                    placeholder: "Enter new password"
                                },
                                {
                                    label: "Confirm Password",
                                    value: passwordData.confirmPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }),
                                    show: showConfirmPassword,
                                    setShow: setShowConfirmPassword,
                                    icon: FaShieldAlt,
                                    placeholder: "Confirm new password"
                                }
                            ].map((field, index) => (
                                <motion.div
                                    key={field.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="space-y-1.5"
                                >
                                    <label className="block text-xs font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={field.show ? "text" : "password"}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2.5 pl-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            required
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <field.icon className="w-4 h-4" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => field.setShow(!field.show)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {field.show ? (
                                                <FaEyeSlash className="w-4 h-4" />
                                            ) : (
                                                <FaEye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Password Requirements */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gray-50 rounded-lg p-3 space-y-2"
                            >
                                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordData.newPassword.length >= 8 && <span className="text-white text-[10px]">✓</span>}
                                        </div>
                                        <span className={`text-xs ${passwordData.newPassword.length >= 8 ? 'text-green-700' : 'text-gray-600'}`}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword && <span className="text-white text-[10px]">✓</span>}
                                        </div>
                                        <span className={`text-xs ${passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? 'text-green-700' : 'text-gray-600'}`}>
                                            Passwords match
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="flex gap-3 pt-2"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            oldPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="flex-1 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 shadow-sm text-sm font-medium"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 shadow-sm text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <FaKey className="w-3.5 h-3.5" />
                                    Update
                                </motion.button>
                            </motion.div>
                        </form>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SecurityTab;