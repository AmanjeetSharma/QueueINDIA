import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Building, Crown } from 'lucide-react';

const ChangeRolePopup = ({ user, onConfirm, onCancel, loading }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'USER');

  const roles = [
    { 
      value: 'USER', 
      label: 'Regular User', 
      icon: <User size={16} />, 
      bg: 'bg-emerald-500/20', 
      color: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    { 
      value: 'DEPARTMENT_OFFICER', 
      label: 'Department Officer', 
      icon: <Building size={16} />, 
      bg: 'bg-blue-500/20', 
      color: 'text-blue-400',
      border: 'border-blue-500/30'
    },
    { 
      value: 'ADMIN', 
      label: 'Admin', 
      icon: <Shield size={16} />, 
      bg: 'bg-purple-500/20', 
      color: 'text-purple-400',
      border: 'border-purple-500/30'
    },
    { 
      value: 'SUPER_ADMIN', 
      label: 'Super Admin', 
      icon: <Crown size={16} />, 
      bg: 'bg-red-500/20', 
      color: 'text-red-400',
      border: 'border-red-500/30'
    },
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

  const getRoleBadge = (role) => {
    const map = {
      SUPER_ADMIN: 'bg-red-500/10 text-red-400 border border-red-500/20',
      ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      DEPARTMENT_OFFICER: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      USER: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    };
    return map[role] || 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 backdrop-blur-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Shield className="text-purple-400" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">Change User Role</h3>
          
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-4">
              Change role for <span className="font-semibold text-white">{user?.name}</span>
            </p>

            {/* Role Selection */}
            <div className="space-y-2 mb-4">
              {roles.map((role) => (
                <div
                  key={role.value}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? `border-${role.color.split('-')[1]}-500 bg-${role.color.split('-')[1]}-500/10`
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${role.bg} ${role.color}`}>
                      {role.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{role.label}</p>
                      <p className="text-xs text-slate-500">
                        {role.value === user?.role ? 'Current Role' : ''}
                      </p>
                    </div>
                    {selectedRole === role.value && (
                      <div className={`w-5 h-5 rounded-full ${role.bg} border ${role.border} flex items-center justify-center`}>
                        <span className={`text-xs ${role.color}`}>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Permissions Preview */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-left">
              <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                {roles.find(r => r.value === selectedRole)?.label} Permissions:
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {getRolePermissions(selectedRole).map((permission, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
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
              className="px-5 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedRole)}
              disabled={loading || selectedRole === user?.role}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
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