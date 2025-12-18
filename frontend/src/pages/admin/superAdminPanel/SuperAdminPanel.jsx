import { useState } from 'react';
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
        location: "📍",
        department: "🏢",
        service: "🎯",
        officer: "👨‍💼",
        document: "📄",
        superadmin: "👑",
        admin: "🛡️"
    };
    
    return <span className={className}>{icons[name]}</span>;
};

// Main Admin Panel Component
const SuperAdminPanel = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 1247,
        activeQueues: 23,
        completedToday: 156,
        avgWaitTime: '12m',
        totalDepartments: 15,
        totalServices: 89,
        pendingDocuments: 42,
        activeOfficers: 28
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
        { name: 'Bank', value: 35, color: '#0088FE' },
        { name: 'Hospital', value: 25, color: '#00C49F' },
        { name: 'Government', value: 20, color: '#FFBB28' },
        { name: 'Retail', value: 15, color: '#FF8042' },
        { name: 'Other', value: 5, color: '#8884d8' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content without Navbar (since it's in AppRoutes) */}
            <div className="flex h-full">
                {/* Sidebar */}
                <motion.div 
                    initial={{ x: -300 }}
                    animate={{ x: sidebarOpen ? 0 : -300 }}
                    transition={{ duration: 0.3 }}
                    className="fixed lg:relative bg-white shadow-xl z-30 w-64 h-full overflow-y-auto"
                >
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                                <Icon name="superadmin" className="text-lg text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
                                <p className="text-sm text-gray-600">Full System Control</p>
                            </div>
                        </div>
                    </div>
                    
                    <nav className="mt-6">
                        <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
                        </div>
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
                            { id: 'users', label: 'User Management', icon: 'users' },
                            { id: 'departments', label: 'Departments', icon: 'department' },
                            { id: 'services', label: 'Services', icon: 'service' },
                            { id: 'officers', label: 'Officers', icon: 'officer' },
                            { id: 'documents', label: 'Documents', icon: 'document' },
                        ].map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                                    activeTab === item.id 
                                        ? 'bg-red-50 text-red-600 border-r-4 border-red-600' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Icon name={item.icon} className="mr-3 text-lg" />
                                {item.label}
                            </motion.button>
                        ))}
                    </nav>
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
                                    {activeTab.replace('-', ' ')} Dashboard
                                </h2>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">Super Admin Panel</p>
                                        <p className="text-xs text-green-600">Full Access</p>
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                                {activeTab === 'departments' && <DepartmentsTab />}
                                {activeTab === 'services' && <ServicesTab />}
                                {activeTab === 'officers' && <OfficersTab />}
                                {activeTab === 'documents' && <DocumentsTab />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
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
                    { label: 'Pending Documents', value: stats.pendingDocuments, icon: 'document', color: 'yellow' },
                    { label: 'Avg Wait Time', value: stats.avgWaitTime, icon: 'time', color: 'orange' },
                    { label: 'Departments', value: stats.totalDepartments, icon: 'department', color: 'purple' },
                    { label: 'Services', value: stats.totalServices, icon: 'service', color: 'indigo' },
                    { label: 'Active Officers', value: stats.activeOfficers, icon: 'officer', color: 'red' },
                    { label: 'Completed Today', value: stats.completedToday, icon: 'check', color: 'teal' }
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
                {/* Activity Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">System Activity Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={queueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="users" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                            <Area type="monotone" dataKey="waitTime" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Distribution Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
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
                                {queueTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[
                        { action: 'New department created - "Police Station"', time: '2 min ago', type: 'department' },
                        { action: 'System backup completed successfully', time: '5 min ago', type: 'system' },
                        { action: 'Admin user permissions updated', time: '10 min ago', type: 'admin' },
                        { action: 'New officer assigned to department', time: '20 min ago', type: 'officer' },
                        { action: 'Service pricing updated for Bank Services', time: '30 min ago', type: 'service' }
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
                                    activity.type === 'department' ? 'bg-purple-500' : 
                                    activity.type === 'system' ? 'bg-blue-500' : 
                                    activity.type === 'admin' ? 'bg-red-500' : 
                                    activity.type === 'officer' ? 'bg-green-500' : 'bg-indigo-500'
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
        { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', role: 'USER', status: 'active' },
        { id: 2, name: 'Priya Sharma', email: 'priya@email.com', role: 'USER', status: 'active' },
        { id: 3, name: 'Amit Patel', email: 'amit@email.com', role: 'ADMIN', status: 'active' },
        { id: 4, name: 'Sneha Reddy', email: 'sneha@email.com', role: 'DEPARTMENT_OFFICER', status: 'inactive' },
        { id: 5, name: 'Ravi Verma', email: 'ravi@email.com', role: 'USER', status: 'active' }
    ]);

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Icon name="plus" className="mr-2" />
                            Add User
                        </motion.button>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
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
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'DEPARTMENT_OFFICER' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
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
                                        <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">
                                            <Icon name="edit" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">
                                            <Icon name="delete" />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50">
                                            <Icon name="check" />
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

// Departments Tab Component
const DepartmentsTab = () => {
    const [departments] = useState([
        { id: 1, name: 'SBI Bank', location: 'Main Branch', officers: 3, services: 8, status: 'active' },
        { id: 2, name: 'Apollo Hospital', location: 'OPD Wing', officers: 5, services: 12, status: 'active' },
        { id: 3, name: 'Passport Office', location: 'City Center', officers: 2, services: 5, status: 'inactive' },
        { id: 4, name: 'DM Office', location: 'Collectorate', officers: 4, services: 6, status: 'active' }
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Department Management</h3>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Icon name="plus" className="mr-2" />
                    Add Department
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <motion.div
                        key={dept.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{dept.name}</h3>
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                    <Icon name="location" className="mr-1" />
                                    {dept.location}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                dept.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {dept.status}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Officers:</span>
                                <span className="font-semibold">{dept.officers}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Services:</span>
                                <span className="font-semibold">{dept.services}</span>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
                            >
                                Manage
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
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

// Services Tab Component
const ServicesTab = () => {
    const [services] = useState([
        { id: 1, name: 'Account Opening', department: 'SBI Bank', duration: '30m', price: 'Free' },
        { id: 2, name: 'OPD Consultation', department: 'Apollo Hospital', duration: '15m', price: '₹500' },
        { id: 3, name: 'Passport Renewal', department: 'Passport Office', duration: '45m', price: '₹2000' },
        { id: 4, name: 'Income Certificate', department: 'DM Office', duration: '20m', price: '₹100' }
    ]);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Service Management</h3>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Icon name="plus" className="mr-2" />
                    Add Service
                </motion.button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{service.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {service.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{service.duration}</td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">{service.price}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">
                                            <Icon name="edit" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">
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

// Officers Tab Component
const OfficersTab = () => {
    const [officers] = useState([
        { id: 1, name: 'Rajesh Kumar', department: 'SBI Bank', email: 'rajesh@sbi.com', status: 'active' },
        { id: 2, name: 'Priya Sharma', department: 'Apollo Hospital', email: 'priya@apollo.com', status: 'active' },
        { id: 3, name: 'Amit Patel', department: 'Passport Office', email: 'amit@passport.com', status: 'inactive' },
        { id: 4, name: 'Sneha Reddy', department: 'DM Office', email: 'sneha@dmoffice.com', status: 'active' }
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Officer Management</h3>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                    <Icon name="plus" className="mr-2" />
                    Add Officer
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officers.map((officer) => (
                    <motion.div
                        key={officer.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon name="officer" className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{officer.name}</h3>
                                <p className="text-sm text-gray-600">{officer.department}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="text-gray-600">Email: </span>
                                <span className="text-gray-900">{officer.email}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                officer.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {officer.status}
                            </span>
                            <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">
                                    <Icon name="edit" />
                                </button>
                                <button className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">
                                    <Icon name="delete" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Documents Tab Component
const DocumentsTab = () => {
    const [documents] = useState([
        { id: 1, user: 'Rajesh Kumar', type: 'Aadhar Card', status: 'pending', submitted: '2024-01-15' },
        { id: 2, user: 'Priya Sharma', type: 'PAN Card', status: 'approved', submitted: '2024-01-14' },
        { id: 3, user: 'Amit Patel', type: 'Passport', status: 'rejected', submitted: '2024-01-13' },
        { id: 4, user: 'Sneha Reddy', type: 'Driving License', status: 'pending', submitted: '2024-01-12' }
    ]);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Document Management</h3>
                <div className="flex gap-2">
                    <select className="border border-gray-300 rounded-lg px-4 py-2">
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                        Export
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{doc.user}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{doc.submitted}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50">
                                            View
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50">
                                            Approve
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50">
                                            Reject
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

export default SuperAdminPanel;