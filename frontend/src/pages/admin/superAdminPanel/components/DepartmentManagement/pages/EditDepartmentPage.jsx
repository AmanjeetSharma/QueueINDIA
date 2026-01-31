// pages/EditDepartmentPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MdSave, 
  MdCancel, 
  MdInfo, 
  MdLocationOn, 
  MdPhone, 
  MdEmail, 
  MdPublic,
  MdAccessTime,
  MdDescription,
  MdCategory,
  MdBusiness
} from "react-icons/md";
import toast from 'react-hot-toast';

const EditDepartmentPage = ({ department, onSave, onCancel, loading }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    departmentCategory: '',
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: ''
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    workingHours: [
      { day: 'Mon', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Tue', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Wed', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Thu', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Fri', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Sat', isClosed: false, openTime: '09:00', closeTime: '17:00' },
      { day: 'Sun', isClosed: true }
    ],
    services: [],
    tokenManagement: {
      maxDailyServiceTokens: null,
      maxTokensPerSlot: 10,
      queueType: 'Hybrid',
      timeBtwEverySlot: 15,
      slotStartTime: '10:00',
      slotEndTime: '17:00',
      slotWindows: []
    },
    isSlotBookingEnabled: true,
    bookingWindowDays: 7,
    priorityCriteria: {
      seniorCitizenAge: 60,
      allowPregnantWomen: true,
      allowDifferentlyAbled: true
    },
    status: 'active'
  });

  // Initialize form with department data
  useEffect(() => {
    if (department) {
      console.log('Initializing with department data:', department);
      setFormData({
        departmentCategory: department.departmentCategory || department.category || '',
        name: department.name || '',
        description: department.description || '',
        address: {
          street: department.address?.street || '',
          city: department.address?.city || department.location?.city || '',
          district: department.address?.district || '',
          state: department.address?.state || department.location?.state || '',
          pincode: department.address?.pincode || department.location?.pincode || ''
        },
        contact: {
          phone: department.contact?.phone || '',
          email: department.contact?.email || '',
          website: department.contact?.website || ''
        },
        workingHours: department.workingHours || [
          { day: 'Mon', isClosed: false, openTime: '09:00', closeTime: '17:00' },
          { day: 'Tue', isClosed: false, openTime: '09:00', closeTime: '17:00' },
          { day: 'Wed', isClosed: false, openTime: '09:00', closeTime: '17:00' },
          { day: 'Thu', isClosed: false, openTime: '09:00', closeTime: '17:00' },
          { day: 'Fri', isClosed: false, openTime: '09:00', closeTime: '17:00' },
          { day: 'Sat', isClosed: false, openTime: '09:00', closeTime: '17:00' },
          { day: 'Sun', isClosed: true }
        ],
        services: department.services || [],
        tokenManagement: department.tokenManagement || {
          maxDailyServiceTokens: null,
          maxTokensPerSlot: 10,
          queueType: 'Hybrid',
          timeBtwEverySlot: 15,
          slotStartTime: '10:00',
          slotEndTime: '17:00',
          slotWindows: []
        },
        isSlotBookingEnabled: department.isSlotBookingEnabled !== undefined ? department.isSlotBookingEnabled : true,
        bookingWindowDays: department.bookingWindowDays || 7,
        priorityCriteria: department.priorityCriteria || {
          seniorCitizenAge: 60,
          allowPregnantWomen: true,
          allowDifferentlyAbled: true
        },
        status: department.status || 'active'
      });
    }
  }, [department]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => {
      if (section.includes('.')) {
        const [parent, child] = section.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: field ? {
              ...prev[parent][child],
              [field]: value
            } : value
          }
        };
      }
      return {
        ...prev,
        [section]: field ? {
          ...prev[section],
          [field]: value
        } : value
      };
    });
  };

  const handleWorkingHoursChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.map((wh, i) => 
        i === index ? { ...wh, [field]: value } : wh
      )
    }));
  };

  const handlePriorityCriteriaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      priorityCriteria: {
        ...prev.priorityCriteria,
        [field]: value
      }
    }));
  };

  const handleTokenManagementChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      tokenManagement: {
        ...prev.tokenManagement,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.departmentCategory.trim()) {
      toast.error('Department category is required');
      return false;
    }
    
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return false;
    }
    
    if (!formData.address.street.trim()) {
      toast.error('Street address is required');
      return false;
    }
    
    if (!formData.address.city.trim()) {
      toast.error('City is required');
      return false;
    }
    
    if (!formData.address.state.trim()) {
      toast.error('State is required');
      return false;
    }
    
    if (!formData.address.pincode.trim()) {
      toast.error('Pincode is required');
      return false;
    }

    // Validate working hours
    for (const wh of formData.workingHours) {
      if (!wh.isClosed && (!wh.openTime || !wh.closeTime)) {
        toast.error(`Open and close times are required for ${wh.day} when not closed`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare data for API - only send updated fields
      const updateData = {
        departmentCategory: formData.departmentCategory,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        contact: formData.contact,
        workingHours: formData.workingHours,
        tokenManagement: formData.tokenManagement,
        isSlotBookingEnabled: formData.isSlotBookingEnabled,
        bookingWindowDays: formData.bookingWindowDays,
        priorityCriteria: formData.priorityCriteria,
        status: formData.status
      };
      
      await onSave(updateData);
    } catch (error) {
      console.error('Update department error:', error);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <MdInfo /> },
    { id: 'address', label: 'Address', icon: <MdLocationOn /> },
    { id: 'contact', label: 'Contact', icon: <MdPhone /> },
    { id: 'workingHours', label: 'Working Hours', icon: <MdAccessTime /> },
    { id: 'settings', label: 'Settings', icon: <MdPublic /> }
  ];

  const daysOfWeek = [
    { id: 'Mon', label: 'Monday' },
    { id: 'Tue', label: 'Tuesday' },
    { id: 'Wed', label: 'Wednesday' },
    { id: 'Thu', label: 'Thursday' },
    { id: 'Fri', label: 'Friday' },
    { id: 'Sat', label: 'Saturday' },
    { id: 'Sun', label: 'Sunday' }
  ];

  const queueTypes = [
    { value: 'Online', label: 'Online Only' },
    { value: 'Offline', label: 'Offline Only' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

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
        <h3 className="text-lg font-semibold text-gray-900">Editing: {department.name}</h3>
        <p className="text-sm text-gray-600">Update department details and configuration</p>
        <div className="mt-2 text-xs text-gray-500">
          <p>ID: {department._id}</p>
          {department.category && <p>Category: {department.category}</p>}
          <p>Status: <span className={`px-2 py-1 rounded-full ${department.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {department.status || 'active'}
          </span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto space-x-2" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Category *
              </label>
              <input
                type="text"
                value={formData.departmentCategory}
                onChange={(e) => handleInputChange('departmentCategory', null, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Municipal Services, Healthcare, Education"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', null, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Leh Municipal Citizen Services Office"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', null, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
                placeholder="Describe the department's purpose, services offered, and any important information..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', null, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isSlotBookingEnabled}
                    onChange={(e) => handleInputChange('isSlotBookingEnabled', null, e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Slot Booking</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Allow token booking for this department</p>
              </div>
            </div>
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mumbai"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={formData.address.district}
                  onChange={(e) => handleInputChange('address', 'district', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mumbai City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Maharashtra"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="400001"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="department@example.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.contact.website}
                  onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Working Hours Tab */}
        {activeTab === 'workingHours' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Working Hours Configuration</h3>
            <p className="text-sm text-gray-600 mb-4">Configure working hours for each day of the week</p>
            
            <div className="space-y-4">
              {daysOfWeek.map((day, index) => {
                const workingHour = formData.workingHours.find(wh => wh.day === day.id) || 
                  { day: day.id, isClosed: false, openTime: '09:00', closeTime: '17:00' };
                
                return (
                  <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{day.label}</h4>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={workingHour.isClosed}
                          onChange={(e) => {
                            const whIndex = formData.workingHours.findIndex(wh => wh.day === day.id);
                            if (whIndex !== -1) {
                              handleWorkingHoursChange(whIndex, 'isClosed', e.target.checked);
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                workingHours: [
                                  ...prev.workingHours,
                                  { day: day.id, isClosed: e.target.checked, openTime: '09:00', closeTime: '17:00' }
                                ]
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Closed</span>
                      </label>
                    </div>
                    
                    {!workingHour.isClosed && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opening Time *
                          </label>
                          <input
                            type="time"
                            value={workingHour.openTime}
                            onChange={(e) => {
                              const whIndex = formData.workingHours.findIndex(wh => wh.day === day.id);
                              if (whIndex !== -1) {
                                handleWorkingHoursChange(whIndex, 'openTime', e.target.value);
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required={!workingHour.isClosed}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Closing Time *
                          </label>
                          <input
                            type="time"
                            value={workingHour.closeTime}
                            onChange={(e) => {
                              const whIndex = formData.workingHours.findIndex(wh => wh.day === day.id);
                              if (whIndex !== -1) {
                                handleWorkingHoursChange(whIndex, 'closeTime', e.target.value);
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required={!workingHour.isClosed}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token Management Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Token Management</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Queue Type
                  </label>
                  <select
                    value={formData.tokenManagement.queueType}
                    onChange={(e) => handleTokenManagementChange('queueType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {queueTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens Per Slot
                  </label>
                  <input
                    type="number"
                    value={formData.tokenManagement.maxTokensPerSlot}
                    onChange={(e) => handleTokenManagementChange('maxTokensPerSlot', parseInt(e.target.value) || 10)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="1"
                    placeholder="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Between Slots (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.tokenManagement.timeBtwEverySlot}
                    onChange={(e) => handleTokenManagementChange('timeBtwEverySlot', parseInt(e.target.value) || 15)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="1"
                    placeholder="15"
                  />
                </div>
              </div>
              
              {/* Booking Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Booking Settings</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Window Days
                  </label>
                  <input
                    type="number"
                    value={formData.bookingWindowDays}
                    onChange={(e) => handleInputChange('bookingWindowDays', null, parseInt(e.target.value) || 7)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="1"
                    max="30"
                    placeholder="7"
                  />
                  <p className="text-xs text-gray-500 mt-1">How many days in advance can tokens be booked (1-30)</p>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Priority Criteria</h5>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senior Citizen Age
                    </label>
                    <input
                      type="number"
                      value={formData.priorityCriteria.seniorCitizenAge}
                      onChange={(e) => handlePriorityCriteriaChange('seniorCitizenAge', parseInt(e.target.value) || 60)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      min="0"
                      placeholder="60"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.priorityCriteria.allowPregnantWomen}
                      onChange={(e) => handlePriorityCriteriaChange('allowPregnantWomen', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Allow priority for pregnant women</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.priorityCriteria.allowDifferentlyAbled}
                      onChange={(e) => handlePriorityCriteriaChange('allowDifferentlyAbled', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Allow priority for differently-abled</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h4 className="font-medium text-yellow-900 mb-2">Services Information</h4>
              <p className="text-sm text-yellow-700">
                This department currently has {formData.services?.length || 0} services configured.
                Services can be managed separately through the "Services" tab on the department dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (tabIndex > 0) setActiveTab(tabs[tabIndex - 1].id);
                }}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <MdCancel />
              Cancel
            </button>
            
            {activeTab !== 'settings' ? (
              <button
                type="button"
                onClick={() => {
                  const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (tabIndex < tabs.length - 1) setActiveTab(tabs[tabIndex + 1].id);
                }}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EditDepartmentPage;