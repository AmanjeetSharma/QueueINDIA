import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDepartment } from '../../context/DepartmentContext';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaClock, 
  FaArrowRight, 
  FaCar,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaStar,
  FaCog,
  FaUsers
} from 'react-icons/fa';

const Departments = () => {
  const { 
    departments, 
    loading, 
    error, 
    getDepartments,
    total,
    totalPages,
    currentPage,
    limit,
    filters: activeFilters
  } = useDepartment();

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    state: '',
    pincode: '',
    status: '',
    serviceCode: '',
    bookingEnabled: '',
    minRating: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load initial filters from context if available
  useEffect(() => {
    if (activeFilters) {
      setFilters(prev => ({
        ...prev,
        ...activeFilters
      }));
    }
  }, [activeFilters]);

  const handleFilterChange = (key, value) => {
    const processedValue = key === 'pincode' ? value.replace(/\D/g, '').slice(0, 6) : value;
    setFilters(prev => ({ ...prev, [key]: processedValue }));
  };

  const handleSearch = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );
    
    getDepartments({ 
      ...cleanFilters, 
      page: 1, 
      limit, 
      sortBy, 
      sortOrder 
    });
  };

  const handleClearFilters = () => {
    const resetFilters = {
      search: '',
      category: '',
      city: '',
      state: '',
      pincode: '',
      status: '',
      serviceCode: '',
      bookingEnabled: '',
      minRating: ''
    };
    setFilters(resetFilters);
    getDepartments({ page: 1, limit });
  };

  const handlePageChange = (page) => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );
    getDepartments({ ...cleanFilters, page, limit, sortBy, sortOrder });
  };

  const handleSortChange = (field) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );
    getDepartments({ 
      ...cleanFilters, 
      page: currentPage, 
      limit, 
      sortBy: field, 
      sortOrder: newOrder 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const getCategoryIcon = (category) => {
    const categoryLower = category?.toLowerCase() || '';
    switch (true) {
      case categoryLower.includes('health'): return <FaBuilding className="w-4 h-4" />;
      case categoryLower.includes('transport'): return <FaCar className="w-4 h-4" />;
      case categoryLower.includes('education'): return <FaBuilding className="w-4 h-4" />;
      case categoryLower.includes('municipal'): return <FaBuilding className="w-4 h-4" />;
      default: return <FaBuilding className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
      'under-maintenance': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' }
    }[status] || { bg: 'bg-slate-100', text: 'text-slate-800', dot: 'bg-slate-500' };

    const displayStatus = status === 'under-maintenance' ? 'Maintenance' : 
                         status?.charAt(0).toUpperCase() + status?.slice(1);

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
        {displayStatus}
      </span>
    );
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  if (loading && departments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Departments</h1>
            <p className="text-slate-600 text-sm">Find and explore government departments</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Search Bar */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search departments, services, categories..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FaFilter className="w-3.5 h-3.5" />
                Filters
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Compact Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 mt-4 border-t border-slate-200"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    placeholder="Healthcare, Transport..."
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai, Delhi..."
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra, Delhi..."
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Service Code</label>
                  <input
                    type="text"
                    placeholder="OPD, DLRN..."
                    value={filters.serviceCode}
                    onChange={(e) => handleFilterChange('serviceCode', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={filters.pincode}
                    onChange={(e) => handleFilterChange('pincode', e.target.value)}
                    maxLength={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under-maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Booking</label>
                  <select
                    value={filters.bookingEnabled}
                    onChange={(e) => handleFilterChange('bookingEnabled', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Booking Enabled</option>
                    <option value="false">Walk-in Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-200">
              <span className="text-xs text-slate-600">Active:</span>
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <span key={key} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {key}: {value}
                  </span>
                )
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto flex items-center gap-1"
              >
                <FaTimes className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}

          {/* Sorting Options */}
          <div className="flex items-center gap-3 pt-3 mt-3 border-t border-slate-200">
            <span className="text-xs text-slate-600 font-medium">Sort by:</span>
            <div className="flex gap-1">
              {['name', 'createdAt', 'status'].map((field) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    sortBy === field
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {field === 'createdAt' ? 'Date' : field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortBy === field && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-slate-600 text-sm">
            {total} department{total !== 1 ? 's' : ''} found
          </p>
          {totalPages > 1 && (
            <p className="text-slate-600 text-sm">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {departments.map((department, index) => (
            <DepartmentCard
              key={department._id}
              department={department}
              index={index}
              getCategoryIcon={getCategoryIcon}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>

        {/* Compact Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-sm"
            >
              <FaChevronLeft className="w-3 h-3" />
              Prev
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-sm"
            >
              Next
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {departments.length === 0 && !loading && (
          <div className="text-center py-8 bg-white rounded-lg border border-slate-200">
            <FaBuilding className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No departments found</h3>
            <p className="text-slate-500 text-sm mb-3">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria'
                : 'No departments available'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to load</h3>
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <button
                onClick={() => getDepartments({ page: 1, limit: 6 })}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Updated Department Card with new schema data
const DepartmentCard = ({ department, index, getCategoryIcon, getStatusBadge }) => {
  const location = department.location || {};
  const stats = department.stats || {};
  const contact = department.contact || {};
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors hover:shadow-md"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {getCategoryIcon(department.category)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                {department.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(department.status)}
                <span className="text-xs text-slate-500">
                  {department.departmentCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {/* Location */}
          {(location.city || location.pincode) && (
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <FaMapMarkerAlt className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                {location.city}
                {location.pincode && `, ${location.pincode}`}
              </span>
            </div>
          )}

          {/* Contact */}
          {contact.phone && (
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <FaPhone className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>{contact.phone}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            {stats.totalServices > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <FaCog className="w-3 h-3" />
                <span>{stats.totalServices} services</span>
              </div>
            )}
            
            {stats.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <FaStar className="w-3 h-3 text-amber-500" />
                <span>{stats.averageRating}/5</span>
              </div>
            )}
          </div>

          {/* Services Preview */}
          {department.servicesPreview && department.servicesPreview.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-1">Services:</p>
              <div className="flex flex-wrap gap-1">
                {department.servicesPreview.slice(0, 2).map((service, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                    {service}
                  </span>
                ))}
                {department.servicesPreview.length > 2 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                    +{department.servicesPreview.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          to={`/departments/${department._id}`}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium group"
        >
          View Details
          <FaArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default Departments;