import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

const ResetPasswordPopup = ({ user, onConfirm, onCancel, loading, temporaryPassword }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (temporaryPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔑</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful</h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Temporary password for <span className="font-semibold">{user?.name}</span>:
              </p>
              
              <div className="relative">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-3">
                  <code className="text-lg font-mono text-red-600 tracking-wider select-all">
                    {temporaryPassword}
                  </code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-3 px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  <Copy size={14} className="mr-1 inline" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
                <p className="text-sm text-red-700 font-medium mb-1">⚠️ Important Instructions:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• Share this password securely with the user</li>
                  <li>• User must change password immediately after login</li>
                  <li>• User has been logged out from all sessions</li>
                  <li>• Password expires in 24 hours</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔄</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset User Password</h3>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              Reset password for <span className="font-semibold">{user?.name}</span> ({user?.email})?
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
              <p className="text-sm text-blue-700 font-medium mb-1">⚠️ What happens:</p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• A temporary password will be generated</li>
                <li>• User will be logged out from all devices</li>
                <li>• User must use temporary password to login</li>
                <li>• User should change password immediately</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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