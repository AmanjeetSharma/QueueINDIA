// pages/admin/officerPanel/OfficerPanel.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { 
  FaCheck, FaTimes, FaFileAlt, FaUser, 
  FaCalendarAlt, FaClock, FaSearch,
  FaFilter, FaSync, FaEye, FaDownload,
  FaChartBar, FaBell, FaCalendarCheck
} from "react-icons/fa";
import axios from "axios";
import toast from 'react-hot-toast';
const OfficerPanel = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("documents");
  const [isLoading, setIsLoading] = useState(false);
  
  // Documents for Approval
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [documentFilter, setDocumentFilter] = useState("all");
  
  // Department Details
  const [department, setDepartment] = useState(null);
  
  // Department Stats
  const [stats, setStats] = useState({
    pendingDocuments: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalProcessed: 0,
  });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchOfficerData();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [pendingDocuments, documentFilter, searchTerm, dateFilter]);

  const fetchOfficerData = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch officer's department
      const deptRes = await axios.get("/api/officer/department", config);
      setDepartment(deptRes.data);
      
      // Fetch pending documents for department
      const docsRes = await axios.get(`/api/officer/documents/pending`, config);
      setPendingDocuments(docsRes.data);
      
      // Fetch stats
      const statsRes = await axios.get("/api/officer/stats", config);
      setStats(statsRes.data);
      
    } catch (error) {
      toast.error("Failed to fetch officer data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...pendingDocuments];

    // Apply document type filter
    if (documentFilter !== "all") {
      filtered = filtered.filter(doc => doc.documentType === documentFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.userName.toLowerCase().includes(term) ||
        doc.documentType.toLowerCase().includes(term) ||
        doc.serviceName.toLowerCase().includes(term)
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(doc => 
        new Date(doc.submittedAt).toDateString() === filterDate
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleDocumentAction = async (documentId, action, reason = "") => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.put(`/api/officer/documents/${documentId}/${action}`, { reason }, config);
      
      // Remove from pending documents
      setPendingDocuments(pendingDocuments.filter(doc => doc._id !== documentId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingDocuments: prev.pendingDocuments - 1,
        [action === 'approve' ? 'approvedToday' : 'rejectedToday']: 
          prev[action === 'approve' ? 'approvedToday' : 'rejectedToday'] + 1,
        totalProcessed: prev.totalProcessed + 1
      }));
      
      toast.success(`Document ${action}ed successfully!`);
      
    } catch (error) {
      toast.error(`Failed to ${action} document`);
    }
  };

  const handleRejectWithReason = (documentId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      handleDocumentAction(documentId, "reject", reason);
    }
  };

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, document type, or service..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="select select-bordered"
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value)}
            >
              <option value="all">All Document Types</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="voter">Voter ID</option>
              <option value="driving">Driving License</option>
              <option value="other">Other Documents</option>
            </select>
            
            <input
              type="date"
              className="input input-bordered"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            
            <button 
              onClick={() => {
                setDocumentFilter("all");
                setSearchTerm("");
                setDateFilter("");
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map(doc => (
          <div key={doc._id} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaFileAlt className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">{doc.userName}</h4>
                  <p className="text-gray-600 text-sm">{doc.userEmail}</p>
                  <div className="mt-1">
                    <span className="badge badge-info">{doc.documentType}</span>
                  </div>
                </div>
              </div>
              <span className="badge badge-warning">Pending Review</span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="w-4 h-4" />
                <span className="text-sm">Submitted: {new Date(doc.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="w-4 h-4" />
                <span className="text-sm">For Service: {doc.serviceName}</span>
              </div>
              {doc.remarks && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                  <p className="text-sm text-yellow-800">{doc.remarks}</p>
                </div>
              )}
            </div>

            {/* Document Preview */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Document Preview</span>
                <div className="flex gap-2">
                  <a 
                    href={doc.previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    <FaEye /> View
                  </a>
                  <a 
                    href={doc.downloadUrl} 
                    className="btn btn-sm btn-outline"
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              </div>
              {doc.previewUrl && doc.previewUrl.endsWith('.pdf') ? (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <FaFileAlt className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">PDF Document</p>
                  <p className="text-xs text-gray-500">Click view to open</p>
                </div>
              ) : (
                <img 
                  src={doc.previewUrl} 
                  alt="Document preview" 
                  className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='12' text-anchor='middle' dy='.3em' fill='%239ca3af'%3EDocument%3C/text%3E%3C/svg%3E";
                  }}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDocumentAction(doc._id, 'approve')}
                className="flex-1 btn btn-success"
              >
                <FaCheck /> Approve
              </button>
              <button
                onClick={() => handleRejectWithReason(doc._id)}
                className="flex-1 btn btn-error"
              >
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700">No documents found</h4>
          <p className="text-gray-500">
            {searchTerm || documentFilter !== "all" || dateFilter 
              ? "Try adjusting your filters" 
              : "All documents have been processed"}
          </p>
        </div>
      )}
    </div>
  );

  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* Department Info */}
      {department && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{department.name}</h3>
              <p className="text-gray-600">{department.description}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaBuilding className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span className="text-gray-700">{department.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span className="text-gray-700">{department.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span className="text-gray-700">{department.contactPhone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setActiveTab("documents")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved Today</p>
              <p className="text-2xl font-bold text-gray-800">{stats.approvedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejected Today</p>
              <p className="text-2xl font-bold text-gray-800">{stats.rejectedToday}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimes className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Processed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProcessed}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaChartBar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item % 2 === 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {item % 2 === 0 ? (
                  <FaCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <FaTimes className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Aadhar Card</span> for John Doe was 
                  {item % 2 === 0 ? ' approved' : ' rejected'}
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApprovedTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Approved Documents</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="font-semibold">User</th>
                <th className="font-semibold">Document Type</th>
                <th className="font-semibold">Service</th>
                <th className="font-semibold">Approved On</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="font-medium">User {item}</div>
                        <div className="text-xs text-gray-500">user{item}@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">Aadhar Card</span>
                  </td>
                  <td>Service {item}</td>
                  <td>Today, 10:{item}0 AM</td>
                  <td>
                    <button className="btn btn-sm btn-outline">
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRejectedTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rejected Documents</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="font-semibold">User</th>
                <th className="font-semibold">Document Type</th>
                <th className="font-semibold">Service</th>
                <th className="font-semibold">Rejected On</th>
                <th className="font-semibold">Reason</th>
                <th className="font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="font-medium">User {item}</div>
                        <div className="text-xs text-gray-500">user{item}@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-error">PAN Card</span>
                  </td>
                  <td>Service {item}</td>
                  <td>Today, 11:{item}0 AM</td>
                  <td>
                    <span className="text-sm text-gray-600">Document unclear</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline">
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Department Officer Panel</h1>
              <p className="text-gray-600">Review and approve user documents for your department</p>
            </div>
            <div className="flex items-center gap-4">
              {department && (
                <div className="text-right hidden md:block">
                  <p className="font-medium">{department.name}</p>
                  <p className="text-sm text-gray-500">Department Officer</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex flex-wrap -mb-px">
              {[
                { id: "dashboard", label: "Dashboard", icon: FaChartBar },
                { id: "documents", label: "Pending Documents", icon: FaFileAlt },
                { id: "approved", label: "Approved", icon: FaCheck },
                { id: "rejected", label: "Rejected", icon: FaTimes },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === "documents" && stats.pendingDocuments > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {stats.pendingDocuments}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === "dashboard" && renderDashboardTab()}
                {activeTab === "documents" && renderDocumentsTab()}
                {activeTab === "approved" && renderApprovedTab()}
                {activeTab === "rejected" && renderRejectedTab()}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={fetchOfficerData}
              className="btn btn-outline"
            >
              <FaSync /> Refresh Data
            </button>
            <button className="btn btn-outline">
              <FaCalendarCheck /> View Today's Summary
            </button>
            <button className="btn btn-outline">
              <FaBell /> Notifications
            </button>
            <button className="btn btn-outline">
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerPanel;