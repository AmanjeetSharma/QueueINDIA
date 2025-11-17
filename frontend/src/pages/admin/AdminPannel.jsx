import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
    LineChart, Line, AreaChart, Area, ResponsiveContainer 
} from 'recharts';

// Icons Component
const Icon = ({ name, className = "" }) => {
    const icons = {
        dashboard: "📊",
        users: "👥",
        queue: "📋",
        analytics: "📈",
        settings: "⚙️",
        logout: "🚪",
        menu: "☰",
        bell: "🔔",
        search: "🔍",
        plus: "➕",
        edit: "✏️",
        delete: "🗑️",
        check: "✅",
        close: "❌",
        calendar: "📅",
        time: "⏰",
        location: "📍"
    };
    
    return <span className={className}>{icons[name]}</span>;
};

// Main Admin Panel Component
const AdminPannel = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 1247,
        activeQueues: 23,
        completedToday: 156,
        avgWaitTime: '12m'
    });

    // Mock data for charts
    const queueData = [
        { name: 'Mon', users: 240, waitTime: 15 },
        { name: 'Tue', users: 380, waitTime: 18 },
        { name: 'Wed', users: 220, waitTime: 12 },
        { name: 'Thu', users: 450, waitTime: 20 },
        { name: 'Fri', users: 520, waitTime: 25 },
        { name: 'Sat', users: 380, waitTime: 22 },
        { name: 'Sun', users: 290, waitTime: 16 }
    ];

    const queueTypeData = [
        { name: 'Bank', value: 35 },
        { name: 'Hospital', value: 25 },
        { name: 'Government', value: 20 },
        { name: 'Retail', value: 15 },
        { name: 'Other', value: 5 }
    ];


    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <motion.div 
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                transition={{ duration: 0.3 }}
                className="fixed lg:relative bg-white shadow-xl z-30 w-64"
            >
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-blue-600">Queue India</h1>
                    <p className="text-sm text-gray-600">Admin Panel</p>
                </div>
                
                <nav className="mt-6">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                        { id: 'users', label: 'User Management', icon: 'users' },
                        { id: 'queues', label: 'Queue Management', icon: 'queue' },
                        { id: 'analytics', label: 'Analytics', icon: 'analytics' },
                        { id: 'settings', label: 'Settings', icon: 'settings' }
                    ].map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                                activeTab === item.id 
                                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon name={item.icon} className="mr-3 text-lg" />
                            {item.label}
                        </motion.button>
                    ))}
                </nav>
                
                <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
                    <button className="flex items-center text-red-600 hover:text-red-700">
                        <Icon name="logout" className="mr-3" />
                        Logout
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm z-20">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center">
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 mr-4"
                            >
                                <Icon name="menu" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800 capitalize">
                                {activeTab.replace('-', ' ')}
                            </h2>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                                    <Icon name="bell" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    A
                                </div>
                                <span className="text-sm font-medium">Admin User</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'dashboard' && <DashboardTab stats={stats} queueData={queueData} queueTypeData={queueTypeData} />}
                            {activeTab === 'users' && <UsersTab />}
                            {activeTab === 'queues' && <QueuesTab />}
                            {activeTab === 'analytics' && <AnalyticsTab queueData={queueData} />}
                            {activeTab === 'settings' && <SettingsTab />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, queueData, queueTypeData }) => {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: 'users', color: 'blue' },
                    { label: 'Active Queues', value: stats.activeQueues, icon: 'queue', color: 'green' },
                    { label: 'Completed Today', value: stats.completedToday, icon: 'check', color: 'purple' },
                    { label: 'Avg Wait Time', value: stats.avgWaitTime, icon: 'time', color: 'orange' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                                <Icon name={stat.icon} className={`text-${stat.color}-500 text-xl`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Queue Activity Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Queue Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={queueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Queue Types Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Queue Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={queueTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {/* {queueTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))} */}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[
                        { action: 'New user registered', time: '2 min ago', type: 'user' },
                        { action: 'Queue completed at SBI Bank', time: '5 min ago', type: 'queue' },
                        { action: 'New queue created - Apollo Hospital', time: '10 min ago', type: 'queue' },
                        { action: 'User complaint resolved', time: '15 min ago', type: 'support' }
                    ].map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-3 ${
                                    activity.type === 'user' ? 'bg-blue-500' : 
                                    activity.type === 'queue' ? 'bg-green-500' : 'bg-purple-500'
                                }`}></div>
                                <span className="text-sm">{activity.action}</span>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Users Tab Component
const UsersTab = () => {
    const [users] = useState([
        { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 9876543210', joined: '2024-01-15', status: 'active' },
        { id: 2, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 9876543211', joined: '2024-01-14', status: 'active' },
        { id: 3, name: 'Amit Patel', email: 'amit@email.com', phone: '+91 9876543212', joined: '2024-01-13', status: 'inactive' },
        { id: 4, name: 'Sneha Reddy', email: 'sneha@email.com', phone: '+91 9876543213', joined: '2024-01-12', status: 'active' }
    ]);

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <Icon name="plus" className="mr-2" />
                        Add User
                    </motion.button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.phone}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.joined}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <Icon name="edit" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            <Icon name="delete" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Queues Tab Component
const QueuesTab = () => {
    const [queues] = useState([
        { id: 1, name: 'SBI Bank - Main Branch', current: 15, waiting: 8, avgTime: '10m', status: 'active' },
        { id: 2, name: 'Apollo Hospital - OPD', current: 23, waiting: 12, avgTime: '15m', status: 'active' },
        { id: 3, name: 'Passport Office', current: 0, waiting: 0, avgTime: '0m', status: 'paused' },
        { id: 4, name: 'DM Office - Certificate', current: 8, waiting: 15, avgTime: '20m', status: 'active' }
    ]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {queues.map((queue) => (
                    <motion.div
                        key={queue.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-gray-900">{queue.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                queue.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {queue.status}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Current Number:</span>
                                <span className="font-semibold">{queue.current}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Waiting:</span>
                                <span className="font-semibold">{queue.waiting} people</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Avg Time:</span>
                                <span className="font-semibold">{queue.avgTime}</span>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
                            >
                                Manage
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <Icon name="edit" />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Analytics Tab Component
const AnalyticsTab = ({ queueData }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={queueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Wait Time Analysis</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={queueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="waitTime" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// Settings Tab Component
const SettingsTab = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: false,
        autoRefresh: true,
        language: 'english'
    });

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">System Settings</h3>
            
            <div className="space-y-6">
                {[
                    { label: 'Push Notifications', key: 'notifications', description: 'Receive real-time notifications' },
                    { label: 'Email Alerts', key: 'emailAlerts', description: 'Get daily summary emails' },
                    { label: 'Auto Refresh', key: 'autoRefresh', description: 'Automatically refresh queue data' }
                ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div className="font-medium text-gray-900">{setting.label}</div>
                            <div className="text-sm text-gray-500">{setting.description}</div>
                        </div>
                        <button
                            onClick={() => setSettings(prev => ({
                                ...prev,
                                [setting.key]: !prev[setting.key]
                            }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                settings[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>
                ))}
                
                <div className="flex items-center justify-between py-3">
                    <div>
                        <div className="font-medium text-gray-900">Language</div>
                        <div className="text-sm text-gray-500">Interface language</div>
                    </div>
                    <select 
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="tamil">Tamil</option>
                    </select>
                </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Save Changes
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border border-gray-300 px-6 py-3 rounded-lg"
                >
                    Reset to Default
                </motion.button>
            </div>
        </div>
    );
};

export default AdminPannel;