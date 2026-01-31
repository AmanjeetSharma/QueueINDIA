import { MdEdit, MdDelete, MdAdminPanelSettings, MdLocationOn } from "react-icons/md";
import { GrServices } from "react-icons/gr";
import Icon from '../../Icon';

const DepartmentDashboard = ({
  departments = [],
  loading,
  pagination = { currentPage: 1, totalPages: 1, totalDepartments: 0, limit: 10 },
  formatDate,
  onPageChange,
  navigateToEdit,
  navigateToServices,
  navigateToAdmins,
  handleDeleteDepartment
}) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  // Helper function to get department location
  const getLocation = (department) => {
    const location = department.location || {};
    return `${location.city || 'N/A'}, ${location.state || 'N/A'}`;
  };

  // Helper function to get status
  const getStatus = (department) => {
    return department.status || 'active';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
              <th className="px 6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {departments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Icon name="department" className="text-4xl mb-3 text-gray-300" />
                    <p className="text-gray-400">No departments found</p>
                    <p className="text-sm text-gray-300 mt-1">Try changing your filters or create a new department</p>
                  </div>
                </td>
              </tr>
            ) : (
              departments.map(dept => (
                <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                        {dept.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{dept.name || 'Unnamed Department'}</div>
                        <div className="text-xs text-gray-500">{dept.category || 'No category'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MdLocationOn className="text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {getLocation(dept)}
                      </span>
                    </div>
                    {dept.location?.pincode && (
                      <div className="text-xs text-gray-500 mt-1">
                        PIN: {dept.location.pincode}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{dept.stats?.totalServices || 0}</span> Services
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{dept.stats?.totalAdmins || 0}</span> Admins
                      </div>
                      {dept.stats?.averageRating > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">{dept.stats.averageRating.toFixed(1)}</span> ★
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {dept.contact?.phone && (
                        <div className="text-sm text-gray-700">{dept.contact.phone}</div>
                      )}
                      {dept.contact?.email && (
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{dept.contact.email}</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatus(dept) === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {getStatus(dept).toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigateToEdit(dept)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1 text-sm transition-colors"
                        title="Edit department"
                      >
                        <MdEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => navigateToAdmins(dept)}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center gap-1 text-sm transition-colors"
                        title="Manage admins"
                      >
                        <MdAdminPanelSettings size={14} />
                        Admins
                      </button>
                      <button
                        onClick={() => navigateToServices(dept)}
                        className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center gap-1 text-sm transition-colors"
                        title="Manage services"
                      >
                        <GrServices size={14} />
                        Services
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-1 text-sm transition-colors"
                        title="Delete department"
                      >
                        <MdDelete size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{departments.length}</span> of{' '}
            <span className="font-medium">{pagination.totalDepartments}</span> departments
            (Page {pagination.currentPage} of {pagination.totalPages})
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${pagination.currentPage === pageNum
                        ? 'bg-red-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;