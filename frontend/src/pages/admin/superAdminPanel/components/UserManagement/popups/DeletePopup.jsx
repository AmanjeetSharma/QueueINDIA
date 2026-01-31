import { motion } from 'framer-motion';

const DeletePopup = ({ user, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗑️</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User Account</h3>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <span className="font-semibold">{user?.name}</span>'s account?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left">
              <p className="text-sm text-red-700 font-medium mb-1">⚠️ This action cannot be undone!</p>
              <ul className="text-xs text-red-600 space-y-1">
                <li>• All user data will be permanently deleted</li>
                <li>• All active sessions will be terminated</li>
                <li>• All bookings and history will be removed</li>
                <li>• Department associations will be cleared</li>
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
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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