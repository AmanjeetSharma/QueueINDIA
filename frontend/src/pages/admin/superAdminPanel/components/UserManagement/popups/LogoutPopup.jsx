import { motion } from 'framer-motion';
import { MdLogout } from 'react-icons/md';

const LogoutPopup = ({ user, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 backdrop-blur-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <MdLogout className="text-amber-400" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">Force Logout User</h3>
          
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-3">
              Force <span className="font-semibold text-white">{user?.name}</span> to logout from all devices?
            </p>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left">
              <p className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1.5">
                <span>⚠️</span> What happens:
              </p>
              <ul className="text-xs text-amber-300/80 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  All active sessions will be terminated immediately
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  User will be logged out from all devices
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  User will need to login again
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  This action is irreversible
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging out...
                </>
              ) : (
                'Force Logout'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutPopup;