import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartment } from '../../../../../context/DepartmentContext';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiBarChart2,
    FiUsers,
    FiSettings,
    FiMapPin,
    FiPhone,
    FiMail,
    FiGlobe,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiStar,
    FiBriefcase
} from 'react-icons/fi';
import {
    FaBuilding,
    FaRegBuilding,
    FaListAlt,
    FaUserTie,
    FaChartLine,
    FaClipboardList,
    FaCog,
    FaClock,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaMapMarkerAlt,
    FaTag,
    FaBoxes
} from 'react-icons/fa';
import { MdQueue, MdAnalytics, MdDashboard, MdPeople, MdEvent } from 'react-icons/md';
import { BsPeopleFill, BsCalendarCheck, BsGraphUp } from 'react-icons/bs';

const ManageDepartmentWork = () => {
    const navigate = useNavigate();
    const { deptId } = useParams();
    const { getDepartmentById, loading: departmentLoading } = useDepartment();

    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (deptId) {
            fetchDepartmentDetails();
        }
    }, [deptId]);

    const fetchDepartmentDetails = async () => {
        try {
            setLoading(true);
            const response = await getDepartmentById(deptId);

            // Extract the actual department data from response.data
            const departmentData = response?.data || response;
            setDepartment(departmentData);
        } catch (error) {
            console.error('Failed to fetch department:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats from actual department data
    const getDepartmentStats = () => {
        if (!department) return {};

        return {
            totalServices: department.services?.length || 0,
            totalAdmins: department.admins?.length || 0,
            totalOfficers: department.departmentOfficers?.length || 0,
            totalStaff: (department.admins?.length || 0) + (department.departmentOfficers?.length || 0),
            isSlotBookingEnabled: department.isSlotBookingEnabled || false,
            bookingWindowDays: department.bookingWindowDays || 0
        };
    };

    const managementOptions = [
        {
            id: 'bookings',
            title: 'All Bookings',
            description: 'View and manage all department bookings, appointments, and service requests',
            icon: BsCalendarCheck,
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/30',
            hoverBg: 'hover:bg-blue-500/20',
            path: `/department/bookings`,
            stats: '0',
            statLabel: 'Today\'s Bookings'
        },
        {
            id: 'queue',
            title: 'Live Queue',
            description: 'Monitor and manage real-time service queues, token system, and waiting times',
            icon: MdQueue,
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-400',
            borderColor: 'border-green-500/30',
            hoverBg: 'hover:bg-green-500/20',
            path: `/department/${deptId}/queue-services`,
            stats: '0',
            statLabel: 'Active in Queue'
        },
        {
            id: 'analytics',
            title: 'Analytics & Reports',
            description: 'View detailed analytics, performance metrics, and generate reports',
            icon: BsGraphUp,
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-400',
            borderColor: 'border-purple-500/30',
            hoverBg: 'hover:bg-purple-500/20',
            path: `/department/${deptId}/analytics`,
            stats: '12',
            statLabel: 'Reports Available'
        },
        {
            id: 'admins',
            title: 'Admins & Officers',
            description: 'Manage department administrators, officers, and staff permissions',
            icon: MdPeople,
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-400',
            borderColor: 'border-orange-500/30',
            hoverBg: 'hover:bg-orange-500/20',
            // path: `/department/${deptId}/manage-staff`,
            path: `/super-admin-panel/departments/${deptId}/manage-work`,
            stats: getDepartmentStats().totalStaff || 0,
            statLabel: 'Total Staff'
        }
    ];

    const getStatusBadge = (status) => {
        const config = {
            'active': { color: 'bg-green-500/20 text-green-300 border border-green-500/30', icon: FiCheckCircle },
            'inactive': { color: 'bg-gray-500/20 text-gray-300 border border-gray-500/30', icon: FiXCircle },
            'maintenance': { color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30', icon: FiAlertCircle }
        };

        const { color, icon: Icon } = config[status] || config.inactive;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                {Icon && <Icon className="w-3 h-3" />}
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    const formatAddress = (address) => {
        if (!address) return null;
        const parts = [
            address.street,
            address.city,
            address.district,
            address.state,
            address.pincode
        ].filter(Boolean);
        return parts.join(', ');
    };

    if (loading || departmentLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-4 sm:space-y-6">
                        <div className="h-7 sm:h-8 bg-slate-800 rounded-lg w-36 sm:w-48"></div>
                        <div className="h-28 sm:h-32 bg-slate-800/50 rounded-xl"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="h-36 sm:h-40 bg-slate-800/50 rounded-xl"></div>
                            <div className="h-36 sm:h-40 bg-slate-800/50 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!department) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 sm:p-12">
                        <FaBuilding className="w-14 h-14 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Department Not Found</h2>
                        <p className="text-sm sm:text-base text-slate-400 mb-5 sm:mb-6">The department you're looking for doesn't exist or you don't have access.</p>
                        <button
                            onClick={() => navigate('/super-admin-panel/departments')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                            <FiArrowLeft className="w-4 h-4 mr-2" />
                            Back to Departments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getDepartmentStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-3 sm:p-6 lg:p-8">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-5"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-5"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/super-admin-panel/departments')}
                    className="inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-white mb-4 sm:mb-6 transition-colors group"
                >
                    <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Departments
                </button>

                {/* Department Header - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8 backdrop-blur-sm"
                >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <FaBuilding className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1.5 sm:mb-2">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent truncate">
                                        {department.name}
                                    </h1>
                                    <div className="flex-shrink-0">
                                        {department.status && getStatusBadge(department.status)}
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-slate-400 mb-2 max-w-2xl truncate">
                                    {department.departmentCategory || 'No category specified'}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-slate-300">
                                        <FaTag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                        <span className="truncate max-w-[120px] sm:max-w-none">ID: {department.departmentSlug}</span>
                                    </span>

                                    {department.address && (
                                        <>
                                            <span className="text-slate-600 hidden sm:inline">•</span>
                                            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-slate-300 w-full sm:w-auto">
                                                <FiMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                                <span className="truncate text-xs sm:text-sm">{formatAddress(department.address)}</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats - Mobile Compact */}
                        <div className="flex items-center gap-2 sm:gap-3 justify-start lg:justify-end mt-2 lg:mt-0">
                            <div className="bg-slate-700/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                                <p className="text-xs text-slate-400">Services</p>
                                <p className="text-base sm:text-lg font-semibold text-white">{stats.totalServices}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                                <p className="text-xs text-slate-400">Staff</p>
                                <p className="text-base sm:text-lg font-semibold text-white">{stats.totalStaff}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
                                <p className="text-xs text-slate-400">Booking</p>
                                <p className="text-base sm:text-lg font-semibold text-white">
                                    {stats.isSlotBookingEnabled ?
                                        <span className="text-green-400 text-sm sm:text-base">{stats.bookingWindowDays}d</span> :
                                        <span className="text-yellow-400 text-sm sm:text-base">Off</span>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact & Priority Info Grid - Mobile Optimized */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {/* Contact Information */}
                    {(department.contact?.phone || department.contact?.email || department.contact?.website) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-800/30 border border-slate-700 rounded-xl p-3.5 sm:p-4 lg:col-span-2"
                        >
                            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2.5 sm:mb-3 flex items-center gap-1.5">
                                <FiSettings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                                {department.contact.phone && (
                                    <span className="inline-flex items-center gap-1.5 text-slate-400 truncate">
                                        <FiPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{department.contact.phone}</span>
                                    </span>
                                )}
                                {department.contact.email && (
                                    <span className="inline-flex items-center gap-1.5 text-slate-400 truncate">
                                        <FiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{department.contact.email}</span>
                                    </span>
                                )}
                                {department.contact.website && (
                                    <span className="inline-flex items-center gap-1.5 text-slate-400 truncate">
                                        <FiGlobe className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="truncate">{department.contact.website}</span>
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Priority Criteria */}
                    {department.priorityCriteria && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-slate-800/30 border border-slate-700 rounded-xl p-3.5 sm:p-4"
                        >
                            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2.5 sm:mb-3 flex items-center gap-1.5">
                                <FiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                                Priority Access
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                {department.priorityCriteria.seniorCitizenAge && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Senior Citizens</span>
                                        <span className="text-white font-medium">Age {department.priorityCriteria.seniorCitizenAge}+</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Pregnant Women</span>
                                    <span className={department.priorityCriteria.allowPregnantWomen ? 'text-green-400' : 'text-red-400'}>
                                        {department.priorityCriteria.allowPregnantWomen ? 'Allowed' : 'Not Allowed'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Differently Abled</span>
                                    <span className={department.priorityCriteria.allowDifferentlyAbled ? 'text-green-400' : 'text-red-400'}>
                                        {department.priorityCriteria.allowDifferentlyAbled ? 'Allowed' : 'Not Allowed'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Main Management Options Grid - Mobile Optimized */}
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Department Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {managementOptions.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(option.path)}
                            className={`group relative bg-slate-800/50 border ${option.borderColor} rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm`}
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className={`p-2 sm:p-3 rounded-xl ${option.bgColor} ${option.hoverBg} transition-colors`}>
                                    <option.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${option.iconColor}`} />
                                </div>
                                {option.stats !== undefined && (
                                    <div className="text-right">
                                        <p className="text-xl sm:text-2xl font-bold text-white">{option.stats}</p>
                                        <p className="text-xs text-slate-400">{option.statLabel}</p>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-blue-400 transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">
                                {option.description}
                            </p>

                            <div className="flex items-center text-xs font-medium text-blue-400 group-hover:text-blue-300">
                                <span>Manage {option.title}</span>
                                <FiArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Working Hours Preview - Mobile Optimized */}
                {department.workingHours && department.workingHours.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 sm:p-6"
                    >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                                <FaClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                                Working Hours
                            </h3>
                            <button
                                onClick={() => navigate(`/super-admin-panel/departments/${deptId}/edit`)}
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Edit Hours
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
                            {department.workingHours.map((day) => (
                                <div
                                    key={day.day}
                                    className={`p-1.5 sm:p-2 rounded-lg text-center ${day.isClosed ? 'bg-red-500/10' : 'bg-green-500/10'}`}
                                >
                                    <p className="text-xs font-medium text-slate-300 mb-0.5 sm:mb-1">{day.day.slice(0, 3)}</p>
                                    {day.isClosed ? (
                                        <span className="text-xs text-red-400">Closed</span>
                                    ) : (
                                        <div className="text-xs text-slate-400">
                                            <div>{day.openTime}</div>
                                            <div className="hidden sm:block">{day.closeTime}</div>
                                            <div className="sm:hidden">{day.closeTime}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ManageDepartmentWork;