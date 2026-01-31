import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, Shield, Globe, User, Building } from 'lucide-react';

const ViewUserPopup = ({ user, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'SUPER_ADMIN': { color: 'bg-red-100 text-red-800', icon: '👑' },
      'ADMIN': { color: 'bg-purple-100 text-purple-800', icon: '🛡️' },
      'DEPARTMENT_OFFICER': { color: 'bg-blue-100 text-blue-800', icon: '👨‍💼' },
      'USER': { color: 'bg-green-100 text-green-800', icon: '👤' }
    };
    
    const config = roleConfig[role] || roleConfig.USER;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <span className="mr-2">{config.icon}</span>
        {role.replace('_', ' ')}
      </span>
    );
  };

  const getVerificationBadge = (isVerified, type) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
      isVerified 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      <span className={`w-2 h-2 rounded-full mr-1 ${isVerified ? 'bg-green-500' : 'bg-gray-500'}`}></span>
      {type}: {isVerified ? 'Verified' : 'Not Verified'}
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
              <p className="text-sm text-gray-600">Complete user information and statistics</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-red-500 to-pink-600 text-white text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {getRoleBadge(user.role)}
                  {getVerificationBadge(user.isEmailVerified, 'Email')}
                  {getVerificationBadge(user.isPhoneVerified, 'Phone')}
                </div>
                <p className="text-gray-600">User ID: <code className="text-sm bg-gray-100 px-2 py-1 rounded">{user._id}</code></p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                {user.departmentId && (
                  <div className="flex items-center gap-3">
                    <Building className="text-gray-400" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">ID: {user.departmentId}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{user.sessions?.length || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Account Age</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Last Login</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.lastLogin ? 'Recently' : 'Never'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Security Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {(user.isEmailVerified ? 40 : 0) + (user.isPhoneVerified ? 40 : 0) + 20}/100
              </p>
            </div>
          </div>

          {/* Recent Activity (Optional - you can add this later) */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">User Permissions</h4>
            <div className="space-y-2">
              {user.role === 'SUPER_ADMIN' && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Full System Access</span>
                  <Shield className="text-red-600" size={18} />
                </div>
              )}
              {user.role === 'ADMIN' && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Department Management Access</span>
                  <Globe className="text-purple-600" size={18} />
                </div>
              )}
              {user.role === 'DEPARTMENT_OFFICER' && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Service Queue Management</span>
                  <User className="text-blue-600" size={18} />
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">Basic User Operations</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewUserPopup;