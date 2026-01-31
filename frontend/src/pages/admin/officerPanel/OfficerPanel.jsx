// pages/admin/officerPanel/OfficerPanel.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const OfficerPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const stats = {
    todayQueue: 24,
    completedToday: 18,
    pendingQueue: 6,
    avgServiceTime: '7m',
    totalBookings: 156,
    cancellationRate: '3%'
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-lg text-white">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Officer</h1>
                <p className="text-sm text-gray-600">Queue Management</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Service Management
              </p>
            </div>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'queue', label: 'Live Queue', icon: '📋' },
              { id: 'bookings', label: 'Bookings', icon: '📅' },
              { id: 'documents', label: 'Documents', icon: '📄' },
              { id: 'profile', label: 'Profile', icon: '👤' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-green-50 text-green-600 border-r-4 border-green-600' 
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
                    <p className="text-sm font-medium text-gray-900">Officer Panel</p>
                    <p className="text-xs text-green-600">Service Access</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "Today's Queue", value: stats.todayQueue, color: 'blue' },
                        { label: 'Completed Today', value: stats.completedToday, color: 'green' },
                        { label: 'Pending Queue', value: stats.pendingQueue, color: 'yellow' },
                        { label: 'Avg Service Time', value: stats.avgServiceTime, color: 'orange' },
                        { label: 'Total Bookings', value: stats.totalBookings, color: 'purple' },
                        { label: 'Cancellation Rate', value: stats.cancellationRate, color: 'red' },
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
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="text-center py-8 text-gray-500">
                      Officer dashboard content will be implemented here
                    </div>
                  </div>
                </>
              )}
              
              {/* Other Tabs */}
              {activeTab !== 'dashboard' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold capitalize">
                      {activeTab.replace('-', ' ')}
                    </h3>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    {activeTab} content will be implemented here
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

export default OfficerPanel;