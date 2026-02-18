import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users, UserPlus, Mail, Calendar, Shield, X, Loader,
  AlertCircle, ArrowLeft, User, ChevronLeft, ChevronRight,
  Search, Filter, Trash2, UserCheck, UserX, Briefcase,
  Edit, Save, AlertTriangle, Key, Phone, ChevronDown, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// ─── Fixed-position mobile action menu ───────────────────────────────────────
const MobileActionMenu = ({ member, anchorRef, onClose, onEdit, onRemove }) => {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuHeight = 100;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight
        ? rect.top - menuHeight + window.scrollY
        : rect.bottom + window.scrollY + 4;
      setPos({ top, right: window.innerWidth - rect.right });
    }
    const handleOut = (e) => {
      if (anchorRef?.current && !anchorRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.12 }}
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="p-1">
        <button
          onClick={() => { onEdit(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Edit className="w-3.5 h-3.5" /> Change Role
        </button>
        <button
          onClick={() => { onRemove(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StaffList = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const { user } = useAuth();
  const {
    staff, departmentInfo, loading, error,
    getDepartmentStaff, assignStaff, updateStaffRole, removeStaff,
    clearError, getAllStaff, getStaffCounts, canManageStaff
  } = useAdmin();

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
  const [mobileMenuMemberId, setMobileMenuMemberId] = useState(null);
  const [expandedMobileCard, setExpandedMobileCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const mobileMenuRefs = useRef({});

  const allStaff = getAllStaff();
  const staffCount = getStaffCounts();
  const departmentName = departmentInfo?.departmentName || '';
  const currentDeptId = departmentId || user?.departmentId;
  const userCanManage = canManageStaff(currentDeptId);

  useEffect(() => { fetchStaff(); }, [currentDeptId]);

  const fetchStaff = async () => {
    try {
      setPageLoaded(false);
      if (currentDeptId) await getDepartmentStaff(currentDeptId);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setPageLoaded(true);
    }
  };

  const filteredStaff = allStaff.filter(member => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.roleType === filterRole;
    return matchesSearch && matchesRole;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handleAssignStaff = async (e) => {
    e.preventDefault();
    if (!staffEmail) { toast.error('Please enter email'); return; }
    try {
      setAssignLoading(true);
      await assignStaff(currentDeptId, staffEmail, selectedRole);
      setStaffEmail(''); setSelectedRole('DEPARTMENT_OFFICER'); setShowAssignModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveStaff = async () => {
    if (!selectedStaff) return;
    if (removeConfirmationText !== 'REMOVE') { toast.error('Please type REMOVE to confirm'); return; }
    try {
      await removeStaff(currentDeptId, selectedStaff._id);
      setShowRemoveConfirm(false); setSelectedStaff(null); setRemoveConfirmationText('');
    } catch (err) { console.error(err); }
  };

  const handleUpdateRole = async (member) => {
    if (!editingRole || editingRole === member.roleType) { setEditingStaff(null); return; }
    try {
      await updateStaffRole(currentDeptId, member._id, editingRole);
      setEditingStaff(null); setEditingRole(''); setExpandedMobileCard(null);
    } catch (err) { console.error(err); }
  };

  const startEditing = (member) => { setEditingStaff(member._id); setEditingRole(member.roleType); };
  const cancelEditing = () => { setEditingStaff(null); setEditingRole(''); };

  const handleBack = () => {
    if (user?.role === 'SUPER_ADMIN') navigate(`/super-admin-panel/departments/${departmentId}/manage-work`);
    else navigate('/admin-panel');
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';
  const isValidAvatarUrl = (url) => url?.startsWith('http://') || url?.startsWith('https://');

  const getRoleBadge = (role) => {
    const map = {
      ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      SUPER_ADMIN: 'bg-red-500/10 text-red-400 border border-red-500/20',
      DEPARTMENT_OFFICER: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    };
    return map[role] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  const getRoleIcon = (role) => {
    if (role === 'ADMIN') return <Shield className="w-3 h-3" />;
    if (role === 'SUPER_ADMIN') return <Key className="w-3 h-3" />;
    if (role === 'DEPARTMENT_OFFICER') return <Briefcase className="w-3 h-3" />;
    return <User className="w-3 h-3" />;
  };

  const Avatar = ({ member, size = 'w-8 h-8' }) => {
    const [imgError, setImgError] = useState(false);
    const url = member.avatar || member.picture;
    if (isValidAvatarUrl(url) && !imgError) {
      return <img src={url} alt={member.name} className={`${size} rounded-full object-cover`} onError={() => setImgError(true)} loading="lazy" />;
    }
    return (
      <div className={`${size} bg-blue-600/20 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-300`}>
        {getInitials(member.name)}
      </div>
    );
  };

  // ── Loading ──
  if (loading && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin text-blue-400" />
          </div>
          <p className="text-sm text-slate-400">Loading staff…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if ((error || localError) && !pageLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Unable to load staff</h3>
          <p className="text-sm text-slate-400 mb-6">{error || localError}</p>
          <button onClick={() => { clearError(); setLocalError(null); fetchStaff(); }} className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Department Staff</h1>
                <p className="text-xs text-slate-500 mt-0.5">{departmentName || 'Manage staff and permissions'}</p>
              </div>
            </div>
            {userCanManage && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Staff</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-4 space-y-4">
        <div className="max-w-7xl mx-auto space-y-4">

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Total Staff', val: staffCount.total, icon: Users, color: 'text-slate-300', iconBg: 'bg-slate-700' },
              { label: 'Admins', val: staffCount.admins, icon: Shield, color: 'text-purple-400', iconBg: 'bg-purple-500/10' },
              { label: 'Officers', val: staffCount.officers, icon: Briefcase, color: 'text-blue-400', iconBg: 'bg-blue-500/10' },
              { label: 'Active', val: allStaff.filter(s => s.isActive !== false).length, icon: UserCheck, color: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
            ].map(({ label, val, icon: Icon, color, iconBg }) => (
              <div key={label} className="bg-slate-800/60 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{label}</span>
                  <div className={`p-1.5 rounded-lg ${iconBg}`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                </div>
                <span className={`text-2xl font-bold ${color}`}>{val}</span>
              </div>
            ))}
          </div>

          {/* ── Search & Filter ── */}
          <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Mobile filter toggle */}
              <div className="flex sm:hidden">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300"
                >
                  <Filter className="w-4 h-4" />
                  {filterRole === 'all' ? 'All Staff' : filterRole === 'ADMIN' ? 'Admins' : 'Officers'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Desktop filter */}
              <div className="hidden sm:flex items-center gap-2">
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Staff</option>
                  <option value="ADMIN">Admins</option>
                  <option value="DEPARTMENT_OFFICER">Officers</option>
                </select>
              </div>
            </div>

            {/* Mobile filter pills */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden sm:hidden">
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[['all', 'All'], ['ADMIN', 'Admins'], ['DEPARTMENT_OFFICER', 'Officers']].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => { setFilterRole(val); setShowMobileFilters(false); }}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors ${filterRole === val ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}
                      >{lbl}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Staff List ── */}
          {filteredStaff.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-800 rounded-xl py-16 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-800 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">No Staff Found</h3>
              <p className="text-xs text-slate-500 mb-4">
                {searchTerm || filterRole !== 'all' ? 'No staff match your criteria' : 'No staff assigned yet'}
              </p>
              {userCanManage && !searchTerm && filterRole === 'all' && (
                <button onClick={() => setShowAssignModal(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4" /> Add First Staff
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-slate-800/60 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {['Staff Member', 'Contact', 'Role', 'Status', 'Joined', userCanManage && 'Actions'].filter(Boolean).map(h => (
                        <th key={h} className={`px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentStaff.map(member => (
                      <motion.tr key={member._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-800/80 transition-colors">
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar member={member} size="w-8 h-8" />
                            <div>
                              <div className="text-sm font-medium text-white">{member.name || 'Unnamed'}</div>
                              <div className="text-xs text-slate-500">ID: {member.employeeId || member._id?.slice(-6) || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300">
                              <Mail className="w-3 h-3 text-slate-600 flex-shrink-0" />
                              <span className="truncate max-w-[180px]">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          {editingStaff === member._id ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={editingRole}
                                onChange={e => setEditingRole(e.target.value)}
                                className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="DEPARTMENT_OFFICER">Officer</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                              <button onClick={() => handleUpdateRole(member)} className="p-1 bg-emerald-600 hover:bg-emerald-700 rounded transition-colors">
                                <Save className="w-3 h-3" />
                              </button>
                              <button onClick={cancelEditing} className="p-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${getRoleBadge(member.roleType)}`}>
                                {getRoleIcon(member.roleType)}
                                {member.roleType === 'DEPARTMENT_OFFICER' ? 'Officer' : member.roleType}
                              </span>
                              {userCanManage && member._id !== user?._id && (
                                <button onClick={() => startEditing(member)} className="p-1 hover:bg-slate-700 rounded transition-colors">
                                  <Edit className="w-3 h-3 text-slate-500 hover:text-slate-300" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${member.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-slate-400">{member.isActive !== false ? 'Active' : 'Inactive'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-xs text-slate-500">
                          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        {userCanManage && (
                          <td className="px-5 py-3 whitespace-nowrap text-right">
                            {member._id === user?._id ? (
                              <span className="text-xs text-slate-600 flex items-center justify-end gap-1">
                                <UserX className="w-3.5 h-3.5" /><span className="hidden lg:inline">Can't remove self</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => { setSelectedStaff(member); setRemoveConfirmationText(''); setShowRemoveConfirm(true); }}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
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

              {/* Mobile Cards */}
              <div className="md:hidden space-y-2">
                {currentStaff.map(member => (
                  <motion.div key={member._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/60 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar member={member} size="w-9 h-9" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-sm font-medium text-white truncate">{member.name || 'Unnamed'}</span>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-full ${getRoleBadge(member.roleType)}`}>
                              {getRoleIcon(member.roleType)}
                              {member.roleType === 'DEPARTMENT_OFFICER' ? 'Officer' : 'Admin'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-[10px] text-slate-500">
                            <span className="truncate max-w-[140px]">{member.email}</span>
                            {member.phone && <><span>·</span><span>{member.phone}</span></>}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-600">
                            <div className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${member.isActive !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {member.isActive !== false ? 'Active' : 'Inactive'}
                            </div>
                            <span>·</span>
                            <span>ID: {member.employeeId || member._id?.slice(-6) || 'N/A'}</span>
                            <span>·</span>
                            <span>{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>

                        {/* Mobile action button */}
                        {userCanManage && (
                          member._id === user?._id
                            ? <div className="p-1.5 text-slate-600"><UserX className="w-3.5 h-3.5" /></div>
                            : (
                              <div className="flex-shrink-0">
                                <button
                                  ref={el => mobileMenuRefs.current[member._id] = el}
                                  onClick={() => setMobileMenuMemberId(mobileMenuMemberId === member._id ? null : member._id)}
                                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                            )
                        )}
                      </div>

                      {/* Role editor (when expanded) */}
                      <AnimatePresence>
                        {expandedMobileCard === member._id && member._id !== user?._id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2 pt-2 border-t border-slate-700">
                            {editingStaff === member._id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={editingRole}
                                  onChange={e => setEditingRole(e.target.value)}
                                  className="flex-1 px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                                  autoFocus
                                >
                                  <option value="DEPARTMENT_OFFICER">Officer</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                                <button onClick={() => handleUpdateRole(member)} className="p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded transition-colors">
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={cancelEditing} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded transition-colors">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => startEditing(member)} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors">
                                <Edit className="w-3.5 h-3.5" /> Change Role
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 order-2 sm:order-1">
                    {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length}
                  </span>
                  <div className="flex items-center gap-1 order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-slate-800 border border-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-2 bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-400">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-slate-800 border border-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
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

      {/* ── Mobile Dropdown Portal ── */}
      <AnimatePresence>
        {mobileMenuMemberId && (() => {
          const m = currentStaff.find(m => m._id === mobileMenuMemberId);
          if (!m) return null;
          return (
            <MobileActionMenu
              key={mobileMenuMemberId}
              member={m}
              anchorRef={{ current: mobileMenuRefs.current[mobileMenuMemberId] }}
              onClose={() => setMobileMenuMemberId(null)}
              onEdit={() => { setExpandedMobileCard(m._id); startEditing(m); }}
              onRemove={() => { setSelectedStaff(m); setRemoveConfirmationText(''); setShowRemoveConfirm(true); }}
            />
          );
        })()}
      </AnimatePresence>

      {/* ── Assign Staff Modal ── */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                    <UserPlus className="w-4 h-4 text-blue-400" />
                  </div>
                  <h2 className="text-base font-bold text-white">Add Staff Member</h2>
                </div>
                <button onClick={() => setShowAssignModal(false)} className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAssignStaff} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={staffEmail}
                    onChange={e => setStaffEmail(e.target.value)}
                    placeholder="Enter staff email"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'DEPARTMENT_OFFICER', lbl: 'Officer', icon: Briefcase, color: 'blue' },
                      { val: 'ADMIN', lbl: 'Admin', icon: Shield, color: 'purple' },
                    ].map(({ val, lbl, icon: Icon, color }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSelectedRole(val)}
                        className={`p-3 rounded-xl border-2 transition-all ${selectedRole === val
                          ? `border-${color}-500 bg-${color}-500/10`
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800'}`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${selectedRole === val ? `text-${color}-400` : 'text-slate-500'}`} />
                        <span className={`text-xs font-medium ${selectedRole === val ? `text-${color}-400` : 'text-slate-500'}`}>{lbl}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">
                    {selectedRole === 'ADMIN' ? 'Admins can manage staff and department settings' : 'Officers handle queues and serve customers'}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={assignLoading}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {assignLoading ? <><Loader className="w-4 h-4 animate-spin" />Adding…</> : <><UserPlus className="w-4 h-4" />Add Staff</>}
                  </button>
                  <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Remove Confirm Modal ── */}
      <AnimatePresence>
        {showRemoveConfirm && selectedStaff && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => { setShowRemoveConfirm(false); setSelectedStaff(null); setRemoveConfirmationText(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Remove Staff Member</h2>
                  <p className="text-xs text-slate-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded-xl">
                <p className="text-sm text-slate-300">
                  Removing <span className="font-bold text-white">{selectedStaff.name || selectedStaff.email}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role: {selectedStaff.roleType === 'DEPARTMENT_OFFICER' ? 'Officer' : selectedStaff.roleType}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Type <span className="font-bold text-red-400">REMOVE</span> to confirm
                </label>
                <input
                  type="text"
                  value={removeConfirmationText}
                  onChange={e => setRemoveConfirmationText(e.target.value)}
                  placeholder="REMOVE"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                  autoFocus
                />
              </div>

              {selectedStaff.roleType === 'ADMIN' && staffCount.admins <= 1 && (
                <div className="mb-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    Warning: This is the last admin of the department.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleRemoveStaff}
                  disabled={removeConfirmationText !== 'REMOVE'}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
                <button
                  onClick={() => { setShowRemoveConfirm(false); setSelectedStaff(null); setRemoveConfirmationText(''); }}
                  className="flex-1 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
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