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
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDepartments: 0,
    limit: 6
  });

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);

      const apiFilters = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
        ...(filters.city !== 'ALL' && { city: filters.city }),
        ...(filters.state !== 'ALL' && { state: filters.state }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      const validSortFields = ['name', 'departmentCategory', 'status'];
      if (!validSortFields.includes(apiFilters.sortBy)) {
        apiFilters.sortBy = 'name';
      }

      console.log('Fetching with filters:', apiFilters);

      const response = await getDepartments(apiFilters);

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

  useEffect(() => {
    if (viewMode === 'dashboard' && shouldFetch) {
      fetchDepartments();
      setShouldFetch(false);
    }
  }, [viewMode, shouldFetch, fetchDepartments]);

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

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShouldFetch(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      city: 'ALL',
      state: 'ALL',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setShouldFetch(true);
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
    setShouldFetch(true);
  };

  const changeSortField = (field) => {
    const validSortFields = ['name', 'departmentCategory', 'status'];
    const actualField = validSortFields.includes(field) ? field : 'name';
    
    setFilters(prev => ({
      ...prev,
      sortBy: actualField
    }));
    setShouldFetch(true);
  };

  const handleManualRefresh = () => {
    setShouldFetch(true);
  };

  const handlePaginationChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    setShouldFetch(true);
  };

  const uniqueCities = [...new Set(departments
    .map(dept => dept.location?.city || dept.address?.city)
    .filter(city => city && city !== 'ALL')
  )].sort();

  const uniqueStates = [...new Set(departments
    .map(dept => dept.location?.state || dept.address?.state)
    .filter(state => state && state !== 'ALL')
  )].sort();

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
    <div className="space-y-4 p-2 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header with navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {viewMode !== 'dashboard' && (
            <button
              onClick={navigateToDashboard}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors flex-shrink-0"
              title="Back to dashboard"
            >
              <MdArrowBack className="text-lg sm:text-xl" />
            </button>
          )}
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {viewMode === 'dashboard' && 'Department Management'}
              {viewMode === 'create' && 'Create New Department'}
              {viewMode === 'edit' && `Edit: ${selectedDepartment?.name || 'Department'}`}
              {viewMode === 'services' && `Services: ${selectedDepartment?.name || 'Department'}`}
              {viewMode === 'admins' && `Admins: ${selectedDepartment?.name || 'Department'}`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
              {viewMode === 'dashboard' && `Total: ${stats.totalDepartments} departments`}
              {viewMode === 'create' && 'Create a new department with all configurations'}
              {viewMode === 'edit' && 'Edit department details and configuration'}
              {viewMode === 'services' && 'Manage services within this department'}
              {viewMode === 'admins' && 'Manage admin assignments for this department'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          {viewMode === 'dashboard' && (
            <>
              <button
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center justify-center sm:justify-start text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                onClick={handleManualRefresh}
                disabled={loading}
              >
                <MdRefresh className={`mr-1 sm:mr-2 text-sm sm:text-base flex-shrink-0 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
              <button
                onClick={navigateToCreate}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center sm:justify-start text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <MdAdd className="mr-1 sm:mr-2 text-sm sm:text-base flex-shrink-0" />
                <span className="hidden sm:inline">Create Department</span>
                <span className="sm:hidden">Add</span>
              </button>
            </>
          )}
          {viewMode !== 'dashboard' && (
            <button
              onClick={navigateToDashboard}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center sm:justify-start text-xs sm:text-sm font-medium transition-colors duration-200"
            >
              <MdClose className="mr-1 sm:mr-2 text-sm sm:text-base flex-shrink-0" />
              <span className="hidden sm:inline">Cancel</span>
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
          className="w-full"
        >
          {viewMode === 'dashboard' ? (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-blue-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-600">Departments</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalDepartments}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
                      <Icon name="department" className="text-blue-600 text-lg sm:text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-purple-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-600">Services</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalServices}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50 flex-shrink-0">
                      <GrServices className="text-purple-600 text-lg sm:text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-green-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-600">Admin Users</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalAdmins}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-50 flex-shrink-0">
                      <MdAdminPanelSettings className="text-green-600 text-lg sm:text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-amber-100 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-600">Active</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.activeDepartments}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 flex-shrink-0">
                      <Icon name="active" className="text-amber-600 text-lg sm:text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-5 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search departments..."
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pl-9 sm:pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                      />
                      <Icon name="search" className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                    </div>
                  </div>

                  {/* City Filter */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">City</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
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
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">State</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
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
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Sort</label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                        value={filters.sortBy}
                        onChange={(e) => changeSortField(e.target.value)}
                      >
                        <option value="name">Name</option>
                        <option value="departmentCategory">Category</option>
                        <option value="status">Status</option>
                      </select>
                      <button
                        onClick={toggleSortOrder}
                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors bg-gray-50"
                        title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                      >
                        {filters.sortOrder === 'asc' ? <MdArrowUpward className="text-sm" /> : <MdArrowDownward className="text-sm" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter Action Buttons */}
                <div className="flex gap-2 sm:gap-3 justify-end flex-wrap sm:flex-nowrap">
                  <button
                    onClick={handleResetFilters}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1 sm:gap-2 transition-colors disabled:opacity-50 font-medium cursor-pointer"
                    disabled={loading}
                  >
                    <MdRedo className="text-sm flex-shrink-0" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-1 sm:gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium cursor-pointer"
                    disabled={loading}
                  >
                    <Icon name="filter" size={14} />
                    <span>Apply</span>
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