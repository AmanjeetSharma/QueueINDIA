// pages/admin/officerPanel/OfficerPanel.jsx
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
    FaClipboardList,
    FaUser,
    FaChartBar,
    FaUsers,
    FaArrowRight,
    FaBuilding,
    FaSignOutAlt,
    FaHome
} from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";

const OfficerPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');

    const officerCards = [
        {
            id: "bookings",
            title: "All Bookings",
            description: "Manage department bookings and documents",
            icon: <FaClipboardList className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/bookings",  // ✅ Fixed path
            color: "from-blue-500 to-cyan-500",
            stats: "Manage",
            count: null
        },
        {
            id: "queue",
            title: "Live Queue",
            description: "View real-time service queue status",
            icon: <FaUsers className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/queue",  // ✅ Fixed path
            color: "from-purple-500 to-pink-500",
            stats: "Real-time",
            count: null
        },
        {
            id: "analytics",
            title: "Analytics",
            description: "Department performance insights",
            icon: <FaChartBar className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/analytics",  // ✅ Fixed path
            color: "from-green-500 to-emerald-500",
            stats: "Insights",
            count: null
        },
        {
            id: "profile",
            title: "My Profile",
            description: "Update profile and settings",
            icon: <FaUser className="w-6 h-6 sm:w-7 sm:h-7" />,
            path: "/officer-panel/profile",  // ✅ Fixed path
            color: "from-orange-500 to-red-500",
            stats: "Personal",
            count: null
        }
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Gradient Theme */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FaBuilding className="w-5 h-5" />
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold">
                                        DEPARTMENT OFFICER PORTAL
                                    </h1>
                                    <p className="text-sm text-blue-100 mt-1">
                                        {user?.department?.name || 'Department Management'}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 sm:mb-8 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200"
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                {getGreeting()} 👋 Officer {user?.name?.split(' ')[0] || ''}!
                            </h2>
                            <p className="text-sm text-gray-600">
                                Manage department bookings, review documents, and track service queue.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiCalendar className="w-4 h-4" />
                                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FiClock className="w-4 h-4" />
                                <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Access Cards */}
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Quick Access</h2>
                    <p className="text-sm text-gray-600 mb-4 sm:mb-6">Select an area to manage</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {officerCards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                className="h-full"
                            >
                                <Link
                                    to={card.path}
                                    onClick={() => setActiveTab(card.id)}
                                    className={`block bg-gradient-to-br ${card.color} rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 group h-full`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            {card.icon}
                                        </div>
                                        {card.count !== null && (
                                            <span className="text-xs font-bold bg-white/30 px-2 py-1 rounded-full">
                                                {card.count}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-bold mb-2">{card.title}</h3>
                                    <p className="text-white/80 text-sm mb-4">{card.description}</p>

                                    <div className="flex items-center gap-1.5 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                        <span>Access Now</span>
                                        <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl shadow-sm p-4 sm:p-6"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold mb-2">Department Overview</h3>
                            <p className="text-sm text-blue-200">
                                Manage your department's service queue and bookings efficiently
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                <p className="text-xs text-white/70 mb-1">Today's Bookings</p>
                                <p className="text-xl font-bold">--</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                <p className="text-xs text-white/70 mb-1">Pending Review</p>
                                <p className="text-xl font-bold">--</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                <p className="text-xs text-white/70 mb-1">Live Queue</p>
                                <p className="text-xl font-bold">--</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
                                <p className="text-xs text-white/70 mb-1">Completed Today</p>
                                <p className="text-xl font-bold">--</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaHome className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm mb-1">Department Officer Responsibilities</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                Review documents, manage bookings, track service queue, and ensure smooth department operations.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OfficerPanel;