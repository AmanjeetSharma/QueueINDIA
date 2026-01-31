import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Icon';
import { useDepartment } from '../../../../../context/DepartmentContext';
import { useService } from '../../../../../context/ServiceContext';
import { useAdmin } from '../../../../../context/AdminContext';
import { useAuth } from '../../../../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdRefresh,
  MdRedo,
  MdArrowUpward,
  MdArrowDownward,
  MdAdd,
  MdEdit,
  MdDelete,
  MdAdminPanelSettings,
  MdLocationOn,
  MdClose,
  MdArrowBack,
  MdSave,
  MdWarning
} from "react-icons/md";
import { GrServices } from "react-icons/gr";

// Import page components
import DepartmentDashboard from './pages/DepartmentDashboard';
import CreateDepartmentPage from './pages/CreateDepartmentPage.jsx';
import EditDepartmentPage from './pages/EditDepartmentPage';
import DepartmentServicesPage from './pages/DepartmentServicesPage';
import DepartmentAdminsPage from './pages/DepartmentAdminsPage';

const DepartmentManagementTab = () => {
  const {
    departments = [],
    loading: deptLoading,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartment();

  const {
    addService,
    updateService,
    deleteService,
    loading: serviceLoading
  } = useService();

  const {
    admins,
    getDepartmentAdmins,
    assignAdminToDepartment,
    removeAdminFromDepartment,
    loading: adminLoading
  } = useAdmin();

  const { user } = useAuth();

  const [viewMode, setViewMode] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: 'ALL',
    state: 'ALL',
    sortBy: 'name', // Changed to match API default
    sortOrder: 'asc'
  });
  
  // Updated pagination structure to match API response
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDepartments: 0,
    limit: 6 // Changed to match API default
  });

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  // Fetch function that handles API response structure
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);

      // Prepare filters for API
      const apiFilters = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
        ...(filters.city !== 'ALL' && { city: filters.city }),
        ...(filters.state !== 'ALL' && { state: filters.state }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      // Adjust sortBy if it's not supported by backend
      const validSortFields = ['name', 'departmentCategory', 'status'];
      if (!validSortFields.includes(apiFilters.sortBy)) {
        apiFilters.sortBy = 'name';
      }

      console.log('Fetching with filters:', apiFilters);

      // Call the context function and capture the response
      const response = await getDepartments(apiFilters);

      // Update pagination from response if available
      if (response && response.data) {
        const { page, totalPages, total, limit } = response.data;
        setPagination({
          currentPage: page,
          totalPages,
          totalDepartments: total,
          limit
        });
      }

    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, [
    getDepartments,
    pagination.currentPage,
    pagination.limit,
    searchTerm,
    filters.city,
    filters.state,
    filters.sortBy,
    filters.sortOrder
  ]);

  // Initial fetch
  useEffect(() => {
    if (viewMode === 'dashboard' && shouldFetch) {
      fetchDepartments();
      setShouldFetch(false);
    }
  }, [viewMode, shouldFetch, fetchDepartments]);

  // Navigation handlers
  const navigateToDashboard = () => {
    setViewMode('dashboard');
    setSelectedDepartment(null);
    setShouldFetch(true);
  };

  const navigateToCreate = () => {
    setViewMode('create');
  };

  const navigateToEdit = (dept) => {
    setSelectedDepartment(dept);
    setViewMode('edit');
  };

  const navigateToServices = (dept) => {
    setSelectedDepartment(dept);
    setViewMode('services');
  };

  const navigateToAdmins = (dept) => {
    setSelectedDepartment(dept);
    setViewMode('admins');
  };

  // Apply filters handler
  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShouldFetch(true);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      city: 'ALL',
      state: 'ALL',
      sortBy: 'name', // Reset to API default
      sortOrder: 'asc' // Reset to API default
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShouldFetch(true);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
    setShouldFetch(true);
  };

  // Change sort field - only allow backend-supported fields
  const changeSortField = (field) => {
    const validSortFields = ['name', 'departmentCategory', 'status'];
    const actualField = validSortFields.includes(field) ? field : 'name';
    
    setFilters(prev => ({
      ...prev,
      sortBy: actualField
    }));
    setShouldFetch(true);
  };

  // Manual refresh
  const handleManualRefresh = () => {
    setShouldFetch(true);
  };

  // Handle pagination change
  const handlePaginationChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    setShouldFetch(true);
  };

  // Get unique cities and states for filters from departments array
  const uniqueCities = [...new Set(departments
    .map(dept => dept.location?.city || dept.address?.city)
    .filter(city => city && city !== 'ALL')
  )].sort();

  const uniqueStates = [...new Set(departments
    .map(dept => dept.location?.state || dept.address?.state)
    .filter(state => state && state !== 'ALL')
  )].sort();

  // Action handlers
  const handleCreateDepartment = async (departmentData) => {
    try {
      setActionLoading(true);
      await createDepartment(departmentData);
      toast.success('Department created successfully!');
      navigateToDashboard();
    } catch (error) {
      console.error('Create department error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDepartment = async (updateData) => {
    try {
      setActionLoading(true);
      await updateDepartment(selectedDepartment._id, updateData);
      toast.success('Department updated successfully!');
      navigateToDashboard();
    } catch (error) {
      console.error('Update department error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (!window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await deleteDepartment(deptId);
      toast.success('Department deleted successfully!');
      setShouldFetch(true);
    } catch (error) {
      console.error('Delete department error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddService = async (serviceData) => {
    try {
      setActionLoading(true);
      await addService(selectedDepartment._id, serviceData);
      toast.success('Service added successfully!');
    } catch (error) {
      console.error('Add service error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateService = async (serviceId, updateData) => {
    try {
      setActionLoading(true);
      await updateService(selectedDepartment._id, serviceId, updateData);
      toast.success('Service updated successfully!');
    } catch (error) {
      console.error('Update service error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      setActionLoading(true);
      await deleteService(selectedDepartment._id, serviceId);
      toast.success('Service deleted successfully!');
    } catch (error) {
      console.error('Delete service error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignAdmin = async (adminEmail) => {
    try {
      setActionLoading(true);
      await assignAdminToDepartment(selectedDepartment._id, adminEmail);
      toast.success('Admin assigned successfully!');
    } catch (error) {
      console.error('Assign admin error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      setActionLoading(true);
      await removeAdminFromDepartment(selectedDepartment._id, adminId);
      toast.success('Admin removed successfully!');
    } catch (error) {
      console.error('Remove admin error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Get department stats - fixed to use API response structure
  const getDepartmentStats = () => {
    const totalDepartments = pagination.totalDepartments || departments.length;
    const totalServices = departments.reduce((acc, dept) => acc + (dept.stats?.totalServices || 0), 0);
    const totalAdmins = departments.reduce((acc, dept) => acc + (dept.stats?.totalAdmins || 0), 0);
    const activeDepartments = departments.filter(dept => dept.status === 'active').length;

    return {
      totalDepartments,
      totalServices,
      totalAdmins,
      activeDepartments
    };
  };

  const stats = getDepartmentStats();

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          {viewMode !== 'dashboard' && (
            <button
              onClick={navigateToDashboard}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Back to dashboard"
            >
              <MdArrowBack className="text-xl" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === 'dashboard' && 'Department Management'}
              {viewMode === 'create' && 'Create New Department'}
              {viewMode === 'edit' && `Edit: ${selectedDepartment?.name || 'Department'}`}
              {viewMode === 'services' && `Services: ${selectedDepartment?.name || 'Department'}`}
              {viewMode === 'admins' && `Admins: ${selectedDepartment?.name || 'Department'}`}
            </h2>
            <p className="text-sm text-gray-600">
              {viewMode === 'dashboard' && `Total: ${stats.totalDepartments} departments`}
              {viewMode === 'create' && 'Create a new department with all configurations'}
              {viewMode === 'edit' && 'Edit department details and configuration'}
              {viewMode === 'services' && 'Manage services within this department'}
              {viewMode === 'admins' && 'Manage admin assignments for this department'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'dashboard' && (
            <>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={handleManualRefresh}
                disabled={loading}
              >
                <MdRefresh className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={navigateToCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm transition-colors"
              >
                <MdAdd className="mr-2" />
                Create Department
              </button>
            </>
          )}
          {viewMode !== 'dashboard' && (
            <button
              onClick={navigateToDashboard}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center text-sm transition-colors"
            >
              <MdClose className="mr-2" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {viewMode === 'dashboard' ? (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total Departments</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalDepartments}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Icon name="department" className="text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total Services</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalServices}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50">
                      <GrServices className="text-purple-500 text-lg" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total Admins</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalAdmins}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-50">
                      <MdAdminPanelSettings className="text-green-500 text-lg" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Active Departments</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{stats.activeDepartments}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-red-50">
                      <Icon name="active" className="text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Departments</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, services, or category..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                      />
                      <Icon name="search" className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={filters.city}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, city: e.target.value }));
                        setShouldFetch(true);
                      }}
                    >
                      <option value="ALL">All Cities</option>
                      {uniqueCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* State Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={filters.state}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, state: e.target.value }));
                        setShouldFetch(true);
                      }}
                    >
                      <option value="ALL">All States</option>
                      {uniqueStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={filters.sortBy}
                        onChange={(e) => changeSortField(e.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="departmentCategory">Category</option>
                        <option value="status">Status</option>
                      </select>
                      <button
                        onClick={toggleSortOrder}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors"
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
                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    disabled={loading}
                  >
                    <MdRedo className="mr-1" />
                    Reset Filters
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <Icon name="filter" size={16} />
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Departments Table */}
              <DepartmentDashboard
                departments={departments}
                loading={loading}
                pagination={pagination}
                navigateToEdit={navigateToEdit}
                navigateToServices={navigateToServices}
                navigateToAdmins={navigateToAdmins}
                handleDeleteDepartment={handleDeleteDepartment}
                onPageChange={handlePaginationChange}
              />
            </>
          ) : viewMode === 'create' ? (
            <CreateDepartmentPage
              onSave={handleCreateDepartment}
              onCancel={navigateToDashboard}
              loading={actionLoading}
            />
          ) : viewMode === 'edit' ? (
            <EditDepartmentPage
              department={selectedDepartment}
              onSave={handleUpdateDepartment}
              onCancel={navigateToDashboard}
              loading={actionLoading}
            />
          ) : viewMode === 'services' ? (
            <DepartmentServicesPage
              department={selectedDepartment}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
              onCancel={navigateToDashboard}
              loading={actionLoading}
            />
          ) : viewMode === 'admins' ? (
            <DepartmentAdminsPage
              department={selectedDepartment}
              onAssignAdmin={handleAssignAdmin}
              onRemoveAdmin={handleRemoveAdmin}
              onCancel={navigateToDashboard}
              loading={actionLoading}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DepartmentManagementTab;