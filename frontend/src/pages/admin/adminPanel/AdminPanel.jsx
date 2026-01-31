// pages/admin/adminPanel/AdminPanel.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const stats = {
    totalUsers: 189,
    activeQueues: 5,
    completedToday: 42,
    pendingDocuments: 12,
    departmentUsers: 45,
    avgWaitTime: '8m'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex h-full pt-16">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className="fixed lg:relative bg-white shadow-xl z-30 w-64 h-full overflow-y-auto border-r border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <span className="text-lg text-white">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin</h1>
                <p className="text-sm text-gray-600">Department Management</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Department Management
              </p>
            </div>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'departments', label: 'Departments', icon: '🏢' },
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
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </nav>
        </motion.div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm z-20 border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 mr-4 lg:hidden"
                >
                  ☰
                </button>
                <h2 className="text-xl font-semibold text-gray-800 capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                    <p className="text-xs text-blue-600">Department Access</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Dashboard Stats */}
              {activeTab === 'dashboard' && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: 'Total Users', value: stats.totalUsers, color: 'blue' },
                        { label: 'Active Queues', value: stats.activeQueues, color: 'green' },
                        { label: 'Completed Today', value: stats.completedToday, color: 'teal' },
                        { label: 'Pending Documents', value: stats.pendingDocuments, color: 'yellow' },
                        { label: 'Department Users', value: stats.departmentUsers, color: 'purple' },
                        { label: 'Avg Wait Time', value: stats.avgWaitTime, color: 'orange' },
                      ].map((stat, index) => (
                        <div
                          key={stat.label}
                          className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Dashboard Content */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Department Activity</h3>
                    <div className="text-center py-8 text-gray-500">
                      Dashboard content will be implemented here
                    </div>
                  </div>
                </>
              )}
              
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm">
                      + Add User
                    </button>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    User management content will be implemented here
                  </div>
                </div>
              )}
              
              {/* Departments Tab */}
              {activeTab === 'departments' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Department Management</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm">
                      + Add Department
                    </button>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    Department management content will be implemented here
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;