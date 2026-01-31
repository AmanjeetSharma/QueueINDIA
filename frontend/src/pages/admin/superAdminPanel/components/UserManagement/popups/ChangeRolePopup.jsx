import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Building, Crown } from 'lucide-react';

const ChangeRolePopup = ({ user, onConfirm, onCancel, loading }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const roles = [
    { value: 'USER', label: 'Regular User', icon: <User size={16} />, color: 'text-green-600 bg-green-50' },
    { value: 'DEPARTMENT_OFFICER', label: 'Department Officer', icon: <Building size={16} />, color: 'text-blue-600 bg-blue-50' },
    { value: 'ADMIN', label: 'Admin', icon: <Shield size={16} />, color: 'text-purple-600 bg-purple-50' },
    { value: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown size={16} />, color: 'text-red-600 bg-red-50' },
  ];

  const getRolePermissions = (role) => {
    const permissions = {
      USER: ['Book services', 'View own bookings', 'Update profile'],
      DEPARTMENT_OFFICER: ['All User permissions', 'Manage service queues', 'View department analytics'],
      ADMIN: ['All Department Officer permissions', 'Manage department settings', 'Assign officers'],
      SUPER_ADMIN: ['Full system access', 'Manage all departments', 'Manage all users', 'System configuration'],
    };
    return permissions[role] || permissions.USER;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-purple-600" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Change User Role</h3>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Change role for <span className="font-semibold">{user?.name}</span>
            </p>

            {/* Role Selection */}
            <div className="space-y-2 mb-4">
              {roles.map((role) => (
                <div
                  key={role.value}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${role.color}`}>
                      {role.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{role.label}</p>
                      <p className="text-xs text-gray-500">
                        {role.value === user.role ? 'Current Role' : ''}
                      </p>
                    </div>
                    {selectedRole === role.value && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions Preview */}
            <div className="bg-gray-50 rounded-lg p-3 text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {roles.find(r => r.value === selectedRole)?.label} Permissions:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                {getRolePermissions(selectedRole).map((permission, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedRole)}
              disabled={loading || selectedRole === user.role}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                'Change Role'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangeRolePopup;