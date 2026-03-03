// pages/department/services/ServiceForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useService } from '../../../../../context/ServiceContext';
import { useDepartment } from '../../../../../context/DepartmentContext';
import { 
  FiChevronLeft, 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiAlertCircle,
  FiClock,
  FiFileText,
  FiSettings,
  FiTag,
  FiCheckCircle
} from 'react-icons/fi';

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
  const [touched, setTouched] = useState({});

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
      setSlotWindowError('⚠️ All fields are required');
      return false;
    }

    if (!isValidTimeRange(start, end)) {
      setSlotWindowError('⏰ End time must be after start time');
      return false;
    }

    const tokenValue = parseInt(maxTokens);
    if (isNaN(tokenValue) || tokenValue <= 0) {
      setSlotWindowError('🔢 Max tokens must be a positive number');
      return false;
    }

    if (!isWithinGlobalHours(start, end, formData.tokenManagement.slotStartTime, formData.tokenManagement.slotEndTime)) {
      setSlotWindowError('📅 Slot must be within ' + formData.tokenManagement.slotStartTime + ' - ' + formData.tokenManagement.slotEndTime);
      return false;
    }

    const newWindow = { start, end, maxTokens: tokenValue };
    const existingWindows = [...formData.tokenManagement.slotWindows, newWindow];
    
    if (doSlotsOverlap(existingWindows)) {
      setSlotWindowError('🔄 Slot windows cannot overlap');
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

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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

    if (name.includes('maxDailyServiceTokens') || 
        name.includes('maxTokensPerSlot') || 
        name.includes('timeBtwEverySlot')) {
      handleNumericChange(e);
      return;
    }

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

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.serviceCode.trim()) {
      newErrors.serviceCode = 'Service code is required';
    }

    if (!isValidTimeRange(formData.tokenManagement.slotStartTime, formData.tokenManagement.slotEndTime)) {
      newErrors.timeRange = 'End time must be after start time';
    }

    if (formData.tokenManagement.maxDailyServiceTokens !== '') {
      const maxDaily = parseInt(formData.tokenManagement.maxDailyServiceTokens);
      if (isNaN(maxDaily) || maxDaily < 0) {
        newErrors.maxDailyServiceTokens = 'Must be 0 or more';
      }
    }

    const maxPerSlot = parseInt(formData.tokenManagement.maxTokensPerSlot);
    if (isNaN(maxPerSlot) || maxPerSlot <= 0) {
      newErrors.maxTokensPerSlot = 'Must be at least 1';
    }

    const timeBetween = parseInt(formData.tokenManagement.timeBtwEverySlot);
    if (isNaN(timeBetween) || timeBetween <= 0) {
      newErrors.timeBtwEverySlot = 'Must be at least 1 minute';
    }

    if (formData.tokenManagement.slotWindows.length > 0) {
      if (doSlotsOverlap(formData.tokenManagement.slotWindows)) {
        newErrors.slotWindows = 'Slot windows cannot overlap';
      }

      const invalidWindows = formData.tokenManagement.slotWindows.filter(
        w => !isWithinGlobalHours(w.start, w.end, formData.tokenManagement.slotStartTime, formData.tokenManagement.slotEndTime)
      );
      if (invalidWindows.length > 0) {
        newErrors.slotWindows = 'All slots must be within operating hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

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
    const baseClass = "w-full px-3 py-2 bg-slate-800/50 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all";
    const hasError = errors[fieldName] && touched[fieldName];
    const isValid = !errors[fieldName] && touched[fieldName] && formData[fieldName];
    
    if (hasError) {
      return `${baseClass} border-red-500/50 focus:ring-red-500/50 focus:border-red-500`;
    }
    if (isValid) {
      return `${baseClass} border-emerald-500/30 focus:ring-emerald-500/50 focus:border-emerald-500`;
    }
    return `${baseClass} border-slate-700 focus:ring-blue-500/50 focus:border-blue-500`;
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => navigate(`/manage/departments/${deptId}/services`)}
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                aria-label="Back"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-slate-100 truncate leading-tight">
                  {isEditMode ? 'Edit Service' : 'New Service'}
                </h1>
                <p className="text-xs text-slate-500 truncate">
                  {currentDepartment?.name || 'Department'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Error Summary - Mobile Friendly */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">Please fix the following:</span>
            </div>
            <ul className="space-y-1">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key} className="text-xs text-red-400/90 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-400/50 mt-1.5 shrink-0" />
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Info Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <FiSettings className="w-4 h-4 text-blue-400" />
              Basic Information
            </h2>
            
            <div className="space-y-3">
              {/* Service Name */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Service Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  className={getInputClassName('name')}
                  placeholder="e.g., Birth Certificate"
                  data-error={errors.name && touched.name}
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Service Code */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Service Code <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="serviceCode"
                  value={formData.serviceCode}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('serviceCode')}
                  className={getInputClassName('serviceCode') + " uppercase"}
                  placeholder="e.g., BCI001"
                  data-error={errors.serviceCode && touched.serviceCode}
                />
                {errors.serviceCode && touched.serviceCode && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.serviceCode}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Brief description of the service..."
                />
              </div>
            </div>
          </div>

          {/* Service Settings */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-blue-400" />
              Service Settings
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                <input
                  type="checkbox"
                  name="priorityAllowed"
                  checked={formData.priorityAllowed}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-sm text-slate-300">Allow Priority Tokens</span>
              </label>
              
              <label className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                <input
                  type="checkbox"
                  name="isDocumentUploadRequired"
                  checked={formData.isDocumentUploadRequired}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/50"
                />
                <span className="text-sm text-slate-300">Require Document Upload</span>
              </label>
            </div>
          </div>

          {/* Token Management */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <FiClock className="w-4 h-4 text-blue-400" />
              Token Management
            </h2>
            
            <div className="space-y-3">
              {/* Max Daily Tokens */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Max Daily Tokens
                </label>
                <input
                  type="number"
                  name="tokenManagement.maxDailyServiceTokens"
                  value={formData.tokenManagement.maxDailyServiceTokens}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('maxDailyServiceTokens')}
                  min="0"
                  className={getInputClassName('maxDailyServiceTokens')}
                  placeholder="Leave empty for unlimited"
                />
                {errors.maxDailyServiceTokens && touched.maxDailyServiceTokens && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.maxDailyServiceTokens}
                  </p>
                )}
              </div>

              {/* Max Tokens Per Slot */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Max Tokens Per Slot <span className="text-blue-400">*</span>
                </label>
                <input
                  type="number"
                  name="tokenManagement.maxTokensPerSlot"
                  value={formData.tokenManagement.maxTokensPerSlot}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('maxTokensPerSlot')}
                  min="1"
                  className={getInputClassName('maxTokensPerSlot')}
                />
                {errors.maxTokensPerSlot && touched.maxTokensPerSlot && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.maxTokensPerSlot}
                  </p>
                )}
              </div>

              {/* Queue Type */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Queue Type
                </label>
                <select
                  name="tokenManagement.queueType"
                  value={formData.tokenManagement.queueType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Token" className="bg-slate-800">Online</option>
                  <option value="Slot" className="bg-slate-800">Offline</option>
                  <option value="Hybrid" className="bg-slate-800">Hybrid</option>
                </select>
              </div>

              {/* Time Between Slots */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Time Between Slots (minutes) <span className="text-blue-400">*</span>
                </label>
                <input
                  type="number"
                  name="tokenManagement.timeBtwEverySlot"
                  value={formData.tokenManagement.timeBtwEverySlot}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('timeBtwEverySlot')}
                  min="1"
                  className={getInputClassName('timeBtwEverySlot')}
                />
                {errors.timeBtwEverySlot && touched.timeBtwEverySlot && (
                  <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.timeBtwEverySlot}
                  </p>
                )}
              </div>

              {/* Operating Hours */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Start Time <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="time"
                    name="tokenManagement.slotStartTime"
                    value={formData.tokenManagement.slotStartTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    End Time <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="time"
                    name="tokenManagement.slotEndTime"
                    value={formData.tokenManagement.slotEndTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              {errors.timeRange && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.timeRange}
                </p>
              )}
            </div>

            {/* Slot Windows */}
            <div className="mt-4">
              <h3 className="text-xs font-medium text-slate-300 mb-3">Slot Windows</h3>
              
              {errors.slotWindows && (
                <p className="mb-2 text-xs text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.slotWindows}
                </p>
              )}

              {/* Add Slot Window */}
              <div className="space-y-2 mb-3">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="time"
                    value={slotWindow.start}
                    onChange={(e) => setSlotWindow(prev => ({ ...prev, start: e.target.value }))}
                    className="px-2 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Start"
                  />
                  <input
                    type="time"
                    value={slotWindow.end}
                    onChange={(e) => setSlotWindow(prev => ({ ...prev, end: e.target.value }))}
                    className="px-2 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="End"
                  />
                  <input
                    type="number"
                    value={slotWindow.maxTokens}
                    onChange={(e) => setSlotWindow(prev => ({ ...prev, maxTokens: e.target.value }))}
                    min="1"
                    className="px-2 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Max"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleAddSlotWindow}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/30 transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  Add Slot Window
                </button>
                
                {slotWindowError && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {slotWindowError}
                  </p>
                )}
              </div>

              {/* Slot Windows List */}
              {formData.tokenManagement.slotWindows.length > 0 && (
                <div className="space-y-2">
                  {formData.tokenManagement.slotWindows.map((window, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/30 border border-slate-700/50 rounded-lg p-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-300">{window.start} - {window.end}</span>
                        <span className="text-xs text-slate-500">max {window.maxTokens}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlotWindow(index)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-blue-400" />
              Required Documents
            </h2>

            {/* Add Document */}
            <div className="space-y-2 mb-3">
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  value={requiredDoc.name}
                  onChange={(e) => setRequiredDoc(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Document name (e.g., Aadhaar Card)"
                />
                <input
                  type="text"
                  value={requiredDoc.description}
                  onChange={(e) => setRequiredDoc(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Description (optional)"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={requiredDoc.isMandatory}
                    onChange={(e) => setRequiredDoc(prev => ({ ...prev, isMandatory: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-xs text-slate-400">Mandatory</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleAddRequiredDoc}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/30 transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  Add Document
                </button>
              </div>
            </div>

            {/* Documents List */}
            {formData.requiredDocs.length > 0 && (
              <div className="space-y-2">
                {formData.requiredDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/30 border border-slate-700/50 rounded-lg p-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-300 truncate">{doc.name}</span>
                        {doc.isMandatory && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-400 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-xs text-slate-500 truncate">{doc.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequiredDoc(index)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded ml-2"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/manage/departments/${deptId}/services`)}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;