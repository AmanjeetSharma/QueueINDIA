import { motion } from 'framer-motion';
import {
  MdPerson, MdEmail, MdPhone, MdCalendarToday,
  MdShield, MdVerified, MdWarning, MdClose, MdBadge, MdCopyAll,
  MdInfo, MdOutlineEmail, MdOutlinePhone, MdOutlineCalendarToday,
  MdOutlineAccountCircle, MdOutlineVerified, MdOutlineWarning
} from 'react-icons/md';
import { FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';

const ViewUserPopup = ({ user, onClose }) => {
  const getRoleIcon = (role) => {
    if (role === 'SUPER_ADMIN') return <MdShield className="text-red-400" size={20} />;
    if (role === 'ADMIN') return <FaUserShield className="text-purple-400" size={20} />;
    if (role === 'DEPARTMENT_OFFICER') return <FaUserTie className="text-blue-400" size={20} />;
    return <FaUser className="text-emerald-400" size={20} />;
  };

  const getRoleBadge = (role) => {
    const map = {
      SUPER_ADMIN: 'bg-red-500/10 text-red-400 border border-red-500/20',
      ADMIN: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      DEPARTMENT_OFFICER: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      USER: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    };
    return map[role] || 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatId = (id) => {
    if (!id) return 'N/A';
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <MdInfo className="w-5 h-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-semibold text-white">User Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <MdClose className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex justify-center sm:justify-start">
              <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-700">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-blue-600/30 text-blue-300 font-bold text-2xl">${user.name?.charAt(0).toUpperCase()}</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600/30 text-blue-300 font-bold text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center">
                  {getRoleIcon(user?.role)}
                </div>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <span className="text-lg sm:text-xl font-medium text-white break-words">{user?.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user?.role)} inline-flex items-center justify-center sm:justify-start`}>
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
                <MdBadge className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1">
                  <span className="font-mono text-slate-300 text-xs break-all max-w-[180px] sm:max-w-[250px]">
                    {user?._id}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user?._id);
                      // Optional: Add toast notification here
                      toast.success('ID copied to clipboard');
                    }}
                    className="p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                    title="Copy ID"
                  >
                    <MdCopyAll className="w-3.5 h-3.5 text-slate-400 hover:text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Contact Information */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MdOutlineEmail className="w-4 h-4" />
                Contact Information
              </h4>
              <div className="space-y-3">
                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <MdEmail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400">Email:</span>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-sm text-white break-all">{user?.email}</span>
                    {user?.isEmailVerified ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 whitespace-nowrap">
                        <MdVerified className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400 whitespace-nowrap">
                        <MdWarning className="w-3.5 h-3.5" /> Unverified
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <MdPhone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400">Phone:</span>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    {user?.phone ? (
                      <>
                        <span className="text-sm text-white">{user.phone}</span>
                        {user?.isPhoneVerified ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 whitespace-nowrap">
                            <MdVerified className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-amber-400 whitespace-nowrap">
                            <MdWarning className="w-3.5 h-3.5" /> Unverified
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-slate-500 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MdOutlineAccountCircle className="w-4 h-4" />
                Account Information
              </h4>
              <div className="space-y-3">
                {/* Department */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <MdShield className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400">Department:</span>
                  </div>
                  <span className="text-sm text-white">
                    {user?.departmentId ? user.departmentId : <span className="text-slate-500 italic">Not assigned</span>}
                  </span>
                </div>

                {/* Joined Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <MdCalendarToday className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="text-xs text-slate-400">Joined:</span>
                  </div>
                  <span className="text-sm text-white">{formatDate(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewUserPopup;