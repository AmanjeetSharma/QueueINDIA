import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  X,
  Loader,
  AlertCircle,
  ArrowLeft,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminsList = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const { user } = useAuth();
  const { 
    admins, 
    loading, 
    error, 
    getDepartmentStaff, 
    assignAdminToDepartment, 
    removeAdminFromDepartment,
    clearError 
  } = useAdmin();

  // Local state
  const [pageLoaded, setPageLoaded] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [filterRole, setFilterRole] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check if user has permission to manage admins
  const canManageAdmins = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    fetchAdmins();
  }, [departmentId]);

  const fetchAdmins = async () => {
    try {
      setPageLoaded(false);
      const deptId = departmentId || user?.departmentId;
      if (deptId) {
        await getDepartmentStaff(deptId);
      }
    } catch (err) {
      console.error('Failed to fetch department staff:', err);
      setLocalError(err.message);
    } finally {
      setPageLoaded(true);
    }
  };

  // Filter admins based on search and role
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmail) {
      toast.error('Please enter admin email');
      return;
    }

    try {
      setAssignLoading(true);
      const deptId = departmentId || user?.departmentId;
      await assignAdminToDepartment(deptId, adminEmail);
      
      // Reset and close modal
      setAdminEmail('');
      setShowAssignModal(false);
      
      // Refresh list
      await fetchAdmins();
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      const deptId = departmentId || user?.departmentId;
      await removeAdminFromDepartment(deptId, selectedAdmin._id);
      
      // Close modal and reset
      setShowRemoveConfirm(false);
      setSelectedAdmin(null);
      
      // Refresh list
      await fetchAdmins();
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const handleBack = () => {
    if (user?.role === 'SUPER_ADMIN') {
      navigate(`/super-admin-panel/departments/${departmentId}/manage-work`);
    } else {
      navigate(`/admin-panel`);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Loading state
  if (loading && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Loading admins...</p>
        </div>
      </div>
    );
  }

  // Error state
  if ((error || localError) && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Unable to load admins</h3>
          <p className="text-slate-300 mb-6">{error || localError || 'An error occurred'}</p>
          <button
            onClick={() => {
              clearError();
              setLocalError(null);
              fetchAdmins();
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/90 backdrop-blur-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Department Admins
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage administrators and their permissions
                </p>
              </div>
            </div>

            {canManageAdmins && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Assign Admin</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Admins</p>
                  <p className="text-2xl font-bold text-white">{admins.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {admins.filter(a => a.isActive !== false).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">With Priority Access</p>
                  <p className="text-2xl font-bold text-white">
                    {admins.filter(a => a.priorityAccess).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admins Grid/Table */}
          {filteredAdmins.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Admins Found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || filterRole !== 'all' 
                  ? 'No admins match your search criteria'
                  : 'No admins assigned to this department yet'}
              </p>
              {canManageAdmins && !searchTerm && filterRole === 'all' && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign First Admin
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Joined
                      </th>
                      {canManageAdmins && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {currentAdmins.map((admin) => (
                      <motion.tr
                        key={admin._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                              {getInitials(admin.name)}
                            </div>
                            <div>
                              <div className="font-medium text-white">{admin.name || 'Unnamed'}</div>
                              <div className="text-xs text-slate-400">{admin._id || 'No ID'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{admin.email}</div>
                          <div className="text-xs text-slate-400">{admin.phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            admin.role === 'SUPER_ADMIN' 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {admin.role || 'ADMIN'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              admin.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="text-sm text-slate-300">
                              {admin.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {admin.priorityAccess && (
                            <span className="text-xs text-amber-400">Priority Access</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        {canManageAdmins && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowRemoveConfirm(true);
                              }}
                              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                              title="Remove Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {currentAdmins.map((admin) => (
                  <motion.div
                    key={admin._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                          {getInitials(admin.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{admin.name || 'Unnamed'}</h3>
                          <p className="text-xs text-slate-400">{admin.employeeId || 'No ID'}</p>
                        </div>
                      </div>
                      {canManageAdmins && (
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowRemoveConfirm(true);
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{admin.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.role === 'SUPER_ADMIN' 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {admin.role || 'ADMIN'}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            admin.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-xs text-slate-400">
                            {admin.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {admin.priorityAccess && (
                          <span className="text-xs text-amber-400">Priority</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAdmins.length)} of {filteredAdmins.length} admins
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Assign Admin Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Assign Admin
                </h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignAdmin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    The user must have an ADMIN or SUPER_ADMIN role in the system
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={assignLoading}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {assignLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Assign Admin
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {showRemoveConfirm && selectedAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => {
              setShowRemoveConfirm(false);
              setSelectedAdmin(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Remove Admin</h2>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-slate-300 mb-6">
                Are you sure you want to remove <span className="font-bold text-white">{selectedAdmin.name || selectedAdmin.email}</span> from this department?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleRemoveAdmin}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    setShowRemoveConfirm(false);
                    setSelectedAdmin(null);
                  }}
                  className="flex-1 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminsList;