import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTrendingUp,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiFileText,
    FiCalendar,
    FiFilter,
    FiDownload,
    FiBarChart,
    FiPieChart,
    FiArrowUp,
    FiArrowDown,
    FiTarget
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
    const [dateRange, setDateRange] = useState('week');
    const [selectedMetric, setSelectedMetric] = useState('bookings');
    const [loading, setLoading] = useState(false);

    // Mock data - Replace with real API data
    const lineChartData = [
        { date: 'Mon', bookings: 45, completed: 38, pending: 7 },
        { date: 'Tue', bookings: 52, completed: 44, pending: 8 },
        { date: 'Wed', bookings: 48, completed: 40, pending: 8 },
        { date: 'Thu', bookings: 61, completed: 52, pending: 9 },
        { date: 'Fri', bookings: 55, completed: 46, pending: 9 },
        { date: 'Sat', bookings: 38, completed: 32, pending: 6 },
        { date: 'Sun', bookings: 25, completed: 20, pending: 5 }
    ];

    const barChartData = [
        { name: 'Passport', value: 120, percentage: 22 },
        { name: 'License', value: 95, percentage: 17 },
        { name: 'Visa', value: 140, percentage: 26 },
        { name: 'Certificate', value: 105, percentage: 19 },
        { name: 'Other', value: 93, percentage: 16 }
    ];

    const pieData = [
        { name: 'Approved', value: 45, color: '#10b981' },
        { name: 'Pending', value: 30, color: '#f59e0b' },
        { name: 'Rejected', value: 15, color: '#ef4444' },
        { name: 'Completed', value: 10, color: '#06b6d4' }
    ];

    const stats = [
        {
            label: 'Total Bookings',
            value: '1,234',
            change: '+12.5%',
            isPositive: true,
            icon: FiFileText,
            color: 'blue',
            bgColor: 'bg-blue-900/30'
        },
        {
            label: 'Completed',
            value: '892',
            change: '+8.2%',
            isPositive: true,
            icon: FiCheckCircle,
            color: 'green',
            bgColor: 'bg-green-900/30'
        },
        {
            label: 'Pending',
            value: '256',
            change: '-5.1%',
            isPositive: false,
            icon: FiClock,
            color: 'yellow',
            bgColor: 'bg-yellow-900/30'
        },
        {
            label: 'Rejected',
            value: '86',
            change: '+2.3%',
            isPositive: false,
            icon: FiXCircle,
            color: 'red',
            bgColor: 'bg-red-900/30'
        }
    ];

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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const getColorByName = (color) => {
        const colors = {
            blue: 'text-blue-400',
            green: 'text-green-400',
            yellow: 'text-yellow-400',
            red: 'text-red-400',
            purple: 'text-purple-400',
            cyan: 'text-cyan-400'
        };
        return colors[color] || colors.blue;
    };

    const getBgColorByName = (color) => {
        const colors = {
            blue: 'bg-blue-600/20 border-blue-600/30',
            green: 'bg-green-600/20 border-green-600/30',
            yellow: 'bg-yellow-600/20 border-yellow-600/30',
            red: 'bg-red-600/20 border-red-600/30',
            purple: 'bg-purple-600/20 border-purple-600/30',
            cyan: 'bg-cyan-600/20 border-cyan-600/30'
        };
        return colors[color] || colors.blue;
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-900 text-white pb-8"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20"
            >
                <div className="px-3 sm:px-4 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                                    <FiBarChart className="w-8 h-8 text-blue-400" />
                                    Analytics Dashboard
                                </h1>
                                <p className="text-sm text-gray-400">Track your department's performance</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:border-blue-500 outline-none transition-colors"
                                >
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="quarter">This Quarter</option>
                                    <option value="year">This Year</option>
                                </select>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <FiDownload className="w-4 h-4" />
                                    <span className="hidden sm:inline">Export</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="px-3 sm:px-4 py-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* KPI Cards */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`${stat.bgColor} border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all group`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2.5 ${getBgColorByName(stat.color)} border rounded-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-5 h-5 ${getColorByName(stat.color)}`} />
                                        </div>
                                        <motion.div
                                            animate={{ y: [0, -2, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`text-xs font-bold flex items-center gap-1 ${stat.isPositive ? 'text-green-400' : 'text-red-400'
                                                }`}
                                        >
                                            {stat.isPositive ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                                            {stat.change}
                                        </motion.div>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                                    <motion.p
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                        className="text-3xl font-bold text-white"
                                    >
                                        {stat.value}
                                    </motion.p>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Trending Chart */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:border-gray-600 transition-all"
                        >
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                    <FiTrendingUp className="w-5 h-5 text-blue-400" />
                                    Booking Trends
                                </h2>
                                <p className="text-sm text-gray-400">Weekly booking progression</p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="h-80"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                        <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                                        <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </motion.div>

                        {/* Status Pie Chart */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:border-gray-600 transition-all"
                        >
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                    <FiPieChart className="w-5 h-5 text-cyan-400" />
                                    Status Distribution
                                </h2>
                                <p className="text-sm text-gray-400">Current booking status</p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="h-80"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name} ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                            labelStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Service Breakdown */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:border-gray-600 transition-all"
                    >
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                <FiTarget className="w-5 h-5 text-purple-400" />
                                Service-wise Bookings
                            </h2>
                            <p className="text-sm text-gray-400">Distribution across services</p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="h-80"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Service Details Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 overflow-x-auto"
                        >
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-3 text-gray-400 font-medium">Service</th>
                                        <th className="text-right py-3 px-3 text-gray-400 font-medium">Bookings</th>
                                        <th className="text-right py-3 px-3 text-gray-400 font-medium">Percentage</th>
                                        <th className="text-right py-3 px-3 text-gray-400 font-medium">Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {barChartData.map((item, idx) => (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.05 }}
                                            className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                                        >
                                            <td className="py-3 px-3 text-white font-medium">{item.name}</td>
                                            <td className="text-right py-3 px-3 text-cyan-400 font-bold">{item.value}</td>
                                            <td className="text-right py-3 px-3">
                                                <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs font-medium">
                                                    {item.percentage}%
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-3">
                                                <span className="text-green-400 font-bold flex items-center justify-end gap-1">
                                                    <FiArrowUp className="w-3 h-3" />
                                                    +{Math.floor(Math.random() * 20) + 5}%
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </motion.div>

                    {/* Performance Metrics */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {[
                            { label: 'Avg Processing Time', value: '2.5 days', icon: '⏱️', color: 'blue' },
                            { label: 'Approval Rate', value: '87.5%', icon: '✅', color: 'green' },
                            { label: 'Document Accuracy', value: '95.2%', icon: '📋', color: 'cyan' }
                        ].map((metric, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className={`${getBgColorByName(metric.color)} border rounded-lg p-4 hover:border-gray-600 transition-all group`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
                                        <p className="text-2xl font-bold text-white">{metric.value}</p>
                                    </div>
                                    <span className="text-2xl">{metric.icon}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:border-gray-600 transition-all"
                    >
                        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>

                        <div className="space-y-3">
                            {[
                                { action: 'Booking Completed', user: 'John Doe', time: '2 hours ago', icon: '✅', color: 'green' },
                                { action: 'Document Rejected', user: 'Jane Smith', time: '4 hours ago', icon: '❌', color: 'red' },
                                { action: 'New Booking', user: 'Mike Johnson', time: '6 hours ago', icon: '📝', color: 'blue' },
                                { action: 'Document Approved', user: 'Sarah Lee', time: '8 hours ago', icon: '✅', color: 'green' },
                                { action: 'Booking Cancelled', user: 'Tom Brown', time: '1 day ago', icon: '🚫', color: 'red' }
                            ].map((activity, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + idx * 0.05 }}
                                    className="flex items-center gap-4 p-3 bg-gray-700/30 border border-gray-700/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                                >
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{activity.action}</p>
                                        <p className="text-xs text-gray-400">{activity.user}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;