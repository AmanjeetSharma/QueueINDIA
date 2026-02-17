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
    FiEdit2,
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
            bgColor: 'bg-blue-500/15',
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-400/40',
            path: `/department/${deptId}/bookings`,
            stats: '0',
            statLabel: 'Today'
        },
        {
            id: 'queue',
            title: 'Live Queue',
            description: 'Monitor real-time service queues',
            icon: MdQueue,
            bgColor: 'bg-green-500/15',
            iconColor: 'text-green-500',
            borderColor: 'border-green-400/40',
            path: `/department/${deptId}/queue-services`,
            stats: '0',
            statLabel: 'Active'
        },
        {
            id: 'analytics',
            title: 'Analytics',
            description: 'View performance metrics & reports',
            icon: BsGraphUp,
            bgColor: 'bg-purple-500/15',
            iconColor: 'text-purple-500',
            borderColor: 'border-purple-400/40',
            path: `/department/${deptId}/analytics`,
            stats: '12',
            statLabel: 'Reports'
        },
        {
            id: 'admins',
            title: 'Staff',
            description: 'Manage staff & permissions',
            icon: MdPeople,
            bgColor: 'bg-orange-500/15',
            iconColor: 'text-orange-500',
            borderColor: 'border-orange-400/40',
            path: `/department/${deptId}/admins`,
            stats: getDepartmentStats().totalStaff || 0,
            statLabel: 'Total'
        }
    ];

    const getStatusBadge = (status) => {
        const config = {
            'active': { color: 'bg-green-500/25 text-green-400 border border-green-500/50', icon: FiCheckCircle },
            'inactive': { color: 'bg-gray-500/25 text-gray-400 border border-gray-500/50', icon: FiXCircle },
            'maintenance': { color: 'bg-yellow-500/25 text-yellow-400 border border-yellow-500/50', icon: FiAlertCircle }
        };
        const { color, icon: Icon } = config[status] || config.inactive;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                {Icon && <Icon className="w-4 h-4" />}
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto animate-pulse space-y-6">
                    <div className="h-8 bg-slate-700 rounded-lg w-40"></div>
                    <div className="h-32 bg-slate-700/60 rounded-2xl"></div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="h-36 bg-slate-700/60 rounded-xl"></div>
                        <div className="h-36 bg-slate-700/60 rounded-xl"></div>
                        <div className="h-36 bg-slate-700/60 rounded-xl"></div>
                        <div className="h-36 bg-slate-700/60 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!department) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8">
                        <FaBuilding className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Department Not Found</h2>
                        <p className="text-sm text-slate-400 mb-6">The department doesn't exist or you don't have access.</p>
                        <button onClick={() => navigate('/super-admin-panel/departments')} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                            <FiArrowLeft className="w-4 h-4 mr-2" /> Back to Departments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getDepartmentStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 lg:p-8">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-8"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-8"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/super-admin-panel/departments')} 
                    className="inline-flex items-center text-sm text-slate-300 hover:text-white mb-4 transition-colors group cursor-pointer"
                >
                    <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Departments
                </button>

                {/* Department Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 mb-6 hover:bg-slate-800/70 transition-colors"
                >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 hover:from-blue-500/40 hover:to-cyan-500/30 transition-all">
                                    <FaBuilding className="w-7 h-7 text-blue-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-2">
                                        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                            {department.name}
                                        </h1>
                                        {department.status && getStatusBadge(department.status)}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3">{department.departmentCategory || 'No category'}</p>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                                        <span className="inline-flex items-center gap-2 text-slate-300">
                                            <FaTag className="w-4 h-4 text-slate-500" />
                                            <span>ID: {department.departmentSlug}</span>
                                        </span>
                                        {department.address && (
                                            <span className="inline-flex items-center gap-2 text-slate-300">
                                                <FiMapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                <span className="truncate">{formatAddress(department.address)}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-700/60 rounded-xl px-4 py-2 text-center min-w-[80px] hover:bg-slate-700/80 transition-colors">
                                <p className="text-xs text-slate-400">Services</p>
                                <p className="text-xl font-semibold text-white">{stats.totalServices}</p>
                            </div>
                            <div className="bg-slate-700/60 rounded-xl px-4 py-2 text-center min-w-[80px] hover:bg-slate-700/80 transition-colors">
                                <p className="text-xs text-slate-400">Staff</p>
                                <p className="text-xl font-semibold text-white">{stats.totalStaff}</p>
                            </div>
                            <div className="bg-slate-700/60 rounded-xl px-4 py-2 text-center min-w-[80px] hover:bg-slate-700/80 transition-colors">
                                <p className="text-xs text-slate-400">Booking</p>
                                <p className="text-xl font-semibold">
                                    {stats.isSlotBookingEnabled ?
                                        <span className="text-green-400">{stats.bookingWindowDays}d</span> :
                                        <span className="text-yellow-400">Off</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    {(department.contact?.phone || department.contact?.email) && (
                        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                            {department.contact.phone && (
                                <span className="inline-flex items-center gap-2 text-slate-300 text-sm hover:text-white transition-colors">
                                    <FiPhone className="w-4 h-4 text-slate-500" /> {department.contact.phone}
                                </span>
                            )}
                            {department.contact.email && (
                                <span className="inline-flex items-center gap-2 text-slate-300 text-sm hover:text-white transition-colors">
                                    <FiMail className="w-4 h-4 text-slate-500" /> {department.contact.email}
                                </span>
                            )}
                            {department.contact.website && (
                                <span className="inline-flex items-center gap-2 text-slate-300 text-sm hover:text-white transition-colors">
                                    <FiGlobe className="w-4 h-4 text-slate-500" /> {department.contact.website}
                                </span>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Management Options */}
                <h2 className="text-lg font-semibold text-white mb-4">Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {managementOptions.map((option, index) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(option.path)}
                            className={`group relative bg-slate-800/50 border ${option.borderColor} rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02] hover:bg-slate-800/70 hover:shadow-lg hover:shadow-slate-900/50`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-lg ${option.bgColor} group-hover:${option.bgColor.replace('/15', '/25')} transition-colors`}>
                                    <option.icon className={`w-5 h-5 ${option.iconColor}`} />
                                </div>
                                {option.stats !== undefined && (
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-white">{option.stats}</p>
                                        <p className="text-xs text-slate-400">{option.statLabel}</p>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-xs text-slate-400 mb-3 line-clamp-2 group-hover:text-slate-300 transition-colors">
                                {option.description}
                            </p>
                            <div className="flex items-center text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                                <span>Manage</span>
                                <FiArrowLeft className="w-3.5 h-3.5 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Priority Criteria */}
                    {department.priorityCriteria && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-colors"
                        >
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <FiStar className="w-4 h-4 text-yellow-400" /> Priority Access Criteria
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {department.priorityCriteria.seniorCitizenAge && (
                                    <div className="text-center p-3 bg-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors">
                                        <p className="text-xs text-slate-400 mb-1">Senior Citizen</p>
                                        <p className="text-sm font-medium text-white">Age {department.priorityCriteria.seniorCitizenAge}+</p>
                                    </div>
                                )}
                                <div className="text-center p-3 bg-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors">
                                    <p className="text-xs text-slate-400 mb-1">Pregnant Women</p>
                                    <p className={`text-sm font-medium ${department.priorityCriteria.allowPregnantWomen ? 'text-green-400' : 'text-red-400'}`}>
                                        {department.priorityCriteria.allowPregnantWomen ? 'Allowed' : 'Not Allowed'}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-slate-700/40 rounded-lg hover:bg-slate-700/60 transition-colors">
                                    <p className="text-xs text-slate-400 mb-1">Differently Abled</p>
                                    <p className={`text-sm font-medium ${department.priorityCriteria.allowDifferentlyAbled ? 'text-green-400' : 'text-red-400'}`}>
                                        {department.priorityCriteria.allowDifferentlyAbled ? 'Allowed' : 'Not Allowed'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Working Hours */}
                    {department.workingHours?.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <FaClock className="w-4 h-4 text-slate-500" /> Working Hours
                                </h3>
                                <button 
                                    onClick={() => navigate(`/super-admin-panel/departments/${deptId}/edit`)} 
                                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                >
                                    <FiEdit2 className="w-3.5 h-3.5" /> Edit Hours
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {department.workingHours.map((day) => (
                                    <div key={day.day} className={`p-2 rounded-lg text-center transition-colors ${day.isClosed ? 'bg-red-500/15 hover:bg-red-500/25' : 'bg-green-500/15 hover:bg-green-500/25'}`}>
                                        <p className="text-xs font-medium text-slate-300 mb-1">{day.day.slice(0, 3)}</p>
                                        {day.isClosed ?
                                            <span className="text-[10px] font-medium text-red-400">Closed</span> :
                                            <span className="text-[10px] text-slate-400">{day.openTime}</span>
                                        }
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Additional Stats or Info */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-4 bg-slate-800/30 border border-slate-700/40 rounded-xl p-4 hover:bg-slate-800/40 transition-colors"
                >
                    <p className="text-xs text-slate-500 text-center">
                        Department ID: {department._id} • Created On: {new Date(department.createdAt).toLocaleDateString()}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ManageDepartmentWork;