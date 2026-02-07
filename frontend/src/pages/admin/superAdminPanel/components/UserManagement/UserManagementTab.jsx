import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  MdCheckCircle
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
        
        switch(filters.sortBy) {
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
  };

  const openLogoutPopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showLogout: true }));
  };

  const openResetPasswordPopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showResetPassword: true }));
  };

  const openViewUserPopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showViewUser: true }));
  };

  const openChangeRolePopup = (user) => {
    setSelectedUser(user);
    setPopupState(prev => ({ ...prev, showChangeRole: true }));
  };

  // Action handlers
  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      await authDeleteUserByAdmin(selectedUser._id);
      closeAllPopups();
      fetchUsers();
      toast.success('User deleted successfully');
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
      closeAllPopups();
      fetchUsers();
      toast.success('User logged out from all sessions');
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
      toast.success('Password reset successful');
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
      closeAllPopups();
      fetchUsers();
      toast.success('User role updated successfully');
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
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'DEPARTMENT_OFFICER':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-green-50 text-green-700 border border-green-200';
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <MdShield className="text-red-500" />;
      case 'ADMIN':
        return <FaUserShield className="text-purple-500" />;
      case 'DEPARTMENT_OFFICER':
        return <FaUserTie className="text-blue-500" />;
      default:
        return <FaUser className="text-green-500" />;
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
      <div className="flex gap-1.5">
        {/* Desktop Actions with Text */}
        <div className="hidden md:flex flex-wrap gap-1.5">
          <button
            onClick={() => openViewUserPopup(user)}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View user details"
          >
            <MdPerson className="text-sm" />
            View
          </button>
          
          <button
            onClick={() => openChangeRolePopup(user)}
            className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Change user role"
          >
            <MdEdit className="text-sm" />
            Role
          </button>
          
          <button
            onClick={() => openResetPasswordPopup(user)}
            className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset user password"
          >
            <MdLockReset className="text-sm" />
            Reset
          </button>
          
          <button
            onClick={() => openLogoutPopup(user)}
            className="px-3 py-1.5 text-xs bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Force logout from all sessions"
          >
            <MdLogout className="text-sm" />
            Logout All
          </button>
          
          <button
            onClick={() => openDeletePopup(user)}
            className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Delete user permanently"
          >
            <MdDelete className="text-sm" />
            Delete
          </button>
        </div>
        
        {/* Mobile Actions - Icons Only */}
        <div className="flex md:hidden gap-1">
          <button
            onClick={() => openViewUserPopup(user)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="View details"
          >
            <MdPerson className="text-base" />
          </button>
          <button
            onClick={() => openChangeRolePopup(user)}
            className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
            title="Change role"
          >
            <MdEdit className="text-base" />
          </button>
          <button
            onClick={() => openResetPasswordPopup(user)}
            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            title="Reset password"
          >
            <MdLockReset className="text-base" />
          </button>
          <button
            onClick={() => openLogoutPopup(user)}
            className="p-1.5 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer"
            title="Force logout"
          >
            <MdLogout className="text-base" />
          </button>
          <button
            onClick={() => openDeletePopup(user)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
            title="Delete user"
          >
            <MdDelete className="text-base" />
          </button>
        </div>
      </div>
    );
  };

  if (loading && !actionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading user database...</p>
          <p className="mt-2 text-gray-500">Please wait while we fetch all users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-600">Manage and monitor all system users</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <MdRedo className="text-base" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <MdFilterList className="text-base" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <button
                onClick={fetchUsers}
                className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <MdRefresh className="text-base" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <FaUsers className="text-lg text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Super Admins</p>
                <p className="text-xl font-bold text-red-600 mt-1">{stats.superAdmins}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <MdShield className="text-lg text-red-500" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Admins</p>
                <p className="text-xl font-bold text-purple-600 mt-1">{stats.admins}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50">
                <FaUserShield className="text-lg text-purple-500" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Officers</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{stats.officers}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <FaUserTie className="text-lg text-blue-500" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Regular Users</p>
                <p className="text-xl font-bold text-green-600 mt-1">{stats.regularUsers}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <FaUser className="text-lg text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Verified Users</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{stats.verifiedUsers}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50">
                <MdCheckCircle className="text-lg text-emerald-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Compact Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <select
                className="text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {filters.sortOrder === 'asc' ? 
                  <MdArrowUpward className="text-base" /> : 
                  <MdArrowDownward className="text-base" />
                }
              </button>

              <button
                onClick={handleApplyFilters}
                className="px-4 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden mt-3 pt-3 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Verification
                  </label>
                  <select
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={filters.emailVerified}
                    onChange={(e) => setFilters(prev => ({ ...prev, emailVerified: e.target.value }))}
                  >
                    <option value="ALL">All Email Status</option>
                    <option value="VERIFIED">Verified Only</option>
                    <option value="UNVERIFIED">Unverified Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Verification
                  </label>
                  <select
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={filters.phoneVerified}
                    onChange={(e) => setFilters(prev => ({ ...prev, phoneVerified: e.target.value }))}
                  >
                    <option value="ALL">All Phone Status</option>
                    <option value="VERIFIED">Verified Only</option>
                    <option value="UNVERIFIED">Unverified Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
        </div>
      </div>

      {/* Users List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* List Header */}
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">All Users</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Showing {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} users
                </p>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-3 flex-1">
                      {/* Avatar */}
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => openViewUserPopup(user)}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-100 to-red-50 border-2 border-white shadow-sm">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-red-500 text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
                          <h4 className="text-base font-semibold text-gray-900 truncate">
                            {user.name}
                          </h4>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MdEmail className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                            {user.isEmailVerified ? (
                              <MdVerified className="text-green-500 flex-shrink-0" title="Email Verified" />
                            ) : (
                              <MdWarning className="text-yellow-500 flex-shrink-0" title="Email Not Verified" />
                            )}
                          </div>
                          
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MdPhone className="text-gray-400 flex-shrink-0" />
                              <span>{user.phone}</span>
                              {user.isPhoneVerified ? (
                                <MdVerified className="text-green-500 flex-shrink-0" title="Phone Verified" />
                              ) : (
                                <MdWarning className="text-yellow-500 flex-shrink-0" title="Phone Not Verified" />
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MdCalendarToday className="text-gray-400 flex-shrink-0" />
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
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaUsers className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Users Found</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {searchTerm ? 'Try different search terms or filters' : 'No users in the system yet'}
                </p>
                {searchTerm && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-gray-600">
                  Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    className={`px-3 py-1.5 rounded text-xs font-medium ${pagination.currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
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
                          className={`w-8 h-8 rounded text-xs font-medium ${pagination.currentPage === pageNum
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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
                    className={`px-3 py-1.5 rounded text-xs font-medium ${pagination.currentPage === pagination.totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
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
    </div>
  );
};

export default UserManagementTab;