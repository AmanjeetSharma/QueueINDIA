import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdLockReset, MdCopyAll, MdCheckCircle } from 'react-icons/md';

const ResetPasswordPopup = ({ user, onConfirm, onCancel, loading, temporaryPassword }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (temporaryPassword) {
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <MdCheckCircle className="text-green-400" size={24} />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">Password Reset Successful</h3>
            
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-4">
                Temporary password for <span className="font-semibold text-white">{user?.name}</span>:
              </p>
              
              <div className="relative">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-3 font-mono">
                  <code className="text-base text-blue-400 tracking-wider select-all">
                    {temporaryPassword}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-3 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                >
                  <MdCopyAll className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-left mt-4">
                <p className="text-xs font-medium text-blue-400 mb-2 flex items-center gap-1.5">
                  <span>⚠️</span> Important Instructions:
                </p>
                <ul className="text-xs text-blue-300/80 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Share this password securely with the user
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    User must change password immediately after login
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    User has been logged out from all sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    Password expires in 24 hours
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <MdLockReset className="text-blue-400" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">Reset User Password</h3>
          
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-3">
              Reset password for <span className="font-semibold text-white">{user?.name}</span> ({user?.email})?
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-left">
              <p className="text-xs font-medium text-blue-400 mb-2 flex items-center gap-1.5">
                <span>⚠️</span> What happens:
              </p>
              <ul className="text-xs text-blue-300/80 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  A temporary password will be generated
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  User will be logged out from all devices
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  User must use temporary password to login
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  User should change password immediately
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPopup;