// pages/department/services/ServiceForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useService } from '../../../../../context/ServiceContext';
import { useDepartment } from '../../../../../context/DepartmentContext';
import { FiChevronLeft, FiPlus, FiTrash2, FiSave, FiAlertCircle } from 'react-icons/fi';

const ServiceForm = () => {
  const { deptId, serviceId } = useParams();
  const navigate = useNavigate();
  const { addService, updateService, getServiceById, currentService, loading } = useService();
  const { currentDepartment, getDepartmentById } = useDepartment();

  const isEditMode = !!serviceId;

  const [formData, setFormData] = useState({
    name: '',
    serviceCode: '',
    description: '',
    priorityAllowed: true,
    isDocumentUploadRequired: true,
    tokenManagement: {
      maxDailyServiceTokens: '',
      maxTokensPerSlot: 10,
      queueType: 'Hybrid',
      timeBtwEverySlot: 15,
      slotStartTime: '10:00',
      slotEndTime: '17:00',
      slotWindows: []
    },
    requiredDocs: []
  });

  const [slotWindow, setSlotWindow] = useState({
    start: '',
    end: '',
    maxTokens: ''
  });

  const [requiredDoc, setRequiredDoc] = useState({
    name: '',
    description: '',
    isMandatory: true
  });

  const [errors, setErrors] = useState({});
  const [slotWindowError, setSlotWindowError] = useState('');

  useEffect(() => {
    fetchDepartmentData();
    if (isEditMode) {
      fetchServiceData();
    }
  }, [deptId, serviceId]);

  useEffect(() => {
    if (isEditMode && currentService) {
      setFormData({
        name: currentService.name || '',
        serviceCode: currentService.serviceCode || '',
        description: currentService.description || '',
        priorityAllowed: currentService.priorityAllowed ?? true,
        isDocumentUploadRequired: currentService.isDocumentUploadRequired ?? true,
        tokenManagement: {
          maxDailyServiceTokens: currentService.tokenManagement?.maxDailyServiceTokens || '',
          maxTokensPerSlot: currentService.tokenManagement?.maxTokensPerSlot || 10,
          queueType: currentService.tokenManagement?.queueType || 'Hybrid',
          timeBtwEverySlot: currentService.tokenManagement?.timeBtwEverySlot || 15,
          slotStartTime: currentService.tokenManagement?.slotStartTime || '10:00',
          slotEndTime: currentService.tokenManagement?.slotEndTime || '17:00',
          slotWindows: currentService.tokenManagement?.slotWindows || []
        },
        requiredDocs: currentService.requiredDocs || []
      });
    }
  }, [currentService, isEditMode]);

  const fetchDepartmentData = async () => {
    if (!currentDepartment || currentDepartment._id !== deptId) {
      await getDepartmentById(deptId);
    }
  };

  const fetchServiceData = async () => {
    try {
      await getServiceById(deptId, serviceId);
    } catch (error) {
      console.error('Error fetching service:', error);
      navigate(`/manage/departments/${deptId}/services`);
    }
  };

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Validate time range
  const isValidTimeRange = (start, end) => {
    if (!start || !end) return false;
    return timeToMinutes(end) > timeToMinutes(start);
  };

  // Check if slot windows overlap
  const doSlotsOverlap = (windows) => {
    if (windows.length < 2) return false;
    
    const sorted = [...windows].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (timeToMinutes(current.end) > timeToMinutes(next.start)) {
        return true;
      }
    }
    return false;
  };

  // Check if slot window is within global slot hours
  const isWithinGlobalHours = (start, end, globalStart, globalEnd) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    const globalStartMin = timeToMinutes(globalStart);
    const globalEndMin = timeToMinutes(globalEnd);
    
    return startMin >= globalStartMin && endMin <= globalEndMin;
  };

  // Validate slot window before adding
  const validateSlotWindow = () => {
    const { start, end, maxTokens } = slotWindow;
    
    if (!start || !end || !maxTokens) {
      setSlotWindowError('All fields are required');
      return false;
    }

    if (!isValidTimeRange(start, end)) {
      setSlotWindowError('End time must be after start time');
      return false;
    }

    const tokenValue = parseInt(maxTokens);
    if (isNaN(tokenValue) || tokenValue <= 0) {
      setSlotWindowError('Max tokens must be a positive number');
      return false;
    }

    // Check if within global hours
    if (!isWithinGlobalHours(start, end, formData.tokenManagement.slotStartTime, formData.tokenManagement.slotEndTime)) {
      setSlotWindowError('Slot window must be within global operating hours');
      return false;
    }

    // Check for overlap with existing windows
    const newWindow = { start, end, maxTokens: tokenValue };
    const existingWindows = [...formData.tokenManagement.slotWindows, newWindow];
    
    if (doSlotsOverlap(existingWindows)) {
      setSlotWindowError('Slot windows cannot overlap');
      return false;
    }

    setSlotWindowError('');
    return true;
  };

  const handleAddSlotWindow = () => {
    if (validateSlotWindow()) {
      const tokenValue = parseInt(slotWindow.maxTokens);
      setFormData(prev => ({
        ...prev,
        tokenManagement: {
          ...prev.tokenManagement,
          slotWindows: [
            ...prev.tokenManagement.slotWindows,
            { ...slotWindow, maxTokens: tokenValue }
          ]
        }
      }));

      setSlotWindow({ start: '', end: '', maxTokens: '' });
    }
  };

  const handleRemoveSlotWindow = (index) => {
    setFormData(prev => ({
      ...prev,
      tokenManagement: {
        ...prev.tokenManagement,
        slotWindows: prev.tokenManagement.slotWindows.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddRequiredDoc = () => {
    if (!requiredDoc.name) {
      alert('Please enter document name');
      return;
    }

    setFormData(prev => ({
      ...prev,
      requiredDocs: [...prev.requiredDocs, { ...requiredDoc }]
    }));

    setRequiredDoc({ name: '', description: '', isMandatory: true });
  };

  const handleRemoveRequiredDoc = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredDocs: prev.requiredDocs.filter((_, i) => i !== index)
    }));
  };

  // Numeric input handler with immediate conversion
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseInt(value, 10);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: numValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
      return;
    }

    // Handle numeric inputs
    if (name.includes('maxDailyServiceTokens') || 
        name.includes('maxTokensPerSlot') || 
        name.includes('timeBtwEverySlot')) {
      handleNumericChange(e);
      return;
    }

    // Handle other inputs
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
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
        [name]: value
      }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.serviceCode.trim()) {
      newErrors.serviceCode = 'Service code is required';
    }

    // Time validation
    if (!isValidTimeRange(formData.tokenManagement.slotStartTime, formData.tokenManagement.slotEndTime)) {
      newErrors.timeRange = 'End time must be after start time';
    }

    // Numeric validations
    if (formData.tokenManagement.maxDailyServiceTokens !== '') {
      const maxDaily = parseInt(formData.tokenManagement.maxDailyServiceTokens);
      if (isNaN(maxDaily) || maxDaily < 0) {
        newErrors.maxDailyServiceTokens = 'Must be a positive number or empty';
      }
    }

    const maxPerSlot = parseInt(formData.tokenManagement.maxTokensPerSlot);
    if (isNaN(maxPerSlot) || maxPerSlot <= 0) {
      newErrors.maxTokensPerSlot = 'Must be a positive number';
    }

    const timeBetween = parseInt(formData.tokenManagement.timeBtwEverySlot);
    if (isNaN(timeBetween) || timeBetween <= 0) {
      newErrors.timeBtwEverySlot = 'Must be a positive number';
    }

    // Slot windows validation
    if (formData.tokenManagement.slotWindows.length > 0) {
      if (doSlotsOverlap(formData.tokenManagement.slotWindows)) {
        newErrors.slotWindows = 'Slot windows cannot overlap';
      }

      // Check each window is within global hours
      const invalidWindows = formData.tokenManagement.slotWindows.filter(
        w => !isWithinGlobalHours(w.start, w.end, formData.tokenManagement.slotStartTime, formData.tokenManagement.slotEndTime)
      );
      if (invalidWindows.length > 0) {
        newErrors.slotWindows = 'All slot windows must be within operating hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Prepare data with proper numeric types
    const submitData = {
      ...formData,
      serviceCode: formData.serviceCode.toUpperCase().trim(),
      tokenManagement: {
        ...formData.tokenManagement,
        maxDailyServiceTokens: formData.tokenManagement.maxDailyServiceTokens 
          ? parseInt(formData.tokenManagement.maxDailyServiceTokens) 
          : null,
        maxTokensPerSlot: parseInt(formData.tokenManagement.maxTokensPerSlot),
        timeBtwEverySlot: parseInt(formData.tokenManagement.timeBtwEverySlot),
        slotWindows: formData.tokenManagement.slotWindows.map(window => ({
          ...window,
          maxTokens: parseInt(window.maxTokens)
        }))
      }
    };

    try {
      if (isEditMode) {
        await updateService(deptId, serviceId, submitData);
      } else {
        await addService(deptId, submitData);
      }
      navigate(`/manage/departments/${deptId}/services`);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    return errors[fieldName] 
      ? `${baseClass} border-red-500 focus:ring-red-500` 
      : `${baseClass} border-gray-300`;
  };

  if (loading && isEditMode) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/manage/departments/${deptId}/services`)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Service' : 'Create New Service'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentDepartment?.name || 'Department'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800 mb-2">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={getInputClassName('name')}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Code *
                </label>
                <input
                  type="text"
                  name="serviceCode"
                  value={formData.serviceCode}
                  onChange={handleInputChange}
                  className={getInputClassName('serviceCode') + " uppercase"}
                  required
                />
                {errors.serviceCode && (
                  <p className="mt-1 text-xs text-red-600">{errors.serviceCode}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Service Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="priorityAllowed"
                  checked={formData.priorityAllowed}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Allow Priority Tokens
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDocumentUploadRequired"
                  checked={formData.isDocumentUploadRequired}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Require Document Upload
                </label>
              </div>
            </div>
          </div>

          {/* Token Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Token Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Daily Tokens
                </label>
                <input
                  type="number"
                  name="tokenManagement.maxDailyServiceTokens"
                  value={formData.tokenManagement.maxDailyServiceTokens}
                  onChange={handleInputChange}
                  min="0"
                  className={getInputClassName('maxDailyServiceTokens')}
                  placeholder="Leave empty for unlimited"
                />
                {errors.maxDailyServiceTokens && (
                  <p className="mt-1 text-xs text-red-600">{errors.maxDailyServiceTokens}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens Per Slot *
                </label>
                <input
                  type="number"
                  name="tokenManagement.maxTokensPerSlot"
                  value={formData.tokenManagement.maxTokensPerSlot}
                  onChange={handleInputChange}
                  min="1"
                  className={getInputClassName('maxTokensPerSlot')}
                  required
                />
                {errors.maxTokensPerSlot && (
                  <p className="mt-1 text-xs text-red-600">{errors.maxTokensPerSlot}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Queue Type
                </label>
                <select
                  name="tokenManagement.queueType"
                  value={formData.tokenManagement.queueType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Token">Online</option>
                  <option value="Slot">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Between Slots (minutes) *
                </label>
                <input
                  type="number"
                  name="tokenManagement.timeBtwEverySlot"
                  value={formData.tokenManagement.timeBtwEverySlot}
                  onChange={handleInputChange}
                  min="1"
                  className={getInputClassName('timeBtwEverySlot')}
                  required
                />
                {errors.timeBtwEverySlot && (
                  <p className="mt-1 text-xs text-red-600">{errors.timeBtwEverySlot}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slot Start Time *
                </label>
                <input
                  type="time"
                  name="tokenManagement.slotStartTime"
                  value={formData.tokenManagement.slotStartTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slot End Time *
                </label>
                <input
                  type="time"
                  name="tokenManagement.slotEndTime"
                  value={formData.tokenManagement.slotEndTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.timeRange && (
                  <p className="mt-1 text-xs text-red-600">{errors.timeRange}</p>
                )}
              </div>
            </div>

            {/* Slot Windows */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Slot Windows</h3>
              {errors.slotWindows && (
                <p className="mb-2 text-xs text-red-600">{errors.slotWindows}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="time"
                  placeholder="Start Time"
                  value={slotWindow.start}
                  onChange={(e) => setSlotWindow(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  placeholder="End Time"
                  value={slotWindow.end}
                  onChange={(e) => setSlotWindow(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max Tokens"
                  value={slotWindow.maxTokens}
                  onChange={(e) => setSlotWindow(prev => ({ ...prev, maxTokens: e.target.value }))}
                  min="1"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSlotWindow}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Add Window
                </button>
              </div>
              {slotWindowError && (
                <p className="mb-2 text-xs text-red-600">{slotWindowError}</p>
              )}

              {/* Slot Windows List */}
              {formData.tokenManagement.slotWindows.length > 0 && (
                <div className="space-y-2">
                  {formData.tokenManagement.slotWindows.map((window, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{window.start} - {window.end}</span>
                        <span className="text-sm text-gray-600">Max: {window.maxTokens}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlotWindow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Document Name"
                value={requiredDoc.name}
                onChange={(e) => setRequiredDoc(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={requiredDoc.description}
                onChange={(e) => setRequiredDoc(prev => ({ ...prev, description: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={requiredDoc.isMandatory}
                  onChange={(e) => setRequiredDoc(prev => ({ ...prev, isMandatory: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Mandatory</label>
                <button
                  type="button"
                  onClick={handleAddRequiredDoc}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Required Docs List */}
            {formData.requiredDocs.length > 0 && (
              <div className="space-y-2">
                {formData.requiredDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div>
                      <span className="text-sm font-medium">{doc.name}</span>
                      {doc.description && (
                        <span className="text-sm text-gray-600 ml-2">- {doc.description}</span>
                      )}
                      {doc.isMandatory && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequiredDoc(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/manage/departments/${deptId}/services`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (isEditMode ? 'Update Service' : 'Create Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;