import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
    FaClipboardList,
    FaUser,
    FaChartBar,
    FaUsers,
    FaArrowRight,
    FaBuilding,
    FaHome
} from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";

const OfficerPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const officerCards = [
        {
            id: "bookings",
            title: "All Bookings",
            description: "Manage department bookings and documents",
            icon: <FaClipboardList className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/bookings",
            bgColor: "bg-blue-600",
            hoverBgColor: "hover:bg-blue-700",
            emoji: "📋"
        },
        {
            id: "queue",
            title: "Live Queue",
            description: "View real-time service queue status",
            icon: <FaUsers className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/queue-services",
            bgColor: "bg-purple-600",
            hoverBgColor: "hover:bg-purple-700",
            emoji: "👥"
        },
        {
            id: "analytics",
            title: "Analytics",
            description: "Department performance insights",
            icon: <FaChartBar className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/analytics",
            bgColor: "bg-green-600",
            hoverBgColor: "hover:bg-green-700",
            emoji: "📊"
        },
        {
            id: "profile",
            title: "My Profile",
            description: "Update profile and settings",
            icon: <FaUser className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/profile",
            bgColor: "bg-orange-600",
            hoverBgColor: "hover:bg-orange-700",
            emoji: "👤"
        }
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-900 text-white"
        >
            {/* Header */}
            <motion.header
                variants={itemVariants}
                className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40"
            >
                <div className="px-6 md:px-8 py-5">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            {/* Left Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                    <FaBuilding className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                                        Officer Portal
                                    </h1>
                                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                                        {user?.department?.name || 'Department Management'}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="px-6 md:px-8 py-8 bg-gray-900">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-800 border border-gray-700 rounded-xl shadow-sm p-4 sm:p-6"
                    >
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex-1 min-w-0"
                            >
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                                    {getGreeting()} 👋
                                </h2>
                                <p className="text-sm sm:text-base text-gray-300 mb-1">
                                    Welcome back, <span className="font-semibold text-blue-400">{user?.name?.split(' ')[0] || 'Officer'}</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    Manage bookings, review documents, track service queue
                                </p>
                            </motion.div>

                            {/* Time Display - Compact with seconds */}
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex-shrink-0"
                            >
                                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <FiCalendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        <span className="font-medium text-xs sm:text-sm text-gray-300 truncate">
                                            {new Date().toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiClock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        <span className="font-bold text-sm sm:text-base text-white font-mono">
                                            {currentTime.toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Quick Access Section */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6"
                        >
                            <h2 className="text-3xl font-bold text-white mb-2">Quick Access</h2>
                            <p className="text-gray-400">Select an area to manage your department operations</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {officerCards.map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    variants={itemVariants}
                                    transition={{ delay: 0.35 + index * 0.05 }}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="group h-full"
                                >
                                    <Link to={card.path} onClick={() => setActiveTab(card.id)} className="block h-full">
                                        {/* Card */}
                                        <div className={`bg-gray-800 border border-gray-700 ${card.hoverBgColor} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all p-6 h-full flex flex-col cursor-pointer`}>
                                            {/* Icon & Badge */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`w-14 h-14 ${card.bgColor} rounded-lg flex items-center justify-center shadow-md text-white group-hover:scale-110 transition-transform`}>
                                                    {card.icon}
                                                </div>

                                                <div className="text-2xl">
                                                    {card.emoji}
                                                </div>
                                            </div>

                                            {/* Title & Description */}
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {card.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-1">
                                                {card.description}
                                            </p>

                                            {/* CTA */}
                                            <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-blue-400">
                                                <span>Access Now</span>
                                                <motion.div
                                                    animate={{ x: [0, 4, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <FaArrowRight className="w-4 h-4" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer Info */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FaHome className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-1">Officer Responsibilities</h4>
                                <p className="text-gray-400 text-sm">
                                    Review documents, manage bookings, track service queue, and ensure smooth department operations. Access real-time analytics and monitor queue status efficiently.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default OfficerPanel;