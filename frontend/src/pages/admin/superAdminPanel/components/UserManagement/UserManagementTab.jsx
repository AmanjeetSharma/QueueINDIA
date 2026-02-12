import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdRefresh,
  MdRedo,
  MdSearch,
  MdFilterList,
  MdArrowUpward,
  MdArrowDownward,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdShield,
  MdVerified,
  MdWarning,
  MdEdit,
  MdLockReset,
  MdLogout,
  MdDelete,
  MdCheckCircle,
  MdOutlineAdminPanelSettings,
  MdOutlineDashboard,
  MdClose
} from "react-icons/md";
import { FaUsers, FaUserShield, FaUserTie, FaUser } from "react-icons/fa";

// Import popup components
import DeletePopup from './popups/DeletePopup';
import LogoutPopup from './popups/LogoutPopup';
import ResetPasswordPopup from './popups/ResetPasswordPopup';
import ViewUserPopup from './popups/ViewUserPopup';
import ChangeRolePopup from './popups/ChangeRolePopup';

const UserManagementTab = () => {
  const {
    getAllUsers: authGetAllUsers,
    forceLogout: authForceLogout,
    resetUserPasswordAdmin: authResetPassword,
    changeUserRole: authChangeRole,
    deleteUserByAdmin: authDeleteUserByAdmin
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'ALL',
    emailVerified: 'ALL',
    phoneVerified: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20
  });

  // Popup states
  const [popupState, setPopupState] = useState({
    showDelete: false,
    showLogout: false,
    showResetPassword: false,
    showViewUser: false,
    showChangeRole: false
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await authGetAllUsers();

      let allUsers = [];
      if (response?.data?.users) {
        allUsers = response.data.users;
      } else if (response?.users) {
        allUsers = response.users;
      } else if (Array.isArray(response)) {
        allUsers = response;
      }

      // Client-side filtering
      let filteredUsers = [...allUsers];

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filteredUsers = filteredUsers.filter(user =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term)
        );
      }

      if (filters.role !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters.emailVerified !== 'ALL') {
        filteredUsers = filteredUsers.filter(user =>
          filters.emailVerified === 'VERIFIED' ? user.isEmailVerified : !user.isEmailVerified
        );
      }

      if (filters.phoneVerified !== 'ALL') {
        filteredUsers = filteredUsers.filter(user =>
          filters.phoneVerified === 'VERIFIED' ? user.isPhoneVerified : !user.isPhoneVerified
        );
      }

      // Sorting
      filteredUsers.sort((a, b) => {
        let aValue, bValue;

        switch (filters.sortBy) {
          case 'name':
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
            break;
          case 'email':
            aValue = a.email?.toLowerCase() || '';
            bValue = b.email?.toLowerCase() || '';
            break;
          case 'role':
            aValue = a.role || '';
            bValue = b.role || '';
            break;
          case 'createdAt':
          default:
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
        }

        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const startIndex = (pagination.currentPage - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      setUsers(paginatedUsers);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(filteredUsers.length / pagination.limit),
        totalUsers: filteredUsers.length
      }));

    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage]);

  // Filter handlers
  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      role: 'ALL',
      emailVerified: 'ALL',
      phoneVerified: 'ALL',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers();
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const changeSortField = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field
    }));
  };

  // Close all popups
  const closeAllPopups = () => {
    setPopupState({
      showDelete: false,
      showLogout: false,
      showResetPassword: false,
      showViewUser: false,
      showChangeRole: false
    });
    setSelectedUser(null);
    setTemporaryPassword('');
  };

  // Popup handlers
  const openDeletePopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showDelete: true }));
    setShowMobileMenu(null);
  };

  const openLogoutPopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showLogout: true }));
    setShowMobileMenu(null);
  };

  const openResetPasswordPopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showResetPassword: true }));
    setShowMobileMenu(null);
  };

  const openViewUserPopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showViewUser: true }));
    setShowMobileMenu(null);
  };

  const openChangeRolePopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showChangeRole: true }));
    setShowMobileMenu(null);
  };

  // Action handlers
  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      await authDeleteUserByAdmin(selectedUser._id);
      toast.success('User deleted successfully', { duration: 2000, position: 'top-center' });
      closeAllPopups();
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceLogout = async () => {
    try {
      setActionLoading(true);
      await authForceLogout(selectedUser._id);
      toast.success('User logged out successfully', { duration: 2000, position: 'top-center' });
      closeAllPopups();
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to logout user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setActionLoading(true);
      const response = await authResetPassword(selectedUser._id);
      setTemporaryPassword(response.data?.temporaryPassword || response.temporaryPassword);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (newRole) => {
    try {
      setActionLoading(true);
      await authChangeRole(selectedUser._id, newRole);
      toast.success(`Role updated to ${newRole.replace('_', ' ')}`, { duration: 2000, position: 'top-center' });
      closeAllPopups();
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to change role');
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'DEPARTMENT_OFFICER':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      default:
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <MdShield className="text-red-400" />;
      case 'ADMIN':
        return <FaUserShield className="text-purple-400" />;
      case 'DEPARTMENT_OFFICER':
        return <FaUserTie className="text-blue-400" />;
      default:
        return <FaUser className="text-green-400" />;
    }
  };

  // Get stats
  const getStats = () => {
    const total = pagination.totalUsers;
    const superAdmins = users.filter(u => u.role === 'SUPER_ADMIN').length;
    const admins = users.filter(u => u.role === 'ADMIN').length;
    const officers = users.filter(u => u.role === 'DEPARTMENT_OFFICER').length;
    const regularUsers = users.filter(u => u.role === 'USER').length;
    const verifiedUsers = users.filter(u => u.isEmailVerified && u.isPhoneVerified).length;

    return { total, superAdmins, admins, officers, regularUsers, verifiedUsers };
  };

  const stats = getStats();

  // Action buttons component
  const ActionButtons = ({ user }) => {
    return (
      <>
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => openViewUserPopup(user)}
            className="px-2.5 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            title="View user details"
          >
            <MdPerson className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            onClick={() => openChangeRolePopup(user)}
            className="px-2.5 py-1.5 text-xs bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-lg transition-colors flex items-center gap-1.5"
            title="Change user role"
          >
            <MdEdit className="w-3.5 h-3.5" />
            <span>Role</span>
          </button>

          <button
            onClick={() => openResetPasswordPopup(user)}
            className="px-2.5 py-1.5 text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors flex items-center gap-1.5"
            title="Reset user password"
          >
            <MdLockReset className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => openLogoutPopup(user)}
            className="px-2.5 py-1.5 text-xs bg-amber-900/30 hover:bg-amber-900/50 text-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            title="Force logout from all sessions"
          >
            <MdLogout className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={() => openDeletePopup(user)}
            className="px-2.5 py-1.5 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors flex items-center gap-1.5"
            title="Delete user permanently"
          >
            <MdDelete className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Mobile Actions - Menu Button */}
        <div className="relative md:hidden">
          <button
            onClick={() => setShowMobileMenu(showMobileMenu === user._id ? null : user._id)}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <MdOutlineAdminPanelSettings className="w-4 h-4 text-slate-300" />
          </button>

          <AnimatePresence>
            {showMobileMenu === user._id && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
              >
                <div className="p-1.5">
                  <button
                    onClick={() => openViewUserPopup(user)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <MdPerson className="w-3.5 h-3.5" />
                    View Details
                  </button>
                  <button
                    onClick={() => openChangeRolePopup(user)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <MdEdit className="w-3.5 h-3.5" />
                    Change Role
                  </button>
                  <button
                    onClick={() => openResetPasswordPopup(user)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <MdLockReset className="w-3.5 h-3.5" />
                    Reset Password
                  </button>
                  <button
                    onClick={() => openLogoutPopup(user)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <MdLogout className="w-3.5 h-3.5" />
                    Force Logout
                  </button>
                  <button
                    onClick={() => openDeletePopup(user)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <MdDelete className="w-3.5 h-3.5" />
                    Delete User
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  };

  if (loading && !actionLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
          <p className="text-lg font-medium text-slate-300">Loading users...</p>
          <p className="mt-2 text-sm text-slate-400">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-5"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-5"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl sticky top-0">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">Manage and monitor all system users</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="p-2 sm:px-3 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <MdRedo className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 sm:px-3 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <MdFilterList className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                onClick={fetchUsers}
                className="p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <MdRefresh className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      <div className="relative z-10 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Total</p>
                <p className="text-lg font-bold text-white mt-0.5">{stats.total}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <FaUsers className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Super</p>
                <p className="text-lg font-bold text-red-400 mt-0.5">{stats.superAdmins}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-red-500/20">
                <MdShield className="w-4 h-4 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Admin</p>
                <p className="text-lg font-bold text-purple-400 mt-0.5">{stats.admins}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-purple-500/20">
                <FaUserShield className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Officer</p>
                <p className="text-lg font-bold text-blue-400 mt-0.5">{stats.officers}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <FaUserTie className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">User</p>
                <p className="text-lg font-bold text-green-400 mt-0.5">{stats.regularUsers}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-green-500/20">
                <FaUser className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">Verified</p>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">{stats.verifiedUsers}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-500/20">
                <MdCheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-10 px-4 sm:px-6 py-2">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-400 rounded-lg focus:border-blue-500 outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <select
                className="text-sm bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none transition-colors"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="DEPARTMENT_OFFICER">Officer</option>
                <option value="USER">User</option>
              </select>

              <button
                onClick={toggleSortOrder}
                className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors"
                title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {filters.sortOrder === 'asc' ?
                  <MdArrowUpward className="w-4 h-4 text-slate-300" /> :
                  <MdArrowDownward className="w-4 h-4 text-slate-300" />
                }
              </button>

              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-700">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Email Verification
                    </label>
                    <select
                      className="w-full text-sm bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none transition-colors"
                      value={filters.emailVerified}
                      onChange={(e) => setFilters(prev => ({ ...prev, emailVerified: e.target.value }))}
                    >
                      <option value="ALL">All Email Status</option>
                      <option value="VERIFIED">Verified Only</option>
                      <option value="UNVERIFIED">Unverified Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Phone Verification
                    </label>
                    <select
                      className="w-full text-sm bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none transition-colors"
                      value={filters.phoneVerified}
                      onChange={(e) => setFilters(prev => ({ ...prev, phoneVerified: e.target.value }))}
                    >
                      <option value="ALL">All Phone Status</option>
                      <option value="VERIFIED">Verified Only</option>
                      <option value="UNVERIFIED">Unverified Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Sort By
                    </label>
                    <select
                      className="w-full text-sm bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none transition-colors"
                      value={filters.sortBy}
                      onChange={(e) => changeSortField(e.target.value)}
                    >
                      <option value="createdAt">Join Date</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="role">Role</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Users List */}
      <div className="relative z-10 px-4 sm:px-6 py-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          {/* List Header */}
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">All Users</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} users
                </p>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="divide-y divide-slate-700">
            {users.length > 0 ? (
              users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* User Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {user.name}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)} w-fit`}>
                            {getRoleIcon(user.role)}
                            <span>{user.role.replace('_', ' ')}</span>
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <MdEmail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                            {user.isEmailVerified ? (
                              <MdVerified className="w-3.5 h-3.5 text-green-500 flex-shrink-0" title="Email Verified" />
                            ) : (
                              <MdWarning className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" title="Email Not Verified" />
                            )}
                          </div>

                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-300">
                              <MdPhone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span>{user.phone}</span>
                              {user.isPhoneVerified ? (
                                <MdVerified className="w-3.5 h-3.5 text-green-500 flex-shrink-0" title="Phone Verified" />
                              ) : (
                                <MdWarning className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" title="Phone Not Verified" />
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MdCalendarToday className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Joined {formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <ActionButtons user={user} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-3">
                  <FaUsers className="w-6 h-6 text-slate-500" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">No Users Found</h3>
                <p className="text-xs text-slate-400 mb-4">
                  {searchTerm ? 'Try different search terms or filters' : 'No users in the system yet'}
                </p>
                {searchTerm && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination - Compact */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/80">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Page <span className="font-medium text-white">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium text-white">{pagination.totalPages}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium ${pagination.currentPage === 1
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                          className={`w-7 h-7 rounded text-xs font-medium ${pagination.currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                              : 'text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium ${pagination.currentPage === pagination.totalPages
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
        {popupState.showDelete && (
          <DeletePopup
            user={selectedUser}
            onConfirm={handleDeleteUser}
            onCancel={closeAllPopups}
            loading={actionLoading}
          />
        )}

        {popupState.showLogout && (
          <LogoutPopup
            user={selectedUser}
            onConfirm={handleForceLogout}
            onCancel={closeAllPopups}
            loading={actionLoading}
          />
        )}

        {popupState.showResetPassword && (
          <ResetPasswordPopup
            user={selectedUser}
            onConfirm={handleResetPassword}
            onCancel={closeAllPopups}
            loading={actionLoading}
            temporaryPassword={temporaryPassword}
          />
        )}

        {popupState.showViewUser && (
          <ViewUserPopup
            user={selectedUser}
            onClose={closeAllPopups}
          />
        )}

        {popupState.showChangeRole && (
          <ChangeRolePopup
            user={selectedUser}
            onConfirm={handleChangeRole}
            onCancel={closeAllPopups}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementTab;