import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  MdRefresh,
  MdRedo,
  MdSearch,
  MdFilterList,
  MdArrowUpward,
  MdArrowDownward,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdShield,
  MdVerified,
  MdWarning,
  MdEdit,
  MdLockReset,
  MdLogout,
  MdDelete,
  MdCheckCircle,
  MdOutlineAdminPanelSettings,
  MdArrowBack,
  MdMoreVert,
} from "react-icons/md";
import { FaUsers, FaUserShield, FaUserTie, FaUser } from "react-icons/fa";

import DeletePopup from './popups/DeletePopup';
import LogoutPopup from './popups/LogoutPopup';
import ResetPasswordPopup from './popups/ResetPasswordPopup';
import ViewUserPopup from './popups/ViewUserPopup';
import ChangeRolePopup from './popups/ChangeRolePopup';

// ─── Mobile Action Menu (portal-style, fixed position) ───────────────────────
const MobileMenu = ({ user, anchorRef, onClose, onView, onRole, onReset, onLogout, onDelete }) => {
  const [pos, setPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuHeight = 220; // approx
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight
        ? rect.top - menuHeight + window.scrollY
        : rect.bottom + window.scrollY + 4;

      setPos({
        top,
        right: window.innerWidth - rect.right,
      });
    }

    const handleClickOutside = (e) => {
      if (anchorRef?.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.15 }}
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}
      className="w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="p-1">
        {[
          { label: 'View Details', icon: MdPerson, color: 'text-slate-300', action: onView },
          { label: 'Change Role', icon: MdEdit, color: 'text-purple-300', action: onRole },
          { label: 'Reset Password', icon: MdLockReset, color: 'text-blue-300', action: onReset },
          { label: 'Force Logout', icon: MdLogout, color: 'text-amber-300', action: onLogout },
          { label: 'Delete User', icon: MdDelete, color: 'text-red-300', action: onDelete },
        ].map(({ label, icon: Icon, color, action }) => (
          <button
            key={label}
            onClick={() => { action(); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs ${color} hover:bg-slate-700/80 rounded-lg transition-colors`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UserManagementTab = () => {
  const {
    getAllUsers: authGetAllUsers,
    forceLogout: authForceLogout,
    resetUserPasswordAdmin: authResetPassword,
    changeUserRole: authChangeRole,
    deleteUserByAdmin: authDeleteUserByAdmin
  } = useAuth();

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'ALL',
    emailVerified: 'ALL',
    phoneVerified: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20
  });

  const [popupState, setPopupState] = useState({
    showDelete: false, showLogout: false,
    showResetPassword: false, showViewUser: false, showChangeRole: false
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuUserId, setMobileMenuUserId] = useState(null);

  // Store refs per-user for anchor positioning
  const mobileMenuRefs = useRef({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authGetAllUsers();
      let allUsers = response?.data?.users || response?.users || (Array.isArray(response) ? response : []);
      let filtered = [...allUsers];

      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(u =>
          u.name?.toLowerCase().includes(t) ||
          u.email?.toLowerCase().includes(t) ||
          u.phone?.toLowerCase().includes(t)
        );
      }
      if (filters.role !== 'ALL') filtered = filtered.filter(u => u.role === filters.role);
      if (filters.emailVerified !== 'ALL')
        filtered = filtered.filter(u => filters.emailVerified === 'VERIFIED' ? u.isEmailVerified : !u.isEmailVerified);
      if (filters.phoneVerified !== 'ALL')
        filtered = filtered.filter(u => filters.phoneVerified === 'VERIFIED' ? u.isPhoneVerified : !u.isPhoneVerified);

      filtered.sort((a, b) => {
        let av, bv;
        if (filters.sortBy === 'name') { av = a.name?.toLowerCase() || ''; bv = b.name?.toLowerCase() || ''; }
        else if (filters.sortBy === 'email') { av = a.email?.toLowerCase() || ''; bv = b.email?.toLowerCase() || ''; }
        else if (filters.sortBy === 'role') { av = a.role || ''; bv = b.role || ''; }
        else { av = new Date(a.createdAt || 0).getTime(); bv = new Date(b.createdAt || 0).getTime(); }
        return filters.sortOrder === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });

      const start = (pagination.currentPage - 1) * pagination.limit;
      setUsers(filtered.slice(start, start + pagination.limit));
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(filtered.length / pagination.limit),
        totalUsers: filtered.length
      }));
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [pagination.currentPage]);

  const handleApplyFilters = () => { setPagination(p => ({ ...p, currentPage: 1 })); fetchUsers(); };
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({ role: 'ALL', emailVerified: 'ALL', phoneVerified: 'ALL', sortBy: 'createdAt', sortOrder: 'desc' });
    setPagination(p => ({ ...p, currentPage: 1 }));
    fetchUsers();
  };

  const closeAllPopups = () => {
    setPopupState({ showDelete: false, showLogout: false, showResetPassword: false, showViewUser: false, showChangeRole: false });
    setSelectedUser(null);
    setTemporaryPassword('');
  };

  const open = (type, user) => { setSelectedUser(user); setPopupState(p => ({ ...p, [type]: true })); };

  const handleDeleteUser = async () => {
    try { setActionLoading(true); await authDeleteUserByAdmin(selectedUser._id); closeAllPopups(); fetchUsers(); }
    catch (e) { }
    finally { setActionLoading(false); }
  };
  const handleForceLogout = async () => {
    try { setActionLoading(true); await authForceLogout(selectedUser._id); closeAllPopups(); fetchUsers(); }
    catch (e) { }
    finally { setActionLoading(false); }
  };
  const handleResetPassword = async () => {
    try { setActionLoading(true); const r = await authResetPassword(selectedUser._id); setTemporaryPassword(r.data?.temporaryPassword || r.temporaryPassword); }
    catch (e) { }
    finally { setActionLoading(false); }
  };
  const handleChangeRole = async (newRole) => {
    try { setActionLoading(true); await authChangeRole(selectedUser._id, newRole); closeAllPopups(); fetchUsers(); }
    catch (e) { }
    finally { setActionLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const getRoleBadge = (role) => {
    const map = {
      SUPER_ADMIN: 'bg-red-500/10 text-red-400 border border-red-500/20',
      ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      DEPARTMENT_OFFICER: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    };
    return map[role] || 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const getRoleIcon = (role) => {
    if (role === 'SUPER_ADMIN') return <MdShield className="text-red-400" />;
    if (role === 'ADMIN') return <FaUserShield className="text-purple-400" />;
    if (role === 'DEPARTMENT_OFFICER') return <FaUserTie className="text-blue-400" />;
    return <FaUser className="text-emerald-400" />;
  };

  const stats = {
    total: pagination.totalUsers,
    superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    officers: users.filter(u => u.role === 'DEPARTMENT_OFFICER').length,
    regularUsers: users.filter(u => u.role === 'USER').length,
    verifiedUsers: users.filter(u => u.isEmailVerified && u.isPhoneVerified).length,
  };

  if (loading && !actionLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
          </div>
          <p className="text-sm font-medium text-slate-300">Loading users…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── Header ── */}
      <div className="border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/super-admin-panel')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-4 transition-colors group"
          >
            <MdArrowBack className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">User Management</h1>
              <p className="mt-0.5 text-xs text-slate-500">Manage and monitor all system users</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleResetFilters} className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs text-slate-300">
                <MdRedo className="w-4 h-4" /><span className="hidden sm:inline">Reset</span>
              </button>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 sm:px-3 sm:py-2 border rounded-lg transition-colors flex items-center gap-1.5 text-xs ${showFilters ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                <MdFilterList className="w-4 h-4" /><span className="hidden sm:inline">Filters</span>
              </button>
              <button onClick={fetchUsers} className="p-2 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs text-white">
                <MdRefresh className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 space-y-4">

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: 'Total', val: stats.total, icon: FaUsers, color: 'text-slate-300', bg: 'bg-slate-800' },
            { label: 'Super', val: stats.superAdmins, icon: MdShield, color: 'text-red-400', bg: 'bg-slate-800' },
            { label: 'Admin', val: stats.admins, icon: FaUserShield, color: 'text-purple-400', bg: 'bg-slate-800' },
            { label: 'Officer', val: stats.officers, icon: FaUserTie, color: 'text-blue-400', bg: 'bg-slate-800' },
            { label: 'User', val: stats.regularUsers, icon: FaUser, color: 'text-emerald-400', bg: 'bg-slate-800' },
            { label: 'Verified', val: stats.verifiedUsers, icon: MdCheckCircle, color: 'text-teal-400', bg: 'bg-slate-800' },
          ].map(({ label, val, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} border border-slate-800 rounded-xl p-3 flex flex-col gap-1`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <span className={`text-xl font-bold ${color}`}>{val}</span>
            </div>
          ))}
        </div>

        {/* ── Search & Filters ── */}
        <div className="bg-slate-800/60 border border-slate-800 rounded-xl p-3 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, email or phone…"
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 rounded-lg focus:border-blue-500 outline-none transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                className="text-sm bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                value={filters.role}
                onChange={e => setFilters(p => ({ ...p, role: e.target.value }))}
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="DEPARTMENT_OFFICER">Officer</option>
                <option value="USER">User</option>
              </select>
              <button
                onClick={() => setFilters(p => ({ ...p, sortOrder: p.sortOrder === 'asc' ? 'desc' : 'asc' }))}
                className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                {filters.sortOrder === 'asc'
                  ? <MdArrowUpward className="w-4 h-4 text-slate-400" />
                  : <MdArrowDownward className="w-4 h-4 text-slate-400" />}
              </button>
              <button onClick={handleApplyFilters} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Apply
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-700/60">
                  {[
                    { label: 'Email Verification', key: 'emailVerified', opts: [['ALL', 'All Email Status'], ['VERIFIED', 'Verified'], ['UNVERIFIED', 'Unverified']] },
                    { label: 'Phone Verification', key: 'phoneVerified', opts: [['ALL', 'All Phone Status'], ['VERIFIED', 'Verified'], ['UNVERIFIED', 'Unverified']] },
                    { label: 'Sort By', key: 'sortBy', opts: [['createdAt', 'Join Date'], ['name', 'Name'], ['email', 'Email'], ['role', 'Role']] },
                  ].map(({ label, key, opts }) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-500 mb-1">{label}</label>
                      <select
                        className="w-full text-sm bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        value={filters[key]}
                        onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                      >
                        {opts.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Users List ── */}
        <div className="bg-slate-800/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">All Users</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {users.length > 0 ? users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="px-4 py-3 hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center bg-blue-600/30 text-blue-300 font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      }
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                      {getRoleIcon(user.role)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-medium text-white truncate">{user.name}</span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getRoleBadge(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400 min-w-0">
                        <MdEmail className="w-3 h-3 text-slate-600 flex-shrink-0" />
                        <span className="truncate max-w-[160px]">{user.email}</span>
                        {user.isEmailVerified
                          ? <MdVerified className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          : <MdWarning className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MdPhone className="w-3 h-3 text-slate-600" />
                          {user.phone}
                          {user.isPhoneVerified
                            ? <MdVerified className="w-3 h-3 text-emerald-500" />
                            : <MdWarning className="w-3 h-3 text-amber-500" />}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <MdCalendarToday className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Actions */}
                  <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                    {[
                      { label: 'View', icon: MdPerson, cls: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700', fn: () => open('showViewUser', user) },
                      { label: 'Role', icon: MdEdit, cls: 'bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border border-purple-800/30', fn: () => open('showChangeRole', user) },
                      { label: 'Reset', icon: MdLockReset, cls: 'bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border border-blue-800/30', fn: () => open('showResetPassword', user) },
                      { label: 'Logout', icon: MdLogout, cls: 'bg-amber-900/20 hover:bg-amber-900/40 text-amber-300 border border-amber-800/30', fn: () => open('showLogout', user) },
                      { label: 'Delete', icon: MdDelete, cls: 'bg-red-900/20 hover:bg-red-900/40 text-red-300 border border-red-800/30', fn: () => open('showDelete', user) },
                    ].map(({ label, icon: Icon, cls, fn }) => (
                      <button key={label} onClick={fn} className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${cls}`}>
                        <Icon className="w-3.5 h-3.5" />{label}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="relative md:hidden flex-shrink-0">
                    <button
                      ref={el => mobileMenuRefs.current[user._id] = el}
                      onClick={() => setMobileMenuUserId(mobileMenuUserId === user._id ? null : user._id)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                    >
                      <MdMoreVert className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-16 text-center">
                <div className="mx-auto w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <FaUsers className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">No Users Found</h3>
                <p className="text-xs text-slate-500">
                  {searchTerm ? 'Try different search terms or filters' : 'No users in the system yet'}
                </p>
                {searchTerm && (
                  <button onClick={handleResetFilters} className="mt-4 px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Page <span className="text-white font-medium">{pagination.currentPage}</span> of <span className="text-white font-medium">{pagination.totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                  className="px-2.5 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >Previous</button>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let p;
                  if (pagination.totalPages <= 5) p = i + 1;
                  else if (pagination.currentPage <= 3) p = i + 1;
                  else if (pagination.currentPage >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                  else p = pagination.currentPage - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: p }))}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${pagination.currentPage === p ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                    >{p}</button>
                  );
                })}
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                  className="px-2.5 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Dropdown Portal ── */}
      <AnimatePresence>
        {mobileMenuUserId && (() => {
          const u = users.find(u => u._id === mobileMenuUserId);
          if (!u) return null;
          return (
            <MobileMenu
              key={mobileMenuUserId}
              user={u}
              anchorRef={{ current: mobileMenuRefs.current[mobileMenuUserId] }}
              onClose={() => setMobileMenuUserId(null)}
              onView={() => open('showViewUser', u)}
              onRole={() => open('showChangeRole', u)}
              onReset={() => open('showResetPassword', u)}
              onLogout={() => open('showLogout', u)}
              onDelete={() => open('showDelete', u)}
            />
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {popupState.showDelete && <DeletePopup user={selectedUser} onConfirm={handleDeleteUser} onCancel={closeAllPopups} loading={actionLoading} />}
        {popupState.showLogout && <LogoutPopup user={selectedUser} onConfirm={handleForceLogout} onCancel={closeAllPopups} loading={actionLoading} />}
        {popupState.showResetPassword && <ResetPasswordPopup user={selectedUser} onConfirm={handleResetPassword} onCancel={closeAllPopups} loading={actionLoading} temporaryPassword={temporaryPassword} />}
        {popupState.showViewUser && <ViewUserPopup user={selectedUser} onClose={closeAllPopups} />}
        {popupState.showChangeRole && <ChangeRolePopup user={selectedUser} onConfirm={handleChangeRole} onCancel={closeAllPopups} loading={actionLoading} />}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementTab;