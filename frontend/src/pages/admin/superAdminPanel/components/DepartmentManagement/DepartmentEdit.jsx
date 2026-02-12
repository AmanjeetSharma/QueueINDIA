import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDepartment } from '../../../../../context/DepartmentContext';
import { useAuth } from '../../../../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
    FaArrowLeft, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt,
    FaClock, FaCalendarAlt, FaWheelchair, FaFemale, FaUserClock,
    FaSave, FaTimes, FaPlus, FaTrash, FaCheck, FaExclamationTriangle,
    FaBuilding, FaInfoCircle, FaToggleOn, FaToggleOff, FaEdit, FaChevronDown
} from 'react-icons/fa';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DepartmentEdit = () => {
    const { deptId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        getDepartmentById,
        updateDepartment,
        currentDepartment,
        loading: deptLoading
    } = useDepartment();

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [workingHours, setWorkingHours] = useState([]);
    const [pendingChanges, setPendingChanges] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [mobileTabsOpen, setMobileTabsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { register, handleSubmit, watch, setValue, getValues, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            departmentCategory: '',
            status: 'active',
            isSlotBookingEnabled: true,
            bookingWindowDays: 15,
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
            priorityCriteria: {
                seniorCitizenAge: 60,
                allowPregnantWomen: true,
                allowDifferentlyAbled: true
            }
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMobileTabsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch department data
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                setLoading(true);
                const response = await getDepartmentById(deptId);
                const data = response.data;
                setInitialData(data);

                reset({
                    name: data.name || '',
                    departmentCategory: data.departmentCategory || '',
                    status: data.status || 'active',
                    isSlotBookingEnabled: data.isSlotBookingEnabled ?? true,
                    bookingWindowDays: data.bookingWindowDays || 15,
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        district: data.address?.district || '',
                        state: data.address?.state || '',
                        pincode: data.address?.pincode || ''
                    },
                    contact: {
                        phone: data.contact?.phone || '',
                        email: data.contact?.email || '',
                        website: data.contact?.website || ''
                    },
                    priorityCriteria: {
                        seniorCitizenAge: data.priorityCriteria?.seniorCitizenAge || 60,
                        allowPregnantWomen: data.priorityCriteria?.allowPregnantWomen ?? true,
                        allowDifferentlyAbled: data.priorityCriteria?.allowDifferentlyAbled ?? true
                    }
                });

                if (data.workingHours?.length) {
                    setWorkingHours(data.workingHours);
                } else {
                    setWorkingHours(DAYS.map(day => ({
                        day,
                        isClosed: day === 'Sun',
                        openTime: '09:00',
                        closeTime: '17:00'
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch department:', error);
                navigate('/departments');
            } finally {
                setLoading(false);
            }
        };

        if (deptId) {
            fetchDepartment();
        }
    }, [deptId, reset, navigate]);

    // Track form changes
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (type === 'change' && initialData) {
                const changes = {};
                let hasSignificantChanges = false;

                if (value.name !== initialData.name) {
                    changes.name = value.name;
                    hasSignificantChanges = true;
                }
                if (value.departmentCategory !== initialData.departmentCategory) {
                    changes.departmentCategory = value.departmentCategory;
                    hasSignificantChanges = true;
                }
                if (value.status !== initialData.status) {
                    changes.status = value.status;
                    hasSignificantChanges = true;
                }
                if (value.isSlotBookingEnabled !== initialData.isSlotBookingEnabled) {
                    changes.isSlotBookingEnabled = value.isSlotBookingEnabled;
                    hasSignificantChanges = true;
                }
                if (Number(value.bookingWindowDays) !== Number(initialData.bookingWindowDays)) {
                    changes.bookingWindowDays = Number(value.bookingWindowDays);
                    hasSignificantChanges = true;
                }

                if (JSON.stringify(value.address) !== JSON.stringify(initialData.address)) {
                    changes.address = value.address;
                    hasSignificantChanges = true;
                }

                if (JSON.stringify(value.contact) !== JSON.stringify(initialData.contact)) {
                    changes.contact = value.contact;
                    hasSignificantChanges = true;
                }

                if (JSON.stringify(value.priorityCriteria) !== JSON.stringify(initialData.priorityCriteria)) {
                    changes.priorityCriteria = {
                        seniorCitizenAge: Number(value.priorityCriteria?.seniorCitizenAge) || 60,
                        allowPregnantWomen: value.priorityCriteria?.allowPregnantWomen ?? true,
                        allowDifferentlyAbled: value.priorityCriteria?.allowDifferentlyAbled ?? true
                    };
                    hasSignificantChanges = true;
                }

                if (JSON.stringify(workingHours) !== JSON.stringify(initialData.workingHours)) {
                    changes.workingHours = workingHours;
                    hasSignificantChanges = true;
                }

                setPendingChanges(changes);
                setHasChanges(hasSignificantChanges);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, initialData, workingHours]);

    const handleWorkingHourChange = (index, field, value) => {
        setWorkingHours(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            if (field === 'isClosed' && value === true) {
                updated[index].openTime = '';
                updated[index].closeTime = '';
            }

            return updated;
        });
    };

    const validateWorkingHours = () => {
        for (const wh of workingHours) {
            if (!wh.isClosed && (!wh.openTime || !wh.closeTime)) {
                toast.error(`Open and close times are required for ${wh.day}`);
                return false;
            }

            if (!wh.isClosed && wh.openTime >= wh.closeTime) {
                toast.error(`Close time must be after open time for ${wh.day}`);
                return false;
            }
        }
        return true;
    };

    const onSubmit = async (formData) => {
        if (!validateWorkingHours()) {
            return;
        }

        try {
            setLoading(true);

            const updatePayload = {
                ...pendingChanges,
                workingHours
            };

            if (Object.keys(updatePayload).length === 0) {
                toast.info('No changes to save');
                return;
            }

            await updateDepartment(deptId, updatePayload);

            setTimeout(() => {
                navigate(`/super-admin-panel/departments`);
            }, 1500);

        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                navigate(`/super-admin-panel/departments`);
            }
        } else {
            navigate(`/super-admin-panel/departments`);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic', shortLabel: 'Info', icon: FaBuilding },
        { id: 'address', label: 'Address', shortLabel: 'Addr', icon: FaMapMarkerAlt },
        { id: 'hours', label: 'Hours', shortLabel: 'Hrs', icon: FaClock },
        { id: 'priority', label: 'Priority', shortLabel: 'Prio', icon: FaUserClock },
        { id: 'settings', label: 'Settings', shortLabel: 'Set', icon: FaCalendarAlt }
    ];

    const departmentData = currentDepartment || initialData;

    if (deptLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading department details...</p>
                </div>
            </div>
        );
    }

    if (!departmentData) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaInfoCircle className="text-4xl text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Department Not Found</h2>
                    <p className="text-slate-400 mb-6">The department you're looking for doesn't exist or has been moved.</p>
                    <button
                        onClick={() => navigate('/departments')}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                        <FaArrowLeft /> Back to Departments
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pb-24 md:pb-0">
            {/* Header */}
            <div className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleCancel}
                                className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all flex-shrink-0"
                            >
                                <FaArrowLeft className="text-sm" />
                            </motion.button>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2 truncate">
                                    <FaEdit className="text-blue-400 flex-shrink-0" />
                                    <span className="hidden xs:inline">Edit Department</span>
                                    <span className="xs:hidden">Edit</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">
                                    {departmentData.name}
                                </p>
                            </div>
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="hidden sm:flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all border border-slate-600"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit(onSubmit)}
                                disabled={!hasChanges || loading}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${hasChanges && !loading
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>Save</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {/* Status Bar */}
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-400 text-xs sm:text-sm"
                        >
                            <FaExclamationTriangle className="flex-shrink-0" />
                            <p>You have unsaved changes.</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Mobile Tab Buttons */}
                <div className="md:hidden mb-4 relative" ref={dropdownRef}>
                    <motion.button
                        onClick={() => setMobileTabsOpen(!mobileTabsOpen)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-medium flex items-center justify-between hover:bg-slate-750 transition-colors relative z-20"
                    >
                        <span className="flex items-center gap-2">
                            {tabs.find(t => t.id === activeTab)?.icon &&
                                (() => {
                                    const Icon = tabs.find(t => t.id === activeTab).icon;
                                    return <Icon className="text-blue-400" />;
                                })()
                            }
                            {tabs.find(t => t.id === activeTab)?.label}
                        </span>
                        <motion.div
                            animate={{ rotate: mobileTabsOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaChevronDown />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {mobileTabsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-50 shadow-xl"
                                style={{
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                {tabs.map((tab, index) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setMobileTabsOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left border-b border-slate-700 last:border-b-0 flex items-center gap-3 transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-600/20 text-blue-400'
                                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                            }`}
                                        whileHover={{ x: 4 }}
                                    >
                                        <tab.icon className="flex-shrink-0" />
                                        <span className="font-medium">{tab.label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar Tabs */}
                    <div className="hidden md:block lg:w-56 flex-shrink-0">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-2 sticky top-24">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1 last:mb-0 text-sm ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                        }`}
                                >
                                    <tab.icon className="text-base flex-shrink-0" />
                                    <span className="font-medium">{tab.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 sm:p-6"
                        >
                            {/* Basic Information */}
                            {activeTab === 'basic' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Basic Information</h2>
                                        <p className="text-xs sm:text-sm text-slate-400">Edit the department's basic details</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                Department Name
                                            </label>
                                            <input
                                                {...register('name', { required: 'Department name is required' })}
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                placeholder="Enter department name"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                Department Category
                                            </label>
                                            <input
                                                {...register('departmentCategory', { required: 'Department category is required' })}
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                placeholder="e.g., Municipal, Transport, Health"
                                            />
                                            {errors.departmentCategory && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.departmentCategory.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                Status
                                            </label>
                                            <select
                                                {...register('status')}
                                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Address & Contact */}
                            {activeTab === 'address' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Address & Contact</h2>
                                        <p className="text-xs sm:text-sm text-slate-400">Update department location and contact details</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Address Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-blue-400 flex-shrink-0" />
                                                Address
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                        Street Address
                                                    </label>
                                                    <input
                                                        {...register('address.street')}
                                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        placeholder="Street address"
                                                    />
                                                </div>

                                                {[
                                                    { field: 'city', label: 'City' },
                                                    { field: 'district', label: 'District' },
                                                    { field: 'state', label: 'State' },
                                                    { field: 'pincode', label: 'Pincode' }
                                                ].map(({ field, label }) => (
                                                    <div key={field}>
                                                        <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                            {label}
                                                        </label>
                                                        <input
                                                            {...register(`address.${field}`)}
                                                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                            placeholder={label}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contact Section */}
                                        <div className="space-y-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                                                <FaPhone className="text-blue-400 flex-shrink-0" />
                                                Contact Information
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        {...register('contact.phone')}
                                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        placeholder="Phone number"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        {...register('contact.email')}
                                                        type="email"
                                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        placeholder="Email address"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                        Website
                                                    </label>
                                                    <input
                                                        {...register('contact.website')}
                                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Working Hours */}
                            {activeTab === 'hours' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Working Hours</h2>
                                        <p className="text-xs sm:text-sm text-slate-400">Set the department's operating hours</p>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        {workingHours.map((schedule, index) => (
                                            <motion.div
                                                key={schedule.day}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-slate-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                                    <div className="w-14 sm:w-16 flex-shrink-0">
                                                        <span className="text-base sm:text-lg font-semibold text-white">{schedule.day}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!schedule.isClosed}
                                                                onChange={(e) => handleWorkingHourChange(index, 'isClosed', !e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                            <span className="ms-2 text-xs sm:text-sm font-medium text-slate-300">
                                                                {schedule.isClosed ? 'Closed' : 'Open'}
                                                            </span>
                                                        </label>
                                                    </div>

                                                    {!schedule.isClosed && (
                                                        <div className="flex items-center gap-1 sm:gap-2 ml-auto sm:ml-0">
                                                            <input
                                                                type="time"
                                                                value={schedule.openTime || ''}
                                                                onChange={(e) => handleWorkingHourChange(index, 'openTime', e.target.value)}
                                                                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <span className="text-slate-500 text-xs sm:text-sm">to</span>
                                                            <input
                                                                type="time"
                                                                value={schedule.closeTime || ''}
                                                                onChange={(e) => handleWorkingHourChange(index, 'closeTime', e.target.value)}
                                                                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Priority Access */}
                            {activeTab === 'priority' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Priority Access Settings</h2>
                                        <p className="text-xs sm:text-sm text-slate-400">Configure priority access for special categories</p>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        {/* Senior Citizens */}
                                        <div className="bg-slate-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                                            <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaUserClock className="text-blue-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-base sm:text-lg font-semibold text-white">Senior Citizens</h3>
                                                        <p className="text-xs sm:text-sm text-slate-400">Age threshold for priority</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="max-w-xs">
                                                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                    Senior Citizen Age
                                                </label>
                                                <input
                                                    {...register('priorityCriteria.seniorCitizenAge', {
                                                        valueAsNumber: true,
                                                        min: { value: 50, message: 'Minimum age is 50' },
                                                        max: { value: 100, message: 'Maximum age is 100' }
                                                    })}
                                                    type="number"
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                />
                                                {errors.priorityCriteria?.seniorCitizenAge && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.priorityCriteria.seniorCitizenAge.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Pregnant Women & Differently Abled */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="bg-slate-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaFemale className="text-pink-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm sm:text-lg font-semibold text-white">Pregnant Women</h3>
                                                        <p className="text-xs text-slate-400">Enable priority access</p>
                                                    </div>
                                                </div>

                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        {...register('priorityCriteria.allowPregnantWomen')}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ms-3 text-xs sm:text-sm font-medium text-slate-300">
                                                        {watch('priorityCriteria.allowPregnantWomen') ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="bg-slate-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaWheelchair className="text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm sm:text-lg font-semibold text-white">Differently Abled</h3>
                                                        <p className="text-xs text-slate-400">Enable priority access</p>
                                                    </div>
                                                </div>

                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        {...register('priorityCriteria.allowDifferentlyAbled')}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ms-3 text-xs sm:text-sm font-medium text-slate-300">
                                                        {watch('priorityCriteria.allowDifferentlyAbled') ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Booking Settings */}
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Booking Settings</h2>
                                        <p className="text-xs sm:text-sm text-slate-400">Configure slot booking preferences</p>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        {/* Online Slot Booking */}
                                        <div className="bg-slate-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-white">Online Slot Booking</h3>
                                                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Enable or disable online appointment booking</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                                    <input
                                                        {...register('isSlotBookingEnabled')}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-12 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ms-3 text-xs sm:text-sm font-medium text-slate-300">
                                                        {watch('isSlotBookingEnabled') ? (
                                                            <span className="text-green-400">Enabled</span>
                                                        ) : (
                                                            <span className="text-slate-400">Disabled</span>
                                                        )}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Booking Window */}
                                        <div className="bg-slate-900/30 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FaCalendarAlt className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-white">Booking Window</h3>
                                                    <p className="text-xs sm:text-sm text-slate-400">Advance booking days</p>
                                                </div>
                                            </div>

                                            <div className="max-w-xs">
                                                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                                                    Booking Window (days)
                                                </label>
                                                <input
                                                    {...register('bookingWindowDays', {
                                                        valueAsNumber: true,
                                                        min: { value: 1, message: 'Minimum 1 day' },
                                                        max: { value: 30, message: 'Maximum 30 days' }
                                                    })}
                                                    type="number"
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-700 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                />
                                                {errors.bookingWindowDays && (
                                                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.bookingWindowDays.message}</p>
                                                )}
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Citizens can book up to {watch('bookingWindowDays') || 15} days in advance
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Save Bar - Fixed at bottom */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-xl border-t border-slate-700 p-3 sm:hidden"
            >
                <div className="flex items-center gap-2 max-w-7xl mx-auto">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!hasChanges || loading}
                        className={`flex-1 px-3 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${hasChanges && !loading
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FaSave className="text-xs" />
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default DepartmentEdit;