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
        } catch (error) {
            // Error handled in AuthContext
        } finally {
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
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const cardHoverVariants = {
        hover: {
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.98
        }
    };

    return (
        <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
                    <FaUserShield className="w-7 h-7" />
                    <h3 className="text-2xl font-bold">Security Center</h3>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Manage your account security, monitor active sessions, and keep your information safe
                </p>
            </motion.div>

            {!isChangingPassword ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* Change Password Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="group relative bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <motion.div 
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                                >
                                    <FaLock className="w-7 h-7 text-white" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-900 text-xl">Password Security</h4>
                                    <p className="text-gray-600 max-w-md">
                                        Regularly update your password to maintain account security. Use a strong, unique password.
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsChangingPassword(true)}
                                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full lg:w-auto justify-center font-semibold text-lg"
                            >
                                <FaKey className="w-5 h-5" />
                                Change Password
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Sessions Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="group relative bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <motion.div 
                                    whileHover={{ rotate: -10, scale: 1.1 }}
                                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                                >
                                    <FaShieldAlt className="w-7 h-7 text-white" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-900 text-xl">Active Sessions</h4>
                                    <p className="text-gray-600 max-w-md">
                                        Monitor and manage your login sessions across different devices and locations.
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSessions(!showSessions)}
                                className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full lg:w-auto justify-center font-semibold text-lg"
                            >
                                <FaCalendarAlt className="w-5 h-5" />
                                {showSessions ? 'Hide Sessions' : 'View Sessions'}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Sessions List */}
                    <AnimatePresence>
                        {showSessions && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                                    <motion.h4 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-bold text-gray-900 flex items-center gap-4 text-2xl"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <FaShieldAlt className="w-6 h-6 text-white" />
                                        </div>
                                        Active Sessions ({sessions.filter(s => s.isActive).length})
                                    </motion.h4>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={fetchSessions}
                                        disabled={loadingSessions}
                                        className="flex items-center gap-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                    >
                                        <FaCog className={`w-5 h-5 ${loadingSessions ? 'animate-spin' : ''}`} />
                                        Refresh Sessions
                                    </motion.button>
                                </div>

                                {loadingSessions ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-center py-16"
                                    >
                                        <div className="text-center space-y-4">
                                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                                            <p className="text-gray-600 text-lg">Loading your sessions...</p>
                                        </div>
                                    </motion.div>
                                ) : sessions.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16 space-y-4"
                                    >
                                        <FaCalendarAlt className="w-20 h-20 mx-auto text-gray-300" />
                                        <p className="text-gray-500 text-xl font-medium">No active sessions found</p>
                                        <p className="text-gray-400">Your session history will appear here</p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-6"
                                    >
                                        {sessions.map((session, index) => {
                                            const DeviceIcon = getDeviceIcon(session.device);
                                            return (
                                                <motion.div
                                                    key={session.sessionId}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01 }}
                                                    className={`flex flex-col lg:flex-row items-start gap-6 p-6 rounded-2xl border-2 backdrop-blur-sm ${
                                                        session.isActive
                                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
                                                            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <motion.div 
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                                                                session.isActive ? 'bg-green-100' : 'bg-gray-100'
                                                            }`}
                                                        >
                                                            <DeviceIcon className={`w-7 h-7 ${
                                                                session.isActive ? 'text-green-600' : 'text-gray-500'
                                                            }`} />
                                                        </motion.div>

                                                        <div className="flex-1 min-w-0 space-y-3">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <p className="font-semibold text-gray-900 text-lg truncate">
                                                                    {session.device}
                                                                </p>
                                                                <motion.span
                                                                    initial={{ scale: 0.8 }}
                                                                    animate={{ scale: 1 }}
                                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
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
                                                                                className="w-2 h-2 bg-green-500 rounded-full"
                                                                            />
                                                                            <span>Active Now</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FaTimesCircle className="w-4 h-4 text-red-600" />
                                                                            <span>Inactive</span>
                                                                        </>
                                                                    )}
                                                                </motion.span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="flex items-center gap-4 text-gray-600 bg-white/70 rounded-xl p-4">
                                                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                                        <FaClock className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm text-gray-500">First Login</p>
                                                                        <p className="text-gray-900 font-medium">{formatDate(session.firstLogin)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-gray-600 bg-white/70 rounded-xl p-4">
                                                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                                        <FaCalendarAlt className="w-5 h-5 text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm text-gray-500">Last Active</p>
                                                                        <p className="text-gray-900 font-medium">{getTimeAgo(session.latestLogin)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}

                                {/* Security Tips */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <FaShieldAlt className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-semibold text-blue-900 text-lg">Security Tips</p>
                                            <p className="text-blue-700">
                                                You have <span className="font-bold">{sessions.filter(s => s.isActive).length}</span> active sessions. 
                                                Regularly review your sessions and log out from unfamiliar devices to keep your account secure.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-xl"
                >
                    {/* Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordData({
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                        }}
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-800 mb-8 transition-colors font-medium"
                    >
                        <FaArrowLeft className="w-5 h-5" />
                        Back to Security
                    </motion.button>

                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                                <FaLock className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-2xl mb-2">Update Your Password</h4>
                            <p className="text-gray-600 text-lg">Enter your current password and set a new one</p>
                        </motion.div>

                        <form onSubmit={onPasswordChange} className="space-y-6">
                            {[
                                {
                                    label: "Current Password",
                                    value: passwordData.oldPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, oldPassword: e.target.value }),
                                    show: showCurrentPassword,
                                    setShow: setShowCurrentPassword,
                                    icon: FaLock,
                                    placeholder: "Enter your current password"
                                },
                                {
                                    label: "New Password", 
                                    value: passwordData.newPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, newPassword: e.target.value }),
                                    show: showNewPassword,
                                    setShow: setShowNewPassword,
                                    icon: FaKey,
                                    placeholder: "Create a strong new password"
                                },
                                {
                                    label: "Confirm New Password",
                                    value: passwordData.confirmPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }),
                                    show: showConfirmPassword,
                                    setShow: setShowConfirmPassword,
                                    icon: FaShieldAlt,
                                    placeholder: "Re-enter your new password"
                                }
                            ].map((field, index) => (
                                <motion.div
                                    key={field.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="space-y-3"
                                >
                                    <label className="block text-sm font-semibold text-gray-700 text-lg">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={field.show ? "text" : "password"}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={field.placeholder}
                                            className="w-full px-5 py-4 pl-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-lg"
                                            required
                                        />
                                        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <field.icon className="w-6 h-6" />
                                        </div>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => field.setShow(!field.show)}
                                            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {field.show ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 pt-6"
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
                                    className="flex items-center gap-3 bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 justify-center font-semibold text-lg"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 flex-1 justify-center font-semibold text-lg"
                                >
                                    <FaKey className="w-5 h-5" />
                                    Update Password
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