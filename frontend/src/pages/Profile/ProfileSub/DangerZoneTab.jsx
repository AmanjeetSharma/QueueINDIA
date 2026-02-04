import { motion } from "framer-motion";
import { FaSignOutAlt, FaTrash, FaUserSlash, FaExclamationTriangle, FaGlobe, FaDesktop, FaSkullCrossbones } from "react-icons/fa";

const DangerZoneTab = ({ 
    onLogout, 
    onLogoutAll, 
    onDeleteAccount 
}) => {
    const DangerCard = ({ 
        title, 
        description, 
        severity = "medium", 
        icon: Icon, 
        onClick,
        buttonText,
        buttonIcon: ButtonIcon
    }) => {
        const severityStyles = {
            low: {
                container: "bg-orange-50/80 border-orange-200 hover:border-orange-300",
                iconBg: "bg-orange-100 text-orange-600",
                button: "bg-orange-500 hover:bg-orange-600 text-white",
                border: "border-orange-200"
            },
            medium: {
                container: "bg-red-50/80 border-red-200 hover:border-red-300",
                iconBg: "bg-red-100 text-red-600",
                button: "bg-red-500 hover:bg-red-600 text-white",
                border: "border-red-200"
            },
            high: {
                container: "bg-red-100/80 border-red-300 hover:border-red-400",
                iconBg: "bg-red-200 text-red-700",
                button: "bg-red-700 hover:bg-red-800 text-white",
                border: "border-red-300"
            }
        };

        const styles = severityStyles[severity];

        return (
            <motion.div
                whileHover={{ scale: 1.01 }}
                className={`relative overflow-hidden rounded-lg border ${styles.container} ${styles.border} transition-all duration-200 group`}
            >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="relative p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2.5 rounded-lg ${styles.iconBg} flex-shrink-0 mt-0.5`}>
                            <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                        {title}
                                    </h4>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {description}
                                    </p>
                                </div>
                                
                                {/* Action Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClick}
                                    className={`px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${styles.button} flex items-center justify-center gap-1.5 w-full sm:w-auto mt-2 sm:mt-0`}
                                >
                                    {ButtonIcon && <ButtonIcon className="w-3 h-3" />}
                                    {buttonText}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="p-1.5 bg-red-100 rounded-md">
                    <FaSkullCrossbones className="w-4 h-4 text-red-600" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">Danger Zone</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Irreversible actions - proceed with caution</p>
                </div>
            </div>

            <div className="space-y-3">
                {/* Current Session Logout */}
                <DangerCard
                    title="Logout Current Session"
                    description="Sign out from this device only"
                    severity="low"
                    icon={FaSignOutAlt}
                    buttonText="Logout"
                    buttonIcon={FaSignOutAlt}
                    onClick={onLogout}
                />

                {/* Logout All Devices */}
                <DangerCard
                    title="Logout All Devices"
                    description="Sign out from all sessions across all devices"
                    severity="medium"
                    icon={FaGlobe}
                    buttonText="Logout All"
                    buttonIcon={FaUserSlash}
                    onClick={onLogoutAll}
                />

                {/* Delete Account */}
                <DangerCard
                    title="Delete Account Permanently"
                    description="This action cannot be undone. All your data will be permanently deleted."
                    severity="high"
                    icon={FaTrash}
                    buttonText="Delete Account"
                    buttonIcon={FaTrash}
                    onClick={onDeleteAccount}
                />
            </div>

            {/* Warning Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
                <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-medium text-amber-800 mb-1">Important Notice</p>
                        <p className="text-xs text-amber-700">
                            These actions are irreversible. Deleting your account will remove all your data permanently.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Visual Indicator */}
            <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-xs text-gray-500">⚠️ Proceed with caution</span>
                </div>
            </div>
        </motion.div>
    );
};

export default DangerZoneTab;