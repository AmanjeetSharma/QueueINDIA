// pages/super-admin-panel/departments/DepartmentListPage.jsx
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
  FiChevronUp
} from 'react-icons/fi';
import { 
  FaBuilding,
  FaRegBuilding,
  FaListAlt
} from 'react-icons/fa';

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
      // Error handled in context
    }
  };

  const handleEditDepartment = (deptId) => {
    navigate(`/super-admin-panel/departments/${deptId}/edit`);
  };

  const handleCreateDepartment = () => {
    navigate('/super-admin-panel/departments/create');
  };

  const openPublicDepartmentPage = (deptId) => {
    window.open(`/departments/${deptId}`, '_blank');
  };

  const getStatusBadge = (status) => {
    const config = {
      'active': { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle className="w-3 h-3" /> },
      'inactive': { color: 'bg-gray-100 text-gray-800', icon: <FiXCircle className="w-3 h-3" /> },
      'maintenance': { color: 'bg-yellow-100 text-yellow-800', icon: null }
    };

    const { color, icon } = config[status] || { color: 'bg-gray-100 text-gray-800', icon: null };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    if (!category) return <FaRegBuilding className="w-4 h-4 text-gray-500" />;
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('health')) return <FaBuilding className="w-4 h-4 text-red-500" />;
    if (categoryLower.includes('education')) return <FaBuilding className="w-4 h-4 text-blue-500" />;
    if (categoryLower.includes('transport')) return <FaBuilding className="w-4 h-4 text-green-500" />;
    if (categoryLower.includes('municipal')) return <FaBuilding className="w-4 h-4 text-purple-500" />;
    return <FaRegBuilding className="w-4 h-4 text-gray-500" />;
  };

  const renderStats = () => {
    const stats = {
      totalDepartments: total,
      activeDepartments: departments.filter(d => d.status === 'active').length,
      totalServices: departments.reduce((sum, dept) => sum + (dept.stats?.totalServices || 0), 0),
      totalAdmins: departments.reduce((sum, dept) => sum + (dept.stats?.totalAdmins || 0), 0)
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{stats.totalDepartments}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <FaBuilding className="text-base text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active</p>
              <p className="text-lg font-bold text-green-600 mt-0.5">{stats.activeDepartments}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <FiCheckCircle className="text-base text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Services</p>
              <p className="text-lg font-bold text-purple-600 mt-0.5">{stats.totalServices}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <FaListAlt className="text-base text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Admins</p>
              <p className="text-lg font-bold text-orange-600 mt-0.5">{stats.totalAdmins}</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-50">
              <FiUsers className="text-base text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-100 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-2 bg-gray-100 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Department Management</h1>
            <p className="text-sm text-gray-600 mt-0.5">Manage all government departments</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateDepartment}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">New Department</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar - Always Visible */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, category, or services..."
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="inline-flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <button
                onClick={applySearch}
                className="inline-flex items-center px-3 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSearch className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
              
              <button
                onClick={fetchDepartments}
                disabled={loading}
                className="inline-flex items-center p-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Refresh"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Additional Filters - Collapsible */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
          )}
        </div>
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <FiXCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="mt-1 text-xs font-medium text-red-700 hover:text-red-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Departments List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* List Header */}
        <div className="px-3 sm:px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">All Departments</h3>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                {total} total
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && renderSkeleton()}

        {/* Empty State */}
        {!loading && departments.length === 0 && (
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FaBuilding className="text-xl text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No Departments Found</h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm ? 'Try a different search term' : 'No departments available yet'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  applySearch();
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={handleCreateDepartment}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                <FiPlus className="inline w-4 h-4 mr-1.5" />
                Create First Department
              </button>
            )}
          </div>
        )}

        {/* Departments List */}
        {!loading && departments.length > 0 && (
          <div className="divide-y divide-gray-200">
            {departments.map((dept) => (
              <div key={dept._id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Department Info */}
                  <div className="flex items-start gap-3 flex-1">
                    {/* Icon - Clickable for Public View */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() => openPublicDepartmentPage(dept._id)}
                        title="View Public Page"
                      >
                        {getCategoryIcon(dept.category)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 
                            className="text-base font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => openPublicDepartmentPage(dept._id)}
                            title="View Public Page"
                          >
                            {dept.name}
                          </h4>
                          {getStatusBadge(dept.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaListAlt className="w-3 h-3" />
                            {dept.stats?.totalServices || 0} services
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {/* Category & Location */}
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            <FaRegBuilding className="w-3 h-3" />
                            {dept.category || 'General'}
                          </span>
                          <span className="text-gray-300 hidden sm:inline">•</span>
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            <FiMapPin className="w-3 h-3" />
                            {dept.location?.city}, {dept.location?.state}
                          </span>
                        </div>

                        {/* Contact */}
                        {(dept.contact?.phone || dept.contact?.email) && (
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600">
                            {dept.contact?.phone && (
                              <span className="inline-flex items-center gap-1">
                                <FiPhone className="w-3 h-3" />
                                <span className="hidden sm:inline">{dept.contact.phone}</span>
                                <span className="sm:hidden">Phone</span>
                              </span>
                            )}
                            {dept.contact?.email && (
                              <span className="inline-flex items-center gap-1 truncate">
                                <FiMail className="w-3 h-3" />
                                <span className="hidden sm:inline">{dept.contact.email}</span>
                                <span className="sm:hidden">Email</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Services Preview */}
                        {dept.servicesPreview?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-700 hidden sm:inline">Services:</span>
                            {dept.servicesPreview.slice(0, 2).map((service, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                {service}
                              </span>
                            ))}
                            {dept.servicesPreview.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{dept.servicesPreview.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Edit & Delete Only */}
                  <div className="flex items-center gap-2">
                    {/* Desktop - Text Labels */}
                    <div className="hidden md:flex gap-2">
                      <button
                        onClick={() => handleEditDepartment(dept._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Edit Department"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => setDeleteConfirm(dept._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Department"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>

                    {/* Mobile - Icons Only */}
                    <div className="flex md:hidden gap-1">
                      <button
                        onClick={() => handleEditDepartment(dept._id)}
                        className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Department"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setDeleteConfirm(dept._id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Department"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-600">
                Showing {(currentPage - 1) * 6 + 1} to {Math.min(currentPage * 6, total)} of {total} departments
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPageContext(currentPage - 1)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
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
                        className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
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
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    currentPage === totalPages
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

      {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal - Simpler Version */}
{deleteConfirm && (
  <>
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-slate-700 bg-opacity-30 z-40"
      onClick={() => {
        setDeleteConfirm(null);
        setDeleteConfirmationText('');
      }}
    />
    
    {/* Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-auto relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
              <FiTrash2 className="h-7 w-7 text-red-600" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Department?
            </h3>
            
            <p className="text-sm text-gray-600 mb-5">
              This action <span className="font-semibold text-red-600">cannot be undone</span>. 
              Type <span className="font-bold text-red-600">DELETE</span> to confirm.
            </p>
            
            <div className="space-y-3">
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full px-4 py-3 text-center border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                placeholder="Type DELETE in caps"
                autoFocus
              />
              
              <div className={`text-sm font-medium ${deleteConfirmationText === 'DELETE' ? 'text-green-600' : 'text-gray-500'}`}>
                {deleteConfirmationText === 'DELETE' 
                  ? '✓ Ready to delete' 
                  : 'Enter "DELETE" to enable delete button'}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={() => handleDelete(deleteConfirm)}
            disabled={deleteConfirmationText !== 'DELETE'}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-colors ${
              deleteConfirmationText === 'DELETE' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-300 cursor-not-allowed'
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
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default DepartmentManagementTab;