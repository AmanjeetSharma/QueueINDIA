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
    FiBriefcase,
    FiMoreVertical,
    FiChevronRight
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
    FaBoxes,
    FaWifi,
    FaParking,
    FaWheelchair
} from 'react-icons/fa';
import { MdQueue, MdAnalytics, MdDashboard, MdPeople, MdEvent, MdOutlineAccessTime } from 'react-icons/md';
import { BsPeopleFill, BsCalendarCheck, BsGraphUp, BsThreeDotsVertical } from 'react-icons/bs';

const ManageDepartmentWork = () => {
    const navigate = useNavigate();
    const { deptId } = useParams();
    const { getDepartmentById, loading: departmentLoading } = useDepartment();

    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (deptId) {
            fetchDepartmentDetails();
        }
    }, [deptId]);

    const fetchDepartmentDetails = async () => {
        try {
            setLoading(true);
            const response = await getDepartmentById(deptId);
            const departmentData = response?.data || response;
            setDepartment(departmentData);
        } catch (error) {
            console.error('Failed to fetch department:', error);
        } finally {
            setLoading(false);
        }
    };

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
            title: 'Bookings',
            description: 'View & manage appointments',
            icon: BsCalendarCheck,
            bgColor: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/30',
            hoverBg: 'hover:bg-blue-500/20',
            path: `/department/bookings`,
            stats: '0',
            statLabel: 'Today'
        },
        {
            id: 'queue',
            title: 'Queue',
            description: 'Monitor live token system',
            icon: MdQueue,
            bgColor: 'from-green-500 to-green-600',
            lightBg: 'bg-green-500/10',
            iconColor: 'text-green-400',
            borderColor: 'border-green-500/30',
            hoverBg: 'hover:bg-green-500/20',
            path: `/department/${deptId}/queue-services`,
            stats: '0',
            statLabel: 'Active'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            description: 'Reports & performance',
            icon: BsGraphUp,
            bgColor: 'from-purple-500 to-purple-600',
            lightBg: 'bg-purple-500/10',
            iconColor: 'text-purple-400',
            borderColor: 'border-purple-500/30',
            hoverBg: 'hover:bg-purple-500/20',
            path: `/department/${deptId}/analytics`,
            stats: '12',
            statLabel: 'Reports'
        },
        {
            id: 'staff',
            title: 'Staff',
            description: 'Manage team & permissions',
            icon: MdPeople,
            bgColor: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-500/10',
            iconColor: 'text-orange-400',
            borderColor: 'border-orange-500/30',
            hoverBg: 'hover:bg-orange-500/20',
            path: `/super-admin-panel/departments/${deptId}/manage-work`,
            stats: getDepartmentStats().totalStaff || 0,
            statLabel: 'Members'
        }
    ];

    const quickActions = [
        { id: 'services', label: 'Services', icon: FaListAlt, path: `/department/${deptId}/services` },
        { id: 'settings', label: 'Settings', icon: FaCog, path: `/super-admin-panel/departments/${deptId}/edit` },
        { id: 'schedule', label: 'Schedule', icon: FaClock, path: `/department/${deptId}/schedule` }
    ];

    const getStatusBadge = (status) => {
        const config = {
            'active': { color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', icon: FiCheckCircle },
            'inactive': { color: 'bg-gray-500/20 text-gray-300 border border-gray-500/30', icon: FiXCircle },
            'maintenance': { color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30', icon: FiAlertCircle }
        };

        const { color, icon: Icon } = config[status] || config.inactive;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {Icon && <Icon className="w-3 h-3" />}
                <span className="hidden sm:inline">{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-3 sm:space-y-4">
                        <div className="h-7 sm:h-8 bg-slate-800 rounded-lg w-32 sm:w-48"></div>
                        <div className="h-24 sm:h-32 bg-slate-800/50 rounded-xl"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-16 sm:h-20 bg-slate-800/50 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!department) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 text-center">
                        <FaBuilding className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Department Not Found</h2>
                        <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6">The department doesn't exist or you don't have access.</p>
                        <button
                            onClick={() => navigate('/super-admin-panel/departments')}
                            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getDepartmentStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Mobile Optimized Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
                
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate('/super-admin-panel/departments')}
                        className="inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <FiArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden xs:inline">Back</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {getStatusBadge(department.status)}
                        <button className="p-1.5 sm:p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                            <BsThreeDotsVertical className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Department Header Card - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
                >
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                            <FaBuilding className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent truncate">
                                    {department.name}
                                </h1>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-slate-400 mb-2 truncate">
                                {department.departmentCategory || 'No category'}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                    <FaTag className="w-3 h-3" />
                                    <span className="truncate max-w-[100px] sm:max-w-none">{department.departmentSlug}</span>
                                </span>
                                
                                {department.address && (
                                    <span className="inline-flex items-center gap-1 truncate">
                                        <FiMapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate max-w-[150px] sm:max-w-xs">
                                            {formatAddress(department.address)}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats - Horizontal Scroll on Mobile */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700/50 overflow-x-auto pb-1 hide-scrollbar">
                        <div className="flex-shrink-0 bg-slate-700/30 rounded-lg px-3 py-1.5 min-w-[70px]">
                            <p className="text-xs text-slate-400">Services</p>
                            <p className="text-base sm:text-lg font-semibold">{stats.totalServices}</p>
                        </div>
                        <div className="flex-shrink-0 bg-slate-700/30 rounded-lg px-3 py-1.5 min-w-[70px]">
                            <p className="text-xs text-slate-400">Staff</p>
                            <p className="text-base sm:text-lg font-semibold">{stats.totalStaff}</p>
                        </div>
                        <div className="flex-shrink-0 bg-slate-700/30 rounded-lg px-3 py-1.5 min-w-[70px]">
                            <p className="text-xs text-slate-400">Booking</p>
                            <p className="text-base sm:text-lg font-semibold">
                                {stats.isSlotBookingEnabled ? 
                                    <span className="text-emerald-400">{stats.bookingWindowDays}d</span> : 
                                    <span className="text-amber-400">Off</span>
                                }
                            </p>
                        </div>
                        <div className="flex-shrink-0 bg-slate-700/30 rounded-lg px-3 py-1.5 min-w-[70px]">
                            <p className="text-xs text-slate-400">Queue</p>
                            <p className="text-base sm:text-lg font-semibold text-blue-400">0</p>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Bar */}
                <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1 hide-scrollbar">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => navigate(action.path)}
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"
                        >
                            <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* Contact & Priority - Collapsible Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
                    {(department.contact?.phone || department.contact?.email) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 sm:p-4"
                        >
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FiSettings className="w-3.5 h-3.5" />
                                Contact
                            </h3>
                            <div className="space-y-1.5 text-xs sm:text-sm">
                                {department.contact.phone && (
                                    <span className="flex items-center gap-1.5 text-slate-300">
                                        <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                                        {department.contact.phone}
                                    </span>
                                )}
                                {department.contact.email && (
                                    <span className="flex items-center gap-1.5 text-slate-300 truncate">
                                        <FiMail className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="truncate">{department.contact.email}</span>
                                    </span>
                                )}
                                {department.contact.website && (
                                    <span className="flex items-center gap-1.5 text-slate-300 truncate">
                                        <FiGlobe className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="truncate">{department.contact.website}</span>
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {department.priorityCriteria && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 sm:p-4"
                        >
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <FiStar className="w-3.5 h-3.5 text-amber-400" />
                                Priority
                            </h3>
                            <div className="space-y-1.5 text-xs sm:text-sm">
                                {department.priorityCriteria.seniorCitizenAge && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Senior</span>
                                        <span className="text-white font-medium">Age {department.priorityCriteria.seniorCitizenAge}+</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Pregnant</span>
                                    <span className={department.priorityCriteria.allowPregnantWomen ? 'text-emerald-400' : 'text-red-400'}>
                                        {department.priorityCriteria.allowPregnantWomen ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Differently Abled</span>
                                    <span className={department.priorityCriteria.allowDifferentlyAbled ? 'text-emerald-400' : 'text-red-400'}>
                                        {department.priorityCriteria.allowDifferentlyAbled ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Management Options - Compact Grid */}
                <h2 className="text-base sm:text-lg font-semibold text-white mb-3">Management</h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-6">
                    {managementOptions.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(option.path)}
                            className="group bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 sm:p-4 cursor-pointer hover:border-slate-600 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className={`p-2 rounded-lg ${option.lightBg}`}>
                                    <option.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${option.iconColor}`} />
                                </div>
                                {option.stats !== undefined && (
                                    <div className="text-right">
                                        <p className="text-lg sm:text-xl font-bold text-white">{option.stats}</p>
                                        <p className="text-[10px] sm:text-xs text-slate-400">{option.statLabel}</p>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-sm sm:text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-slate-400 mb-2 line-clamp-2">
                                {option.description}
                            </p>

                            <div className="flex items-center text-[10px] sm:text-xs font-medium text-blue-400">
                                <span>Manage</span>
                                <FiChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Working Hours - Compact Preview */}
                {department.workingHours && department.workingHours.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 sm:p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <FaClock className="w-3.5 h-3.5" />
                                Working Hours
                            </h3>
                            <button
                                onClick={() => navigate(`/super-admin-panel/departments/${deptId}/edit`)}
                                className="text-[10px] sm:text-xs text-blue-400 hover:text-blue-300"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                            {department.workingHours.slice(0, 7).map((day) => (
                                <div
                                    key={day.day}
                                    className={`p-1.5 rounded-md text-center ${day.isClosed ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}
                                >
                                    <p className="text-[10px] font-medium text-slate-300 mb-0.5">
                                        {day.day.slice(0, 3)}
                                    </p>
                                    {day.isClosed ? (
                                        <span className="text-[8px] sm:text-[10px] text-red-400">Closed</span>
                                    ) : (
                                        <div className="text-[8px] sm:text-[10px] text-slate-400">
                                            {day.openTime}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Global styles for hide-scrollbar */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ManageDepartmentWork;