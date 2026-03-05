import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdDelete } from 'react-icons/md';

const DeletePopup = ({ user, onConfirm, onCancel, loading }) => {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }
    onConfirm();
  };

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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <MdDelete className="text-red-400" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">Delete User Account</h3>
          
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-3">
              Are you sure you want to delete <span className="font-semibold text-white">{user?.name}</span>'s account?
            </p>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-left mb-4">
              <p className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1.5">
                <span>⚠️</span> This action cannot be undone!
              </p>
              <ul className="text-xs text-red-300/80 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  All user data will be permanently deleted
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  All active sessions will be terminated
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  All bookings and history will be removed
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Department associations will be cleared
                </li>
              </ul>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <label className="block text-xs text-slate-400 text-left">
                Type <span className="font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  setError('');
                }}
                placeholder="DELETE"
                className={`w-full px-4 py-2.5 bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors`}
                disabled={loading}
              />
              {error && (
                <p className="text-xs text-red-400 text-left flex items-center gap-1">
                  <span>⚠️</span> {error}
                </p>
              )}
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
              onClick={handleConfirm}
              disabled={loading || confirmText !== 'DELETE'}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeletePopup;