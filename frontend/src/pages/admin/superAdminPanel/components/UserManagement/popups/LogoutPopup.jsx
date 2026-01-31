import { motion } from 'framer-motion';

const LogoutPopup = ({ user, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Force Logout User</h3>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              Force <span className="font-semibold">{user?.name}</span> to logout from all devices?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
              <p className="text-sm text-yellow-700 font-medium mb-1">⚠️ What happens:</p>
              <ul className="text-xs text-yellow-600 space-y-1">
                <li>• All active sessions will be terminated immediately</li>
                <li>• User will be logged out from all devices</li>
                <li>• User will need to login again</li>
                <li>• This action is irreversible</li>
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
              className="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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