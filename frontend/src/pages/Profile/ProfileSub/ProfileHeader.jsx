import { motion } from "framer-motion";
import { FaCamera, FaPhone, FaEnvelope, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";

const ProfileHeader = ({ user, onAvatarClick, fileInputRef, onAvatarChange }) => {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative cursor-pointer"
                        onClick={onAvatarClick}
                    >
                        <img
                            src={user.avatar || "https://via.placeholder.com/120"}
                            alt="Profile"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <FaCamera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                    </motion.div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className="hidden"
                    />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">{user.name}</h2>
                    
                    {/* Email with verification status */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-1">
                        <FaEnvelope className="w-4 h-4 text-indigo-200" />
                        <p className="text-indigo-100">{user.email}</p>
                        {user.isEmailVerified ? (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                            >
                                <FaCheck className="w-3 h-3" />
                                Verified
                            </motion.span>
                        ) : (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                            >
                                <FaExclamationTriangle className="w-3 h-3" />
                                Not Verified
                            </motion.span>
                        )}
                    </div>

                    {/* Phone with verification status */}
                    {user.phone && (
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <FaPhone className="w-4 h-4 text-indigo-200" />
                            <p className="text-indigo-100">{user.phone}</p>
                            {user.isPhoneVerified ? (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                >
                                    <FaCheck className="w-3 h-3" />
                                    Verified
                                </motion.span>
                            ) : (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                >
                                    <FaTimes className="w-3 h-3" />
                                    Not Verified
                                </motion.span>
                            )}
                        </div>
                    )}

                    {/* Verification Status Summary */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-center sm:justify-start gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                <span>Email {user.isEmailVerified ? 'Verified' : 'Pending'}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${user.isPhoneVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                    <span>Phone {user.isPhoneVerified ? 'Verified' : 'Pending'}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;