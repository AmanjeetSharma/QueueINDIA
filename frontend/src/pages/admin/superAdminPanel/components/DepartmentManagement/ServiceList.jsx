// pages/department/services/ServiceList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { useService } from '../../../../../context/ServiceContext';
import { useDepartment } from '../../../../../context/DepartmentContext';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiClock,
  FiFileText,
  FiUsers,
  FiSettings
} from 'react-icons/fi';

const ServiceList = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDepartment, getDepartmentById } = useDepartment();
  const { deleteService, loading } = useService();
  
  const [services, setServices] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, serviceId: null, serviceName: '' });

  useEffect(() => {
    fetchDepartmentServices();
  }, [deptId]);

  const fetchDepartmentServices = async () => {
    try {
      setFetching(true);
      // Get department details which includes services
      const deptData = await getDepartmentById(deptId);
      if (deptData?.data?.services) {
        setServices(deptData.data.services);
      }
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteClick = (service) => {
    setDeleteModal({
      show: true,
      serviceId: service._id,
      serviceName: service.name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteService(deptId, deleteModal.serviceId);
      setServices(prev => prev.filter(s => s._id !== deleteModal.serviceId));
      setDeleteModal({ show: false, serviceId: null, serviceName: '' });
      toast.success('Service deleted successfully!');
    } catch (error) {
      // Error is already handled in context
      console.error('Delete failed:', error);
    }
  };

  const canManage = () => {
    return user?.role === 'SUPER_ADMIN' || 
           currentDepartment?.staff?.some(staff => staff.userId?._id === user?._id || staff.userId === user?._id);
  };

  const getQueueTypeBadge = (type) => {
    const colors = {
      'Token': 'bg-blue-100 text-blue-800',
      'Slot': 'bg-purple-100 text-purple-800',
      'Hybrid': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/departments')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentDepartment?.name || 'Department'} Services
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage all services offered by this department
                </p>
              </div>
            </div>
            
            {canManage() && (
              <button
                onClick={() => navigate(`/manage/departments/${deptId}/services/create`)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Add New Service
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <FiSettings className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">
              This department doesn't have any services yet.
              {canManage() && ' Click the button above to add your first service.'}
            </p>
            {canManage() && (
              <button
                onClick={() => navigate(`/`)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Add Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Code: {service.serviceCode}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQueueTypeBadge(service.tokenManagement?.queueType)}`}>
                      {service.tokenManagement?.queueType || 'Hybrid'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description || 'No description provided'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {service.tokenManagement?.slotStartTime || '10:00'} - {service.tokenManagement?.slotEndTime || '17:00'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUsers className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Max Daily: {service.tokenManagement?.maxDailyServiceTokens || 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiFileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Docs Required: {service.requiredDocs?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {service.priorityAllowed && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Priority
                        </span>
                      )}
                      {service.isDocumentUploadRequired && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Documents
                        </span>
                      )}
                    </div>
                    
                    {canManage() && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/manage/departments/${deptId}/services/${service._id}/edit`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit service"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete service"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Service</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.serviceName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, serviceId: null, serviceName: '' })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;