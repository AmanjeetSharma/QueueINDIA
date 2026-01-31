// UserManagementTab.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../Icon';
import { useAuth } from '../../../../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdRefresh, MdRedo, MdSort, MdArrowUpward, MdArrowDownward } from "react-icons/md";

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
    limit: 10
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

  // Fetch users with CLIENT-SIDE filtering
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get ALL users (no server-side filtering)
      const response = await authGetAllUsers();
      
      // Handle response structure
      let allUsers = [];
      if (response?.data?.users) {
        allUsers = response.data.users;
      } else if (response?.users) {
        allUsers = response.users;
      } else if (Array.isArray(response)) {
        allUsers = response;
      }
      
      // CLIENT-SIDE FILTERING
      let filteredUsers = [...allUsers];
      
      // Apply search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filteredUsers = filteredUsers.filter(user =>
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term)
        );
      }
      
      // Apply role filter
      if (filters.role !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      // Apply email verification filter
      if (filters.emailVerified !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => 
          filters.emailVerified === 'VERIFIED' ? user.isEmailVerified : !user.isEmailVerified
        );
      }
      
      // Apply phone verification filter
      if (filters.phoneVerified !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => 
          filters.phoneVerified === 'VERIFIED' ? user.isPhoneVerified : !user.isPhoneVerified
        );
      }
      
      // Apply sorting with proper date handling
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
            // Proper date comparison
            aValue = new Date(a.createdAt || 0).getTime();
            bValue = new Date(b.createdAt || 0).getTime();
        }
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      // Apply pagination
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage]);

  // Apply filters handler
  const handleApplyFilters = () => {
    // Reset to first page when applying filters
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers();
  };

  // Reset filters handler - Only resets state
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      role: 'ALL',
      emailVerified: 'ALL',
      phoneVerified: 'ALL',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    // Note: Don't fetch users here - user needs to click Apply Filters
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Change sort field
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

  // Open popup handlers
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

  // Action handlers using AuthContext
  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      // Use the new authDeleteUserByAdmin function
      await authDeleteUserByAdmin(selectedUser._id);
      closeAllPopups();
      fetchUsers();
    } catch (error) {
      // Error toast is already handled in AuthContext
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceLogout = async () => {
    try {
      setActionLoading(true);
      // Use AuthContext function
      await authForceLogout(selectedUser._id);
      closeAllPopups();
      fetchUsers();
    } catch (error) {
      // Error toast is already handled in AuthContext
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setActionLoading(true);
      // Use AuthContext function
      const response = await authResetPassword(selectedUser._id);
      setTemporaryPassword(response.data?.temporaryPassword || response.temporaryPassword);
      // Don't close popup - show password in modal
    } catch (error) {
      // Error toast is already handled in AuthContext
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (newRole) => {
    try {
      setActionLoading(true);
      // Use AuthContext function
      await authChangeRole(selectedUser._id, newRole);
      closeAllPopups();
      fetchUsers();
    } catch (error) {
      // Error toast is already handled in AuthContext
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
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'DEPARTMENT_OFFICER':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border border-green-200';
    }
  };

  // Get verification badge
  const getVerificationBadge = (isVerified, type) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${isVerified
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800'
        }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isVerified ? 'bg-green-500' : 'bg-gray-500'}`}></span>
        {type} {isVerified ? '✓' : '✗'}
      </span>
    );
  };

  if (loading && !actionLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600">Manage all system users with full control</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center text-sm cursor-pointer"
            onClick={() => fetchUsers()}
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{pagination.totalUsers}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <Icon name="users" className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Super Admins</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {users.filter(u => u.role === 'SUPER_ADMIN').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-50">
              <Icon name="superadmin" className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Admins</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <Icon name="admin" className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Department Officers</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {users.filter(u => u.role === 'DEPARTMENT_OFFICER').length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <Icon name="department" className="text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, email, or phone..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
              <Icon name="search" className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="DEPARTMENT_OFFICER">Officer</option>
              <option value="USER">User</option>
            </select>
          </div>

          {/* Email Verification Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={filters.emailVerified}
              onChange={(e) => setFilters(prev => ({ ...prev, emailVerified: e.target.value }))}
            >
              <option value="ALL">All</option>
              <option value="VERIFIED">Verified</option>
              <option value="UNVERIFIED">Unverified</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex gap-2">
              <select
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                value={filters.sortBy}
                onChange={(e) => changeSortField(e.target.value)}
              >
                <option value="createdAt">Join Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {filters.sortOrder === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
          >
            <MdRedo className="mr-1" />
            Reset Filters
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 cursor-pointer"
          >
            <Icon name="filter" size={16} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Verification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer" onClick={() => openViewUserPopup(user)}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {getVerificationBadge(user.isEmailVerified, 'Email')}
                          {getVerificationBadge(user.isPhoneVerified, 'Phone')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openViewUserPopup(user)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1 cursor-pointer"
                          title="View user details"
                        >
                          👁 View
                        </button>
                        <button
                          onClick={() => openChangeRolePopup(user)}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center gap- cursor-pointer"
                          title="Change user role"
                        >
                          🛡️ Role
                        </button>
                        <button
                          onClick={() => openResetPasswordPopup(user)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1 cursor-pointer"
                          title="Reset password"
                        >
                          🔑 Reset
                        </button>
                        <button
                          onClick={() => openLogoutPopup(user)}
                          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 flex items-center gap-1 cursor-pointer"
                          title="Force logout all sessions"
                        >
                          🚪 Force Logout All
                        </button>
                        <button
                          onClick={() => openDeletePopup(user)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1 cursor-pointer"
                          title="Delete user account"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <Icon name="users" className="text-4xl mx-auto mb-3" />
                      <p>No users found</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">Try different search terms or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)}
              </span> of{' '}
              <span className="font-medium">{pagination.totalUsers}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${pagination.currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                    className={`px-3 py-1 rounded-md text-sm ${pagination.currentPage === pageNum
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-3 py-1 rounded-md text-sm ${pagination.currentPage === pagination.totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        )}
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