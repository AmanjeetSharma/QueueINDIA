import { motion, AnimatePresence } from "framer-motion";
import { FaKey, FaLock, FaCalendarAlt, FaShieldAlt, FaDesktop, FaMobile, FaLaptop, FaGlobe, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaEyeSlash, FaCog, FaUserShield, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const SecurityTab = ({
    isChangingPassword,
    setIsChangingPassword,
    passwordData,
    setPasswordData,
    onPasswordChange
}) => {
    const { sessions: fetchSessionsFromAPI } = useAuth();
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
                    {/* Header - Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-6 sm:mb-8 md:mb-10"
                    >
                        <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4">
                            <FaUserShield className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Security</h3>
                        </div>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
                            Manage your security and monitor sessions
                        </p>
                    </motion.div>

                    {/* Cards Container - Responsive */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4 sm:space-y-5 md:space-y-6"
                    >
                        {/* Change Password Card - Compact */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <motion.div
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0"
                                    >
                                        <FaLock className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-white" />
                                    </motion.div>
                                    <div className="space-y-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">Password Security</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                            Update your password regularly
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsChangingPassword(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center font-semibold text-xs sm:text-sm md:text-base flex-shrink-0"
                                >
                                    <FaKey className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                                    <span>Change</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Sessions Card - Compact */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <motion.div
                                        whileHover={{ rotate: -10, scale: 1.1 }}
                                        className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0"
                                    >
                                        <FaShieldAlt className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-white" />
                                    </motion.div>
                                    <div className="space-y-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">Active Sessions</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                            View your login sessions
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowSessions(!showSessions)}
                                    className="flex items-center gap-2 bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center font-semibold text-xs sm:text-sm md:text-base flex-shrink-0"
                                >
                                    <FaCalendarAlt className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                                    <span>{showSessions ? 'Hide' : 'View'}</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Sessions List - Responsive */}
                        <AnimatePresence>
                            {showSessions && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md"
                                >
                                    {/* Sessions Header - Compact */}
                                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-5 md:mb-6">
                                        <motion.h4
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="font-bold text-gray-900 flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg"
                                        >
                                            <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                                                <FaShieldAlt className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-white" />
                                            </div>
                                            <span className="truncate">
                                                Sessions ({sessions.filter(s => s.isActive).length})
                                            </span>
                                        </motion.h4>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={fetchSessions}
                                            disabled={loadingSessions}
                                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
                                        >
                                            <FaCog className={`w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 ${loadingSessions ? 'animate-spin' : ''}`} />
                                            <span className="hidden sm:inline">Refresh</span>
                                        </motion.button>
                                    </div>

                                    {/* Sessions Content */}
                                    {loadingSessions ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-center py-8 sm:py-10 md:py-12"
                                        >
                                            <div className="text-center space-y-2 sm:space-y-3">
                                                <div className="animate-spin rounded-full h-10 sm:h-12 w-10 sm:w-12 border-b-2 border-green-600 mx-auto"></div>
                                                <p className="text-gray-600 text-xs sm:text-sm">Loading sessions...</p>
                                            </div>
                                        </motion.div>
                                    ) : sessions.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-8 sm:py-10 md:py-12 space-y-2 sm:space-y-3"
                                        >
                                            <FaCalendarAlt className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 mx-auto text-gray-300" />
                                            <p className="text-gray-500 text-sm sm:text-base font-medium">No active sessions</p>
                                            <p className="text-gray-400 text-xs sm:text-sm">Sessions will appear here</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="space-y-3 sm:space-y-4"
                                        >
                                            {sessions.map((session) => {
                                                const DeviceIcon = getDeviceIcon(session.device);
                                                return (
                                                    <motion.div
                                                        key={session.sessionId}
                                                        variants={itemVariants}
                                                        whileHover={{ scale: 1.01 }}
                                                        className={`flex flex-col gap-3 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 backdrop-blur-sm ${
                                                            session.isActive
                                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
                                                                : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                                                        }`}
                                                    >
                                                        {/* Device Info */}
                                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                                            <motion.div
                                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                                className={`w-9 sm:w-10 md:w-12 h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                                                                    session.isActive ? 'bg-green-100' : 'bg-gray-100'
                                                                }`}
                                                            >
                                                                <DeviceIcon className={`w-4.5 sm:w-5 md:w-6 h-4.5 sm:h-5 md:h-6 ${
                                                                    session.isActive ? 'text-green-600' : 'text-gray-500'
                                                                }`} />
                                                            </motion.div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate">
                                                                    {session.device}
                                                                </p>
                                                                <motion.span
                                                                    initial={{ scale: 0.8 }}
                                                                    animate={{ scale: 1 }}
                                                                    className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                                                                        session.isActive
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                    }`}
                                                                >
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
                                                                            <FaTimesCircle className="w-3 h-3" />
                                                                            <span>Inactive</span>
                                                                        </>
                                                                    )}
                                                                </motion.span>
                                                            </div>
                                                        </div>

                                                        {/* Session Details - Compact Grid */}
                                                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                            <div className="flex items-center gap-2 text-gray-600 bg-white/60 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                                <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <FaClock className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:w-4 md:h-5 text-blue-600" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-medium text-xs text-gray-500">First</p>
                                                                    <p className="text-gray-900 font-medium text-xs sm:text-sm truncate">{formatDate(session.firstLogin)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600 bg-white/60 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                                <div className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <FaCalendarAlt className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 text-purple-600" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="font-medium text-xs text-gray-500">Last</p>
                                                                    <p className="text-gray-900 font-medium text-xs sm:text-sm">{getTimeAgo(session.latestLogin)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </motion.div>
                                    )}

                                    {/* Security Tips - Compact */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl"
                                    >
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                                <FaShieldAlt className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-blue-600" />
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <p className="font-semibold text-blue-900 text-xs sm:text-sm">Security Tip</p>
                                                <p className="text-blue-700 text-xs sm:text-sm">
                                                    You have <span className="font-bold">{sessions.filter(s => s.isActive).length}</span> active session(s). Review and logout from unfamiliar devices.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg"
                >
                    {/* Back Button - Compact */}
                    <motion.button
                        whileHover={{ scale: 1.05, x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordData({
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-5 sm:mb-6 md:mb-8 transition-colors font-medium text-xs sm:text-sm md:text-base"
                    >
                        <FaArrowLeft className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                        Back
                    </motion.button>

                    <div className="max-w-xl mx-auto">
                        {/* Header - Compact */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-5 sm:mb-6 md:mb-8"
                        >
                            <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-md mx-auto mb-2 sm:mb-3 md:mb-4">
                                <FaLock className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl mb-1">Update Password</h4>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base">Enter current and new password</p>
                        </motion.div>

                        {/* Password Form */}
                        <form onSubmit={onPasswordChange} className="space-y-4 sm:space-y-5 md:space-y-6">
                            {[
                                {
                                    label: "Current Password",
                                    value: passwordData.oldPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, oldPassword: e.target.value }),
                                    show: showCurrentPassword,
                                    setShow: setShowCurrentPassword,
                                    icon: FaLock,
                                    placeholder: "Current password"
                                },
                                {
                                    label: "New Password",
                                    value: passwordData.newPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, newPassword: e.target.value }),
                                    show: showNewPassword,
                                    setShow: setShowNewPassword,
                                    icon: FaKey,
                                    placeholder: "New password"
                                },
                                {
                                    label: "Confirm Password",
                                    value: passwordData.confirmPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }),
                                    show: showConfirmPassword,
                                    setShow: setShowConfirmPassword,
                                    icon: FaShieldAlt,
                                    placeholder: "Confirm password"
                                }
                            ].map((field, index) => (
                                <motion.div
                                    key={field.label}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="space-y-1.5 sm:space-y-2"
                                >
                                    <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={field.show ? "text" : "password"}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 pl-9 sm:pl-10 md:pl-12 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
                                            required
                                        />
                                        <div className="absolute left-3 sm:left-4 md:left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <field.icon className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                                        </div>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => field.setShow(!field.show)}
                                            className="absolute right-3 sm:right-4 md:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {field.show ? (
                                                <FaEyeSlash className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                                            ) : (
                                                <FaEye className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Action Buttons - Responsive */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col xs:flex-row gap-2.5 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            oldPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                    }}
                                    className="flex items-center gap-2 bg-gray-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300 flex-1 justify-center font-semibold text-xs sm:text-sm md:text-base"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="flex items-center gap-2 bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300 flex-1 justify-center font-semibold text-xs sm:text-sm md:text-base"
                                >
                                    <FaKey className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
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