import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const Popup = ({ isOpen, onClose, onConfirm, title, description, type = "danger", confirmText, cancelText = "Cancel" }) => {
    const getIcon = () => {
        switch (type) {
            case "danger":
                return <FaExclamationTriangle className="w-6 h-6 text-red-600" />;
            case "warning":
                return <FaExclamationTriangle className="w-6 h-6 text-orange-600" />;
            default:
                return <FaInfoCircle className="w-6 h-6 text-blue-600" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case "danger":
                return "bg-red-600 hover:bg-red-700";
            case "warning":
                return "bg-orange-600 hover:bg-orange-700";
            default:
                return "bg-indigo-600 hover:bg-indigo-700";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        {/* Popup Card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {getIcon()}
                                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-6">{description}</p>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    {cancelText}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onConfirm}
                                    className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${getButtonColor()}`}
                                >
                                    {confirmText}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Popup;