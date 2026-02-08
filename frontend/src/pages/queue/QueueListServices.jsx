import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, ArrowRight, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const QueueListServices = () => {
  const navigate = useNavigate();
  const { departmentId: paramDeptId } = useParams();
  const { user } = useAuth();
  const { departmentServices, getDepartmentServicesForQueue, loading, error } = useQueue();
  
  const [selectedDate, setSelectedDate] = useState('');

  // Initialize with today's date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const deptId = paramDeptId || user?.departmentId;
        if (deptId) {
          await getDepartmentServicesForQueue(deptId);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };
    
    fetchServices();
  }, [paramDeptId, user?.departmentId, getDepartmentServicesForQueue]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleManageQueue = (service) => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    
    const deptId = paramDeptId || user?.departmentId;
    navigate(`/officer-panel/queue-management/${deptId}/${service._id}?date=${selectedDate}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load services</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => getDepartmentServicesForQueue(paramDeptId || user?.departmentId)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Queue Management</h1>
          <p className="text-gray-600">Select a service and date to manage the queue</p>
        </div>

        {/* Date Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Select Date</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Choose the date for which you want to manage the queue
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {selectedDate && (
                <div className="hidden sm:block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  {formatDate(selectedDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentServices.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600">This department has no services configured yet.</p>
              </div>
            </div>
          ) : (
            departmentServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">Code: {service.serviceCode}</p>
                    </div>
                    {service.priorityAllowed && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                        Priority
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Document upload: {service.isDocumentUploadRequired ? 'Required' : 'Optional'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleManageQueue(service)}
                    disabled={!selectedDate}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      selectedDate
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedDate ? (
                      <>
                        <span>Manage Queue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      'Select Date First'
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {selectedDate && departmentServices.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Click on any service to manage its queue for {formatDate(selectedDate)}
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/officer-panel')}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueListServices;