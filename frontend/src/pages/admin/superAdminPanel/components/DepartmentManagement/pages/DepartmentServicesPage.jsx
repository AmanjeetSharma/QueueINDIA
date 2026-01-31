// pages/DepartmentServicesPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MdAdd, 
  MdCancel, 
  MdEdit, 
  MdDelete, 
  MdSave,
  MdAccessTime,
  MdPriorityHigh,
  MdAttachFile,
  MdQueue
} from "react-icons/md";
import toast from 'react-hot-toast';

const DepartmentServicesPage = ({ department, onAddService, onUpdateService, onDeleteService, onCancel, loading }) => {
  const [services, setServices] = useState(department?.services || []);
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serviceCode: '',
    description: '',
    priorityAllowed: true,
    isDocumentUploadRequired: true,
    tokenManagement: {
      maxDailyServiceTokens: null,
      maxTokensPerSlot: 10,
      queueType: "Hybrid",
      timeBtwEverySlot: 15,
      slotStartTime: "10:00",
      slotEndTime: "17:00",
      slotWindows: []
    },
    requiredDocs: []
  });

  useEffect(() => {
    if (department?.services) {
      setServices(department.services);
    }
  }, [department]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAddDocument = () => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: [...prev.requiredDocs, { name: '', description: '', isMandatory: true }]
    }));
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocs = [...formData.requiredDocs];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setFormData(prev => ({ ...prev, requiredDocs: newDocs }));
  };

  const handleRemoveDocument = (index) => {
    const newDocs = formData.requiredDocs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, requiredDocs: newDocs }));
  };

  const handleAddSlotWindow = () => {
    const newWindows = [...formData.tokenManagement.slotWindows, { startTime: '10:00', endTime: '12:00' }];
    handleInputChange('tokenManagement.slotWindows', newWindows);
  };

  const handleSlotWindowChange = (index, field, value) => {
    const newWindows = [...formData.tokenManagement.slotWindows];
    newWindows[index] = { ...newWindows[index], [field]: value };
    handleInputChange('tokenManagement.slotWindows', newWindows);
  };

  const handleRemoveSlotWindow = (index) => {
    const newWindows = formData.tokenManagement.slotWindows.filter((_, i) => i !== index);
    handleInputChange('tokenManagement.slotWindows', newWindows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.serviceCode.trim()) {
      toast.error('Service name and code are required');
      return;
    }

    try {
      if (editingService) {
        await onUpdateService(editingService._id, formData);
        setEditingService(null);
      } else {
        await onAddService(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        serviceCode: '',
        description: '',
        priorityAllowed: true,
        isDocumentUploadRequired: true,
        tokenManagement: {
          maxDailyServiceTokens: null,
          maxTokensPerSlot: 10,
          queueType: "Hybrid",
          timeBtwEverySlot: 15,
          slotStartTime: "10:00",
          slotEndTime: "17:00",
          slotWindows: []
        },
        requiredDocs: []
      });
      setIsCreating(false);
    } catch (error) {
      // Error handled in parent
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsCreating(true);
    setFormData({
      name: service.name,
      serviceCode: service.serviceCode,
      description: service.description,
      priorityAllowed: service.priorityAllowed,
      isDocumentUploadRequired: service.isDocumentUploadRequired,
      tokenManagement: service.tokenManagement || {
        maxDailyServiceTokens: null,
        maxTokensPerSlot: 10,
        queueType: "Hybrid",
        timeBtwEverySlot: 15,
        slotStartTime: "10:00",
        slotEndTime: "17:00",
        slotWindows: []
      },
      requiredDocs: service.requiredDocs || []
    });
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await onDeleteService(serviceId);
      } catch (error) {
        // Error handled in parent
      }
    }
  };

  if (!department) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-gray-500 py-8">
          <p>No department selected</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Services Management</h3>
            <p className="text-sm text-gray-600">Department: {department.name}</p>
            <p className="text-xs text-gray-500">Manage services and their configurations</p>
          </div>
          <div className="flex items-center gap-2">
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <MdAdd />
                Add New Service
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingService(null);
                  setFormData({
                    name: '',
                    serviceCode: '',
                    description: '',
                    priorityAllowed: true,
                    isDocumentUploadRequired: true,
                    tokenManagement: {
                      maxDailyServiceTokens: null,
                      maxTokensPerSlot: 10,
                      queueType: "Hybrid",
                      timeBtwEverySlot: 15,
                      slotStartTime: "10:00",
                      slotEndTime: "17:00",
                      slotWindows: []
                    },
                    requiredDocs: []
                  });
                }}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <MdCancel />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List */}
        <div className={`${isCreating ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900">Services ({services.length})</h4>
            <p className="text-sm text-gray-600">All services available in this department</p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No services found</p>
              <p className="text-sm mt-1">Add your first service to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map(service => (
                <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {service.serviceCode}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {service.priorityAllowed && (
                          <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <MdPriorityHigh className="mr-1" /> Priority Allowed
                          </span>
                        )}
                        {service.isDocumentUploadRequired && (
                          <span className="inline-flex items-center text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                            <MdAttachFile className="mr-1" /> Docs Required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit service"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete service"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Form */}
        {isCreating && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Code *
                  </label>
                  <input
                    type="text"
                    value={formData.serviceCode}
                    onChange={(e) => handleInputChange('serviceCode', e.target.value.toUpperCase())}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="SERVICE_CODE"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent h-24"
                    placeholder="Describe this service..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.priorityAllowed}
                      onChange={(e) => handleInputChange('priorityAllowed', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Priority Allowed</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isDocumentUploadRequired}
                      onChange={(e) => handleInputChange('isDocumentUploadRequired', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Docs Required</span>
                  </label>
                </div>

                {/* Token Management */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MdQueue /> Token Management
                  </h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max Tokens Per Slot
                      </label>
                      <input
                        type="number"
                        value={formData.tokenManagement.maxTokensPerSlot}
                        onChange={(e) => handleInputChange('tokenManagement.maxTokensPerSlot', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Queue Type
                      </label>
                      <select
                        value={formData.tokenManagement.queueType}
                        onChange={(e) => handleInputChange('tokenManagement.queueType', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                      >
                        <option value="FIFO">FIFO (First In First Out)</option>
                        <option value="Priority">Priority Based</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Time Between Slots (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.tokenManagement.timeBtwEverySlot}
                        onChange={(e) => handleInputChange('tokenManagement.timeBtwEverySlot', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        min="1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Slot Start
                        </label>
                        <input
                          type="time"
                          value={formData.tokenManagement.slotStartTime}
                          onChange={(e) => handleInputChange('tokenManagement.slotStartTime', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Slot End
                        </label>
                        <input
                          type="time"
                          value={formData.tokenManagement.slotEndTime}
                          onChange={(e) => handleInputChange('tokenManagement.slotEndTime', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <MdAttachFile /> Required Documents
                    </h5>
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      + Add Document
                    </button>
                  </div>
                  
                  {formData.requiredDocs.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-2">No documents added</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.requiredDocs.map((doc, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={doc.name}
                              onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-1"
                              placeholder="Document name"
                            />
                            <input
                              type="text"
                              value={doc.description}
                              onChange={(e) => handleDocumentChange(index, 'description', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="Description (optional)"
                            />
                            <label className="flex items-center space-x-1 mt-1">
                              <input
                                type="checkbox"
                                checked={doc.isMandatory}
                                onChange={(e) => handleDocumentChange(index, 'isMandatory', e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-xs text-gray-700">Mandatory</span>
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <MdDelete size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MdSave />
                    {loading ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <MdCancel />
          Back to Departments
        </button>
        
        <div className="text-sm text-gray-600">
          Total Services: <span className="font-semibold">{services.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DepartmentServicesPage;