import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  X,
  Loader,
  AlertCircle,
  ArrowLeft,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  UserCheck,
  UserX,
  Briefcase,
  Edit,
  Save,
  AlertTriangle,
  Key,
  Phone,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const StaffList = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const { user } = useAuth();
  const {
    staff,
    departmentInfo,
    loading,
    error,
    getDepartmentStaff,
    assignStaff,
    updateStaffRole,
    removeStaff,
    clearError,
    getAllStaff,
    getStaffCounts,
    canManageStaff
  } = useAdmin();

  // Local state
  const [pageLoaded, setPageLoaded] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [staffEmail, setStaffEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('DEPARTMENT_OFFICER');
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeConfirmationText, setRemoveConfirmationText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingStaff, setEditingStaff] = useState(null);
  const [editingRole, setEditingRole] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedMobileCard, setExpandedMobileCard] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get all staff using context helper
  const allStaff = getAllStaff();

  // Get staff counts using context helper
  const staffCount = getStaffCounts();

  // Get department name from departmentInfo
  const departmentName = departmentInfo?.departmentName || '';

  // Get the current department ID (from params or user's department)
  const currentDeptId = departmentId || user?.departmentId;

  // Check if current user can manage staff using context helper
  const userCanManage = canManageStaff(currentDeptId);

  useEffect(() => {
    fetchStaff();
  }, [currentDeptId]);

  const fetchStaff = async () => {
    try {
      setPageLoaded(false);
      if (currentDeptId) {
        await getDepartmentStaff(currentDeptId);
      }
    } catch (err) {
      console.error('Failed to fetch department staff:', err);
      setLocalError(err.message);
    } finally {
      setPageLoaded(true);
    }
  };

  // Filter staff based on search and role
  const filteredStaff = allStaff.filter(member => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || member.roleType === filterRole;

    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handleAssignStaff = async (e) => {
    e.preventDefault();
    if (!staffEmail) {
      toast.error('Please enter email');
      return;
    }

    try {
      setAssignLoading(true);
      await assignStaff(currentDeptId, staffEmail, selectedRole);

      // Reset and close modal
      setStaffEmail('');
      setSelectedRole('DEPARTMENT_OFFICER');
      setShowAssignModal(false);
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveStaff = async () => {
    if (!selectedStaff) return;

    // Check if confirmation text matches REMOVE
    if (removeConfirmationText !== 'REMOVE') {
      toast.error('Please type REMOVE to confirm deletion');
      return;
    }

    try {
      // Pass both departmentId and userId
      console.log(`Staff removed | Dept ID: ${currentDeptId} | User ID: ${selectedStaff._id}`); // Debug log
      await removeStaff(currentDeptId, selectedStaff._id);

      // Close modal and reset
      setShowRemoveConfirm(false);
      setSelectedStaff(null);
      setRemoveConfirmationText('');
    } catch (err) {
      console.error('Remove error:', err);
    }
  };

  const handleUpdateRole = async (staffMember) => {
    if (!editingRole || editingRole === staffMember.roleType) {
      setEditingStaff(null);
      return;
    }

    try {
      // Pass departmentId, userId, and newRole
      console.log(`Updating role | Dept ID: ${currentDeptId} | User ID: ${staffMember._id} | New Role: ${editingRole}`); // Debug log
      await updateStaffRole(currentDeptId, staffMember._id, editingRole);

      // Reset editing state
      setEditingStaff(null);
      setEditingRole('');
      setExpandedMobileCard(null);
    } catch (err) {
      console.error('Update role error:', err);
    }
  };

  const startEditing = (staffMember) => {
    setEditingStaff(staffMember._id);
    setEditingRole(staffMember.roleType);
  };

  const cancelEditing = () => {
    setEditingStaff(null);
    setEditingRole('');
  };

  const handleBack = () => {
    if (user?.role === 'SUPER_ADMIN') {
      navigate(`/super-admin-panel/departments/${departmentId}/manage-work`);
    } else {
      navigate(`/admin-panel`);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Check if URL is from Google or Cloudinary
  const isValidAvatarUrl = (url) => {
    if (!url) return false;
    // Check if it's a valid HTTP/HTTPS URL
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300';
      case 'SUPER_ADMIN':
        return 'bg-red-500/20 text-red-300';
      case 'DEPARTMENT_OFFICER':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3 h-3" />;
      case 'SUPER_ADMIN':
        return <Key className="w-3 h-3" />;
      case 'DEPARTMENT_OFFICER':
        return <Briefcase className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  // Avatar Component to handle both Cloudinary and Google avatars
  const Avatar = ({ member, size = 'w-8 h-8' }) => {
    const [imgError, setImgError] = useState(false);
    const avatarUrl = member.avatar || member.picture;

    if (isValidAvatarUrl(avatarUrl) && !imgError) {
      return (
        <img
          src={avatarUrl}
          alt={member.name}
          className={`${size} rounded-full object-cover`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      );
    }

    // Fallback to initials
    return (
      <div className={`${size} bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold`}>
        {getInitials(member.name)}
      </div>
    );
  };

  // Loading state
  if (loading && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">Loading staff...</p>
        </div>
      </div>
    );
  }

  // Error state
  if ((error || localError) && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Unable to load staff</h3>
          <p className="text-slate-300 mb-6">{error || localError || 'An error occurred'}</p>
          <button
            onClick={() => {
              clearError();
              setLocalError(null);
              fetchStaff();
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header - PC unchanged, mobile compact */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/90 backdrop-blur-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Department Staff
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {departmentName || 'Manage staff and their permissions'}
                </p>
              </div>
            </div>

            {userCanManage && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Staff</span>
                {/* Mobile shows just icon, text hidden */}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards - Horizontal scroll on mobile only */}
          <div className="flex sm:grid sm:grid-cols-4 gap-4 mb-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-hide">
            <div className="flex-shrink-0 w-32 sm:w-auto bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-400">Total Staff</p>
                  <p className="text-2xl font-bold text-white">{staffCount.total}</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-32 sm:w-auto bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-400">Admins</p>
                  <p className="text-2xl font-bold text-white">{staffCount.admins}</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-32 sm:w-auto bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-400">Officers</p>
                  <p className="text-2xl font-bold text-white">{staffCount.officers}</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-32 sm:w-auto bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {allStaff.filter(s => s.isActive !== false).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - Mobile optimized */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Mobile filter toggle - visible only on mobile */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 rounded-lg text-sm"
                >
                  <Filter className="w-4 h-4" />
                  {filterRole === 'all' ? 'All Staff' : filterRole === 'ADMIN' ? 'Admins' : 'Officers'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Desktop filter - unchanged */}
              <div className="hidden sm:flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Staff</option>
                  <option value="ADMIN">Admins</option>
                  <option value="DEPARTMENT_OFFICER">Officers</option>
                </select>
              </div>

              {/* Mobile filter options - collapsible */}
              {showMobileFilters && (
                <div className="sm:hidden grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setFilterRole('all');
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${filterRole === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setFilterRole('ADMIN');
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${filterRole === 'ADMIN'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                      }`}
                  >
                    Admins
                  </button>
                  <button
                    onClick={() => {
                      setFilterRole('DEPARTMENT_OFFICER');
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${filterRole === 'DEPARTMENT_OFFICER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                      }`}
                  >
                    Officers
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Staff Grid/Table */}
          {filteredStaff.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Staff Found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || filterRole !== 'all'
                  ? 'No staff match your search criteria'
                  : 'No staff assigned to this department yet'}
              </p>
              {userCanManage && !searchTerm && filterRole === 'all' && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add First Staff
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table - Unchanged */}
              <div className="hidden md:block bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Staff Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Joined
                      </th>
                      {userCanManage && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {currentStaff.map((member) => (
                      <motion.tr
                        key={member._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar member={member} size="w-8 h-8" />
                            <div>
                              <div className="font-medium text-white">{member.name || 'Unnamed'}</div>
                              <div className="text-xs text-slate-400">ID: {member.employeeId || member._id?.slice(-6) || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-slate-300">
                              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="" title={member.email}>{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStaff === member._id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editingRole}
                                onChange={(e) => setEditingRole(e.target.value)}
                                className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="DEPARTMENT_OFFICER">Officer</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              <button
                                onClick={() => handleUpdateRole(member)}
                                className="p-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                                title="Save"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 bg-slate-600 hover:bg-slate-700 rounded transition-colors"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getRoleBadgeColor(member.roleType)}`}>
                                {getRoleIcon(member.roleType)}
                                {member.roleType === 'DEPARTMENT_OFFICER' ? 'Officer' : member.roleType}
                              </span>
                              {userCanManage && member._id !== user?._id && (
                                <button
                                  onClick={() => startEditing(member)}
                                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                                  title="Edit Role"
                                >
                                  <Edit className="w-3 h-3 text-slate-400" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${member.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                            <span className="text-sm text-slate-300">
                              {member.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        {userCanManage && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {member._id === user?._id ? (
                              <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                                <UserX className="w-4 h-4" />
                                <span className="hidden lg:inline">Cannot delete yourself</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedStaff(member);
                                  setRemoveConfirmationText('');
                                  setShowRemoveConfirm(true);
                                }}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                title="Remove Staff"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards - Compact design for mobile only */}
              <div className="md:hidden space-y-3">
                {currentStaff.map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
                  >
                    {/* Card Header - Compact */}
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Avatar member={member} size="w-8 h-8" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <h3 className="font-medium text-sm text-white truncate">
                                {member.name || 'Unnamed'}
                              </h3>
                              <span className={`px-1.5 py-0.5 text-[10px] rounded-full flex items-center gap-0.5 ${getRoleBadgeColor(member.roleType)}`}>
                                {getRoleIcon(member.roleType)}
                                {member.roleType === 'DEPARTMENT_OFFICER' ? 'Officer' : 'Admin'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="truncate">{member.email}</span>
                              {member.phone && <span>• {member.phone}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {userCanManage && (
                            <>
                              {member._id === user?._id ? (
                                <div className="p-1.5 text-slate-500" title="Cannot delete yourself">
                                  <UserX className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => expandedMobileCard === member._id ? setExpandedMobileCard(null) : setExpandedMobileCard(member._id)}
                                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedStaff(member);
                                      setRemoveConfirmationText('');
                                      setShowRemoveConfirm(true);
                                    }}
                                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quick Info Row */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${member.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span>{member.isActive !== false ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div>•</div>
                        <div>ID: {member.employeeId || member._id?.slice(-6) || 'N/A'}</div>
                        <div>•</div>
                        <div>{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>

                    {/* Expandable Role Editor */}
                    <AnimatePresence>
                      {expandedMobileCard === member._id && member._id !== user?._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-700 bg-slate-700/30"
                        >
                          <div className="p-3">
                            {editingStaff === member._id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={editingRole}
                                  onChange={(e) => setEditingRole(e.target.value)}
                                  className="flex-1 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                                  autoFocus
                                >
                                  <option value="DEPARTMENT_OFFICER">Officer</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                                <button
                                  onClick={() => handleUpdateRole(member)}
                                  className="p-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-1.5 bg-slate-600 hover:bg-slate-700 rounded transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditing(member)}
                                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Change Role
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Pagination - Mobile optimized */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-400 order-2 sm:order-1">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} staff
                  </p>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Assign Staff Modal - Centered on all devices */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  Add Staff Member
                </h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignStaff}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="Enter staff email"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('DEPARTMENT_OFFICER')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRole === 'DEPARTMENT_OFFICER'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <Briefcase className={`w-5 h-5 mx-auto mb-1 ${
                        selectedRole === 'DEPARTMENT_OFFICER' ? 'text-blue-400' : 'text-slate-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedRole === 'DEPARTMENT_OFFICER' ? 'text-blue-400' : 'text-slate-400'
                      }`}>
                        Officer
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('ADMIN')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRole === 'ADMIN'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <Shield className={`w-5 h-5 mx-auto mb-1 ${
                        selectedRole === 'ADMIN' ? 'text-purple-400' : 'text-slate-400'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedRole === 'ADMIN' ? 'text-purple-400' : 'text-slate-400'
                      }`}>
                        Admin
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    {selectedRole === 'ADMIN'
                      ? 'Admins can manage staff and department settings'
                      : 'Officers can handle queues and serve customers'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={assignLoading}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {assignLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Staff
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Confirmation Modal - Centered on all devices */}
      <AnimatePresence>
        {showRemoveConfirm && selectedStaff && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => {
              setShowRemoveConfirm(false);
              setSelectedStaff(null);
              setRemoveConfirmationText('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Remove Staff Member</h2>
                  <p className="text-xs sm:text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-slate-300">
                  Removing <span className="font-bold text-white">{selectedStaff.name || selectedStaff.email}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Role: {selectedStaff.roleType === 'DEPARTMENT_OFFICER' ? 'Officer' : selectedStaff.roleType}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type <span className="font-bold text-red-400">REMOVE</span> to confirm
                </label>
                <input
                  type="text"
                  value={removeConfirmationText}
                  onChange={(e) => setRemoveConfirmationText(e.target.value)}
                  placeholder="REMOVE"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>

              {selectedStaff.roleType === 'ADMIN' && staffCount.admins <= 1 && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Warning: This is the last admin of the department.</span>
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleRemoveStaff}
                  disabled={removeConfirmationText !== 'REMOVE'}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    setShowRemoveConfirm(false);
                    setSelectedStaff(null);
                    setRemoveConfirmationText('');
                  }}
                  className="flex-1 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffList;