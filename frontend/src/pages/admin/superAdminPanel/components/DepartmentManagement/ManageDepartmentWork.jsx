import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDepartment } from '../../../../../context/DepartmentContext';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiMapPin,
    FiPhone,
    FiMail,
    FiGlobe,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiStar,
} from 'react-icons/fi';
import {
    FaBuilding,
    FaTag,
    FaClock,
} from 'react-icons/fa';
import { MdQueue, MdPeople } from 'react-icons/md';
import { BsCalendarCheck, BsGraphUp } from 'react-icons/bs';

const ManageDepartmentWork = () => {
    const navigate = useNavigate();
    const { deptId } = useParams();
    const { getDepartmentById, loading: departmentLoading } = useDepartment();

    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (deptId) fetchDepartmentDetails();
    }, [deptId]);

    const fetchDepartmentDetails = async () => {
        try {
            setLoading(true);
            const response = await getDepartmentById(deptId);
            setDepartment(response?.data || response);
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
            totalStaff: (department.admins?.length || 0) + (department.departmentOfficers?.length || 0),
            isSlotBookingEnabled: department.isSlotBookingEnabled || false,
            bookingWindowDays: department.bookingWindowDays || 0
        };
    };

    const managementOptions = [
        {
            id: 'bookings',
            title: 'All Bookings',
            description: 'View and manage all department bookings',
            icon: BsCalendarCheck,
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/30',
            path: `/department/bookings`,
            stats: '0',
            statLabel: 'Today'
        },
        {
            id: 'queue',
            title: 'Live Queue',
            description: 'Monitor real-time service queues',
            icon: MdQueue,
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-400',
            borderColor: 'border-green-500/30',
            path: `/department/${deptId}/queue-services`,
            stats: '0',
            statLabel: 'Active'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            description: 'View performance metrics & reports',
            icon: BsGraphUp,
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-400',
            borderColor: 'border-purple-500/30',
            path: `/department/${deptId}/analytics`,
            stats: '12',
            statLabel: 'Reports'
        },
        {
            id: 'admins',
            title: 'Staff',
            description: 'Manage staff & permissions',
            icon: MdPeople,
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-400',
            borderColor: 'border-orange-500/30',
            path: `/super-admin-panel/departments/${deptId}/manage-work`,
            stats: getDepartmentStats().totalStaff || 0,
            statLabel: 'Total'
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
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
                {Icon && <Icon className="w-2.5 h-2.5" />}
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    const formatAddress = (address) => {
        if (!address) return null;
        return [address.street, address.city, address.district, address.state, address.pincode]
            .filter(Boolean).join(', ');
    };

    if (loading || departmentLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3">
                <div className="max-w-7xl mx-auto animate-pulse space-y-3">
                    <div className="h-6 bg-slate-800 rounded-lg w-32"></div>
                    <div className="h-24 bg-slate-800/50 rounded-xl"></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-28 bg-slate-800/50 rounded-xl"></div>
                        <div className="h-28 bg-slate-800/50 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!department) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <FaBuilding className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                        <h2 className="text-base font-semibold text-white mb-1">Department Not Found</h2>
                        <p className="text-xs text-slate-400 mb-4">The department doesn't exist or you don't have access.</p>
                        <button onClick={() => navigate('/super-admin-panel/departments')} className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">
                            <FiArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Departments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getDepartmentStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-3">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-5"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-5"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Back Button */}
                <button onClick={() => navigate('/super-admin-panel/departments')} className="inline-flex items-center text-xs text-slate-400 hover:text-white mb-3 transition-colors">
                    <FiArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Departments
                </button>

                {/* Department Header - Compact */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 mb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <FaBuilding className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                    <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent truncate max-w-[180px] sm:max-w-xs">
                                        {department.name}
                                    </h1>
                                    {department.status && getStatusBadge(department.status)}
                                </div>
                                <p className="text-xs text-slate-400 mb-1 truncate">{department.departmentCategory || 'No category'}</p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                                    <span className="inline-flex items-center gap-1 text-slate-300">
                                        <FaTag className="w-3 h-3 text-slate-400" />
                                        <span className="truncate max-w-[100px]">ID: {department.departmentSlug}</span>
                                    </span>
                                    {department.address && (
                                        <span className="inline-flex items-center gap-1 text-slate-300">
                                            <FiMapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                            <span className="truncate max-w-[150px] text-xs">{formatAddress(department.address)}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats - Mini */}
                        <div className="flex items-center gap-1.5">
                            <div className="bg-slate-700/50 rounded-lg px-2 py-1 text-center min-w-[50px]">
                                <p className="text-[10px] text-slate-400">Svc</p>
                                <p className="text-sm font-semibold">{stats.totalServices}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg px-2 py-1 text-center min-w-[50px]">
                                <p className="text-[10px] text-slate-400">Staff</p>
                                <p className="text-sm font-semibold">{stats.totalStaff}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded-lg px-2 py-1 text-center min-w-[50px]">
                                <p className="text-[10px] text-slate-400">Bkg</p>
                                <p className="text-sm font-semibold">
                                    {stats.isSlotBookingEnabled ?
                                        <span className="text-green-400 text-xs">{stats.bookingWindowDays}d</span> :
                                        <span className="text-yellow-400 text-xs">Off</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact - Compact */}
                    {(department.contact?.phone || department.contact?.email) && (
                        <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-700/50 text-xs">
                            {department.contact.phone && (
                                <span className="inline-flex items-center gap-1 text-slate-400">
                                    <FiPhone className="w-3 h-3" /> {department.contact.phone}
                                </span>
                            )}
                            {department.contact.email && (
                                <span className="inline-flex items-center gap-1 text-slate-400 truncate">
                                    <FiMail className="w-3 h-3" /> {department.contact.email}
                                </span>
                            )}
                            {department.contact.website && (
                                <span className="inline-flex items-center gap-1 text-slate-400 truncate">
                                    <FiGlobe className="w-3 h-3" /> {department.contact.website}
                                </span>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Management Options - Ultra Compact Grid */}
                <h2 className="text-sm font-semibold text-white mb-2">Management</h2>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {managementOptions.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(option.path)}
                            className={`group relative bg-slate-800/50 border ${option.borderColor} rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.02]`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className={`p-1.5 rounded-lg ${option.bgColor}`}>
                                    <option.icon className={`w-4 h-4 ${option.iconColor}`} />
                                </div>
                                {option.stats !== undefined && (
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white">{option.stats}</p>
                                        <p className="text-[10px] text-slate-400">{option.statLabel}</p>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-0.5 group-hover:text-blue-400">
                                {option.title}
                            </h3>
                            <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">
                                {option.description}
                            </p>
                            <div className="flex items-center text-[10px] font-medium text-blue-400">
                                <span>Manage</span>
                                <FiArrowLeft className="w-2.5 h-2.5 ml-0.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Priority Criteria - Compact Card */}
                {department.priorityCriteria && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
                        <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                            <FiStar className="w-3.5 h-3.5 text-yellow-400" /> Priority Access
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            {department.priorityCriteria.seniorCitizenAge && (
                                <div className="text-center p-1.5 bg-slate-700/30 rounded-lg">
                                    <p className="text-[10px] text-slate-400">Senior</p>
                                    <p className="text-xs font-medium text-white">Age {department.priorityCriteria.seniorCitizenAge}+</p>
                                </div>
                            )}
                            <div className="text-center p-1.5 bg-slate-700/30 rounded-lg">
                                <p className="text-[10px] text-slate-400">Pregnant</p>
                                <p className={`text-xs font-medium ${department.priorityCriteria.allowPregnantWomen ? 'text-green-400' : 'text-red-400'}`}>
                                    {department.priorityCriteria.allowPregnantWomen ? 'Yes' : 'No'}
                                </p>
                            </div>
                            <div className="text-center p-1.5 bg-slate-700/30 rounded-lg">
                                <p className="text-[10px] text-slate-400">Disabled</p>
                                <p className={`text-xs font-medium ${department.priorityCriteria.allowDifferentlyAbled ? 'text-green-400' : 'text-red-400'}`}>
                                    {department.priorityCriteria.allowDifferentlyAbled ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Working Hours - Mini */}
                {department.workingHours?.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                                <FaClock className="w-3.5 h-3.5 text-slate-400" /> Hours
                            </h3>
                            <button onClick={() => navigate(`/super-admin-panel/departments/${deptId}/edit`)} className="text-[10px] text-blue-400">
                                Edit
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {department.workingHours.map((day) => (
                                <div key={day.day} className={`p-1 rounded text-center ${day.isClosed ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                                    <p className="text-[10px] font-medium text-slate-300">{day.day.slice(0, 3)}</p>
                                    {day.isClosed ?
                                        <span className="text-[8px] text-red-400">Closed</span> :
                                        <span className="text-[8px] text-slate-400">{day.openTime}</span>
                                    }
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