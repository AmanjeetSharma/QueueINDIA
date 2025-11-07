import { motion } from "framer-motion";
import { FaSignOutAlt, FaTrash, FaUserSlash, FaExclamationTriangle } from "react-icons/fa";

const DangerZoneTab = ({ 
    onLogout, 
    onLogoutAll, 
    onDeleteAccount 
}) => {
    return (
        <motion.div
            key="danger"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            </div>
            
            <div className="space-y-6">
                {/* Logout Card */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <FaSignOutAlt className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Logout</h4>
                                <p className="text-gray-600 text-sm">Sign out from your current session</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            Logout
                        </motion.button>
                    </div>
                </div>

                {/* Logout All Card */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <FaUserSlash className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Logout from All Devices</h4>
                                <p className="text-red-700 text-sm">Sign out from all devices where you're currently logged in</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogoutAll}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto justify-center"
                        >
                            <FaUserSlash className="w-4 h-4" />
                            Logout All
                        </motion.button>
                    </div>
                </div>

                {/* Delete Account Card */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <FaTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Delete Account</h4>
                                <p className="text-red-700 text-sm">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onDeleteAccount}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto justify-center"
                        >
                            <FaTrash className="w-4 h-4" />
                            Delete Account
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DangerZoneTab;