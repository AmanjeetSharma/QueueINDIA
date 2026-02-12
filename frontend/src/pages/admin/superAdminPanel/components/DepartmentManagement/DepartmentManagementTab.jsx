import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartment } from '../../../../../context/DepartmentContext';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiList,
  FiArrowLeft
} from 'react-icons/fi';
import {
  FaBuilding,
  FaRegBuilding,
  FaListAlt,
  FaUserTie
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DepartmentManagementTab = () => {
  const navigate = useNavigate();
  const {
    departments,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    limit,
    getDepartments,
    deleteDepartment,
    clearError,
    setCurrentPage: setCurrentPageContext
  } = useDepartment();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Initial fetch
  useEffect(() => {
    fetchDepartments();
  }, [currentPage, sortConfig]);

  const fetchDepartments = async () => {
    try {
      await getDepartments({
        page: currentPage,
        limit: 6,
        search: searchTerm,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder
      });
    } catch (err) {
      // Error handled in context
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const applySearch = () => {
    setCurrentPageContext(1);
    fetchDepartments();
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (deptId) => {
    if (deleteConfirmationText !== 'DELETE') {
      toast.error('Please type "DELETE" in all caps to confirm');
      return;
    }

    try {
      await deleteDepartment(deptId);
      setDeleteConfirm(null);
      setDeleteConfirmationText('');
      fetchDepartments();
    } catch (err) {
      toast.error(err.message || 'Failed to delete department');
    }
  };

  const handleEditDepartment = (deptId) => {
    navigate(`/super-admin-panel/departments/${deptId}/edit`);
  };

  const handleManageDepartment = (deptId) => {
    navigate(`/super-admin-panel/departments/${deptId}/manage`);
  };

  const handleManageAdmins = (deptId) => {
    navigate(`/super-admin-panel/departments/${deptId}/admins`);
  };

  const handleCreateDepartment = () => {
    navigate('/super-admin-panel/departments/create');
  };

  const openPublicDepartmentPage = (deptId) => {
    window.open(`/departments/${deptId}`, '_blank');
  };

  const getStatusBadge = (status) => {
    const config = {
      'active': { color: 'bg-green-500/20 text-green-300 border border-green-500/30', icon: <FiCheckCircle className="w-3 h-3" /> },
      'inactive': { color: 'bg-gray-500/20 text-gray-300 border border-gray-500/30', icon: <FiXCircle className="w-3 h-3" /> },
      'maintenance': { color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', icon: null }
    };

    const { color, icon } = config[status] || { color: 'bg-gray-500/20 text-gray-300 border border-gray-500/30', icon: null };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    if (!category) return <FaRegBuilding className="w-4 h-4 text-slate-400" />;

    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('health')) return <FaBuilding className="w-4 h-4 text-red-400" />;
    if (categoryLower.includes('education')) return <FaBuilding className="w-4 h-4 text-blue-400" />;
    if (categoryLower.includes('transport')) return <FaBuilding className="w-4 h-4 text-green-400" />;
    if (categoryLower.includes('municipal')) return <FaBuilding className="w-4 h-4 text-purple-400" />;
    return <FaRegBuilding className="w-4 h-4 text-slate-400" />;
  };

  const renderStats = () => {
    const stats = {
      totalDepartments: total,
      activeDepartments: departments.filter(d => d.status === 'active').length,
      totalServices: departments.reduce((sum, dept) => sum + (dept.stats?.totalServices || 0), 0),
      totalAdmins: departments.reduce((sum, dept) => sum + (dept.stats?.totalAdmins || 0), 0)
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">Total</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">{stats.totalDepartments}</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
              <FaBuilding className="text-sm sm:text-base text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">Active</p>
              <p className="text-base sm:text-lg font-bold text-green-400 mt-0.5">{stats.activeDepartments}</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/20">
              <FiCheckCircle className="text-sm sm:text-base text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">Services</p>
              <p className="text-base sm:text-lg font-bold text-purple-400 mt-0.5">{stats.totalServices}</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
              <FaListAlt className="text-sm sm:text-base text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 sm:p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-medium text-slate-400">Admins</p>
              <p className="text-base sm:text-lg font-bold text-orange-400 mt-0.5">{stats.totalAdmins}</p>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
              <FiUsers className="text-sm sm:text-base text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-24"></div>
                <div className="h-2 bg-slate-700/50 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-700 rounded w-12"></div>
              <div className="h-2 bg-slate-700/50 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-3 sm:p-4 md:p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-5"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-5"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-4">
        <button
          onClick={() => navigate('/super-admin-panel')}
          className="inline-flex bg-slate-700 px-4 py-1 rounded-sm items-center text-sm text-slate-400 hover:text-white mb-4 transition-colors group cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Department Management
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage all government departments</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateDepartment}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors cursor-pointer"
            >
              <FiPlus className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">New Department</span>
              <span className="sm:hidden">New Department</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4 mb-4 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-400 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyPress={(e) => e.key === 'Enter' && applySearch()}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2.5 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <FiFilter className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                onClick={applySearch}
                className="inline-flex items-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors cursor-pointer"
              >
                <FiSearch className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              <button
                onClick={fetchDepartments}
                disabled={loading}
                className="inline-flex items-center p-2.5 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors"
                title="Refresh"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Additional Filters - Collapsible */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSort('name')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Sort by Name
                      {sortConfig.sortBy === 'name' && (
                        sortConfig.sortOrder === 'asc' ?
                          <FiChevronUp className="ml-1 w-3 h-3" /> :
                          <FiChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSort('status')}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Sort by Status
                      {sortConfig.sortBy === 'status' && (
                        sortConfig.sortOrder === 'asc' ?
                          <FiChevronUp className="ml-1 w-3 h-3" /> :
                          <FiChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10">
        {renderStats()}
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-start">
              <FiXCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={clearError}
                  className="mt-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Departments List */}
      <div className="relative z-10 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
        {/* List Header */}
        <div className="px-3 sm:px-4 py-3 border-b border-slate-700 bg-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">All Departments</h3>
              <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                {total} total
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && renderSkeleton()}

        {/* Empty State */}
        {!loading && departments.length === 0 && (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-3">
              <FaBuilding className="text-xl text-slate-500" />
            </div>
            <h3 className="text-base font-medium text-white mb-1">No Departments Found</h3>
            <p className="text-sm text-slate-400 mb-4">
              {searchTerm ? 'Try a different search term' : 'No departments available yet'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  applySearch();
                }}
                className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 font-medium transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={handleCreateDepartment}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors"
              >
                <FiPlus className="inline w-4 h-4 mr-1.5" />
                Create First Department
              </button>
            )}
          </div>
        )}

        {/* Departments List */}
        {!loading && departments.length > 0 && (
          <div className="divide-y divide-slate-700">
            {departments.map((dept) => (
              <motion.div
                key={dept._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3 sm:p-4 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex flex-col gap-3">
                  {/* Department Info */}
                  <div className="flex items-start gap-3">
                    {/* Icon - Clickable for Public View */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors"
                        onClick={() => openPublicDepartmentPage(dept._id)}
                        title="View Public Page"
                      >
                        {getCategoryIcon(dept.category)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className="text-sm sm:text-base font-semibold text-white truncate max-w-[150px] sm:max-w-none cursor-pointer hover:text-blue-400 transition-colors"
                            onClick={() => openPublicDepartmentPage(dept._id)}
                            title="View Public Page"
                          >
                            {dept.name}
                          </h4>
                          {getStatusBadge(dept.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FaListAlt className="w-3 h-3" />
                            {dept.stats?.totalServices || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            {dept.stats?.totalAdmins || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {/* Category & Location */}
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <FaRegBuilding className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{dept.category || 'General'}</span>
                          </span>
                          <span className="text-slate-600 hidden xs:inline">•</span>
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <FiMapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{dept.location?.city}, {dept.location?.state}</span>
                          </span>
                        </div>

                        {/* Contact - Hide on very small screens */}
                        {(dept.contact?.phone || dept.contact?.email) && (
                          <div className="hidden xs:flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300">
                            {dept.contact?.phone && (
                              <span className="inline-flex items-center gap-1">
                                <FiPhone className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{dept.contact.phone}</span>
                              </span>
                            )}
                            {dept.contact?.email && (
                              <span className="inline-flex items-center gap-1 truncate">
                                <FiMail className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{dept.contact.email}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Compact for Mobile, Full for Desktop */}
                  <div className="flex items-center justify-end gap-1.5 ml-13 pl-13">
                    {/* All buttons visible on all devices - compact on mobile */}
                    <button
                      onClick={() => handleManageDepartment(dept._id)}
                      className="inline-flex items-center justify-center px-2 py-1.5 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors"
                      title="Manage Services"
                    >
                      <FiList className="w-3 h-3 md:mr-1.5" />
                      <span className="hidden md:inline">Manage</span>
                    </button>

                    <button
                      onClick={() => handleManageAdmins(dept._id)}
                      className="inline-flex items-center justify-center px-2 py-1.5 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="Manage Admins"
                    >
                      <FaUserTie className="w-3 h-3 md:mr-1.5" />
                      <span className="hidden md:inline">Admins/Officers</span>
                    </button>

                    <button
                      onClick={() => handleEditDepartment(dept._id)}
                      className="inline-flex items-center justify-center px-2 py-1.5 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
                      title="Edit Department"
                    >
                      <FiEdit className="w-3 h-3 md:mr-1.5" />
                      <span className="hidden md:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(dept._id)}
                      className="inline-flex items-center justify-center px-2 py-1.5 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Delete Department"
                    >
                      <FiTrash2 className="w-3 h-3 md:mr-1.5" />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-slate-700 bg-slate-800/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Showing {(currentPage - 1) * 6 + 1} to {Math.min(currentPage * 6, total)} of {total} departments
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPageContext(currentPage - 1)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${currentPage === 1
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 hover:bg-slate-700'
                    }`}
                >
                  Prev
                </button>

                <div className="flex items-center gap-0.5">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPageContext(pageNum)}
                        className={`w-7 h-7 rounded text-xs font-medium transition-colors ${currentPage === pageNum
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
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPageContext(currentPage + 1)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${currentPage === totalPages
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

      {/* Delete Confirmation Modal - Dark Theme */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => {
                setDeleteConfirm(null);
                setDeleteConfirmationText('');
              }}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full mx-auto relative z-50 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 sm:p-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-500/20 mb-3 sm:mb-4">
                      <FiTrash2 className="h-6 w-6 sm:h-7 sm:w-7 text-red-400" />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      Delete Department?
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-5">
                      This action <span className="font-semibold text-red-400">cannot be undone</span>.
                      Type <span className="font-bold text-red-400">DELETE</span> to confirm.
                    </p>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={deleteConfirmationText}
                        onChange={(e) => setDeleteConfirmationText(e.target.value)}
                        className="w-full px-4 py-2.5 text-center bg-slate-700 border border-slate-600 text-white rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-500 outline-none transition-colors"
                        placeholder="Type DELETE"
                        autoFocus
                      />

                      <div className={`text-xs sm:text-sm font-medium ${deleteConfirmationText === 'DELETE' ? 'text-green-400' : 'text-slate-500'}`}>
                        {deleteConfirmationText === 'DELETE'
                          ? '✓ Ready to delete'
                          : 'Enter "DELETE" to enable delete button'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/80 px-5 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleteConfirmationText !== 'DELETE'}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium text-white transition-colors ${deleteConfirmationText === 'DELETE'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
                      : 'bg-red-900/50 text-red-300 cursor-not-allowed'
                      }`}
                  >
                    Delete Department
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm(null);
                      setDeleteConfirmationText('');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentManagementTab;