import { motion, AnimatePresence } from "framer-motion";
import { FaKey, FaLock, FaCalendarAlt, FaShieldAlt, FaDesktop, FaMobile, FaLaptop, FaGlobe, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaEyeSlash, FaCog, FaUserShield } from "react-icons/fa";
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
        >
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                    <FaUserShield className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Security Center</h3>
                </div>
                <p className="text-gray-600 mt-3">Manage your account security and active sessions</p>
            </motion.div>

            {!isChangingPassword ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Change Password Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        variants={cardHoverVariants}
                        className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <motion.div 
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                                >
                                    <FaLock className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 text-lg">Change Password</h4>
                                    <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    background: "linear-gradient(135deg, #2563eb, #4f46e5)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsChangingPassword(true)}
                                className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center font-semibold"
                            >
                                <FaKey className="w-4 h-4" />
                                Change Password
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Sessions Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        variants={cardHoverVariants}
                        className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <motion.div 
                                    whileHover={{ rotate: -10, scale: 1.1 }}
                                    className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                                >
                                    <FaShieldAlt className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 text-lg">Active Sessions</h4>
                                    <p className="text-gray-600 text-sm">Monitor and manage your login sessions across devices</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    background: "linear-gradient(135deg, #059669, #047857)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSessions(!showSessions)}
                                className="flex items-center gap-3 bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center font-semibold"
                            >
                                <FaCalendarAlt className="w-4 h-4" />
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
                                className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <motion.h4 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-bold text-gray-900 flex items-center gap-3 text-lg"
                                    >
                                        <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                            <FaShieldAlt className="w-5 h-5 text-white" />
                                        </div>
                                        Active Sessions ({sessions.filter(s => s.isActive).length})
                                    </motion.h4>
                                    <motion.button
                                        whileHover={{ scale: 1.05, rotate: 15 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={fetchSessions}
                                        disabled={loadingSessions}
                                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                    >
                                        <FaCog className={`w-4 h-4 ${loadingSessions ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </motion.button>
                                </div>

                                {loadingSessions ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-center py-12"
                                    >
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-3"></div>
                                            <p className="text-gray-600">Loading sessions...</p>
                                        </div>
                                    </motion.div>
                                ) : sessions.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <FaCalendarAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-gray-500 text-lg font-medium">No active sessions found</p>
                                        <p className="text-gray-400 text-sm mt-1">Your session history will appear here</p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4"
                                    >
                                        {sessions.map((session, index) => {
                                            const DeviceIcon = getDeviceIcon(session.device);
                                            return (
                                                <motion.div
                                                    key={session.sessionId}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01 }}
                                                    className={`flex items-start gap-4 p-5 rounded-xl border-2 backdrop-blur-sm ${session.isActive
                                                        ? 'bg-linear-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
                                                        : 'bg-linear-to-r from-red-100 to-red-100 border-red-200'
                                                        }`}
                                                >
                                                    <motion.div 
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${session.isActive ? 'bg-green-100' : 'bg-gray-100'
                                                            }`}
                                                    >
                                                        <DeviceIcon className={`w-6 h-6 ${session.isActive ? 'text-green-600' : 'text-gray-500'
                                                            }`} />
                                                    </motion.div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                            <p className="font-semibold text-gray-900 truncate text-lg">
                                                                {session.device}
                                                            </p>
                                                            <motion.span
                                                                initial={{ scale: 0.8 }}
                                                                animate={{ scale: 1 }}
                                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${session.isActive
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
                                                                        <span>Active</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaTimesCircle className="w-3 h-3 text-red-600" 
                                                                        />
                                                                        <span className="text-red-600">Inactive</span>
                                                                    </>
                                                                )}
                                                            </motion.span>
                                                        </div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-3 text-gray-600 bg-white/50 rounded-lg p-3">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                    <FaClock className="w-3 h-3 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-xs text-gray-500">First Login</p>
                                                                    <p className="text-gray-900">{formatDate(session.firstLogin)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-gray-600 bg-white/50 rounded-lg p-3">
                                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                    <FaCalendarAlt className="w-3 h-3 text-purple-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-xs text-gray-500">Last Active</p>
                                                                    <p className="text-gray-900">{getTimeAgo(session.latestLogin)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}

                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-6 p-5 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FaShieldAlt className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-blue-900 mb-2">Session Security Tips</p>
                                            <p className="text-blue-700 text-sm">
                                                You have <span className="font-bold">{sessions.filter(s => s.isActive).length}</span> active sessions. 
                                                For security, regularly review your sessions and use "Logout from All Devices" in the Danger Zone if you notice any suspicious activity.
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
                    className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -mr-12 -mt-12 opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-200 rounded-full -ml-8 -mb-8 opacity-20"></div>
                    
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FaLock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-xl">Change Your Password</h4>
                                <p className="text-gray-600 text-sm">Enter your current and new password</p>
                            </div>
                        </motion.div>

                        <form onSubmit={onPasswordChange} className="space-y-5">
                            {[
                                {
                                    label: "Current Password",
                                    value: passwordData.oldPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, oldPassword: e.target.value }),
                                    show: showCurrentPassword,
                                    setShow: setShowCurrentPassword,
                                    icon: FaLock
                                },
                                {
                                    label: "New Password", 
                                    value: passwordData.newPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, newPassword: e.target.value }),
                                    show: showNewPassword,
                                    setShow: setShowNewPassword,
                                    icon: FaKey
                                },
                                {
                                    label: "Confirm New Password",
                                    value: passwordData.confirmPassword,
                                    onChange: (e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value }),
                                    show: showConfirmPassword,
                                    setShow: setShowConfirmPassword,
                                    icon: FaShieldAlt
                                }
                            ].map((field, index) => (
                                <motion.div
                                    key={field.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <label className="block text-sm font-semibold text-gray-700">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={field.show ? "text" : "password"}
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="w-full px-4 py-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                            required
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <field.icon className="w-5 h-5" />
                                        </div>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => field.setShow(!field.show)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {field.show ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-3 pt-4"
                            >
                                <motion.button
                                    whileHover={{ 
                                        scale: 1.05,
                                        background: "linear-gradient(135deg, #6b7280, #4b5563)"
                                    }}
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
                                    className="flex items-center gap-3 bg-linear-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex-1 justify-center font-semibold"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ 
                                        scale: 1.05,
                                        background: "linear-gradient(135deg, #059669, #047857)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="flex items-center gap-3 bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex-1 justify-center font-semibold"
                                >
                                    <FaKey className="w-4 h-4" />
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