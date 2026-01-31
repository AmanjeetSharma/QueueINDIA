// pages/DepartmentAdminsPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MdCancel, 
  MdDelete, 
  MdPersonAdd,
  MdEmail,
  MdPerson,
  MdShield
} from "react-icons/md";
import { useAdmin } from '../../../../../../context/AdminContext';
import toast from 'react-hot-toast';

const DepartmentAdminsPage = ({ department, onAssignAdmin, onRemoveAdmin, onCancel, loading }) => {
  const { admins, getDepartmentAdmins, loading: adminLoading } = useAdmin();
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (department?._id) {
      getDepartmentAdmins(department._id);
    }
  }, [department, getDepartmentAdmins]);

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    try {
      await onAssignAdmin(email);
      setEmail('');
    } catch (error) {
      // Error handled in parent
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const filteredAdmins = admins.filter(admin => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      admin.name?.toLowerCase().includes(term) ||
      admin.email?.toLowerCase().includes(term) ||
      admin.role?.toLowerCase().includes(term)
    );
  });

  if (!department) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-gray-500 py-8">
          <p>No department selected</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Admin Management</h3>
        <p className="text-sm text-gray-600">Department: {department.name}</p>
        <p className="text-xs text-gray-500">Assign and manage administrators for this department</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assign Admin Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <MdPersonAdd /> Assign New Admin
            </h4>
            <p className="text-sm text-gray-600">Add an admin by email address</p>
          </div>

          <form onSubmit={handleAssignAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="admin@example.com"
                  required
                />
                <MdEmail className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                User must already have an ADMIN role account
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || adminLoading}
              className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MdPersonAdd />
              {loading || adminLoading ? 'Assigning...' : 'Assign Admin'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Guidelines</h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></div>
                Only users with ADMIN role can be assigned
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></div>
                Admin will receive email notification
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></div>
                Admin can manage services and tokens
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></div>
                SUPER_ADMIN can manage all departments
              </li>
            </ul>
          </div>
        </div>

        {/* Admins List */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Assigned Admins ({admins.length})</h4>
                <p className="text-sm text-gray-600">Current administrators for this department</p>
              </div>
              <div className="w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="Search admins..."
                />
              </div>
            </div>
          </div>

          {adminLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading admins...</p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <MdPerson className="text-2xl text-gray-400" />
              </div>
              {searchTerm ? (
                <>
                  <p>No admins found matching "{searchTerm}"</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </>
              ) : (
                <>
                  <p>No admins assigned yet</p>
                  <p className="text-sm mt-1">Assign your first admin using the form</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAdmins.map(admin => (
                <div key={admin._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        {admin.avatar ? (
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-red-600 font-bold text-lg">
                            {admin.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{admin.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            admin.role === 'SUPER_ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <MdEmail size={14} /> {admin.email}
                        </p>
                        {admin.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <MdPerson size={14} /> {admin.phone}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full flex items-center gap-1">
                            <MdShield size={10} />
                            {admin.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            Joined: {new Date(admin.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveAdmin(admin._id)}
                        disabled={loading || adminLoading}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1 disabled:opacity-50"
                        title="Remove admin from department"
                      >
                        <MdDelete />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          disabled={loading || adminLoading}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
        >
          <MdCancel />
          Back to Departments
        </button>
        
        <div className="text-sm text-gray-600">
          Total Admins: <span className="font-semibold">{admins.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DepartmentAdminsPage;