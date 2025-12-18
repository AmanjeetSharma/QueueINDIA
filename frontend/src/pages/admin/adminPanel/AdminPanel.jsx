// pages/admin/adminPanel/AdminPanel.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
    FaPlus, FaCheck, FaTimes, FaEdit, FaTrash,
    FaUsers, FaBuilding, FaFileAlt, FaChartBar,
    FaUserShield, FaSearch, FaFilter, FaSync,FaConciergeBell 
} from "react-icons/fa";
import axios from "axios";
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState("services");
    const [isLoading, setIsLoading] = useState(false);

    // Services State
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        departmentId: "",
    });

    // Departments State
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({
        name: "",
        description: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
    });

    // Documents for Approval
    const [pendingDocuments, setPendingDocuments] = useState([]);

    // Department Officers
    const [departmentOfficers, setDepartmentOfficers] = useState([]);
    const [newOfficer, setNewOfficer] = useState({
        name: "",
        email: "",
        departmentId: "",
        phone: "",
    });

    // Stats
    const [stats, setStats] = useState({
        totalServices: 0,
        totalDepartments: 0,
        pendingApprovals: 0,
        totalOfficers: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Fetch services
            const servicesRes = await axios.get("/api/admin/services", config);
            setServices(servicesRes.data);

            // Fetch departments
            const deptRes = await axios.get("/api/admin/departments", config);
            setDepartments(deptRes.data);

            // Fetch pending documents
            const docsRes = await axios.get("/api/admin/documents/pending", config);
            setPendingDocuments(docsRes.data);

            // Fetch department officers
            const officersRes = await axios.get("/api/admin/officers", config);
            setDepartmentOfficers(officersRes.data);

            // Update stats
            setStats({
                totalServices: servicesRes.data.length,
                totalDepartments: deptRes.data.length,
                pendingApprovals: docsRes.data.length,
                totalOfficers: officersRes.data.length,
            });
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Service Management
    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const res = await axios.post("/api/admin/services", newService, config);
            setServices([...services, res.data]);
            setNewService({
                name: "",
                description: "",
                duration: 30,
                price: 0,
                departmentId: "",
            });
            toast.success("Service created successfully!");
        } catch (error) {
            toast.error("Failed to create service");
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.delete(`/api/admin/services/${serviceId}`, config);
            setServices(services.filter(service => service._id !== serviceId));
            toast.success("Service deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete service");
        }
    };

    // Department Management
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const res = await axios.post("/api/admin/departments", newDepartment, config);
            setDepartments([...departments, res.data]);
            setNewDepartment({
                name: "",
                description: "",
                location: "",
                contactEmail: "",
                contactPhone: "",
            });
            toast.success("Department created successfully!");
        } catch (error) {
            toast.error("Failed to create department");
        }
    };

    // Document Approval
    const handleDocumentAction = async (documentId, action) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.put(`/api/admin/documents/${documentId}/${action}`, {}, config);
            setPendingDocuments(pendingDocuments.filter(doc => doc._id !== documentId));
            toast.success(`Document ${action === 'approve' ? 'approved' : 'rejected'}!`);
        } catch (error) {
            toast.error(`Failed to ${action} document`);
        }
    };

    // Department Officer Management
    const handleCreateOfficer = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const res = await axios.post("/api/admin/officers", newOfficer, config);
            setDepartmentOfficers([...departmentOfficers, res.data]);
            setNewOfficer({
                name: "",
                email: "",
                departmentId: "",
                phone: "",
            });
            toast.success("Officer created successfully!");
        } catch (error) {
            toast.error("Failed to create officer");
        }
    };

    const renderServicesTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Services Management</h3>
                <button
                    onClick={() => document.getElementById('createServiceModal').showModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <FaPlus /> Create Service
                </button>
            </div>

            {/* Create Service Modal */}
            <dialog id="createServiceModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Create New Service</h3>
                    <form onSubmit={handleCreateService}>
                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Service Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Duration (minutes)</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={newService.duration}
                                        onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Price (₹)</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Department</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={newService.departmentId}
                                    onChange={(e) => setNewService({ ...newService, departmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">
                                Create Service
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => document.getElementById('createServiceModal').close()}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Services List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="font-semibold">Name</th>
                                <th className="font-semibold">Department</th>
                                <th className="font-semibold">Duration</th>
                                <th className="font-semibold">Price</th>
                                <th className="font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td>
                                        <div>
                                            <div className="font-medium">{service.name}</div>
                                            <div className="text-sm text-gray-500">{service.description}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline">
                                            {departments.find(d => d._id === service.departmentId)?.name || 'Unknown'}
                                        </span>
                                    </td>
                                    <td>{service.duration} mins</td>
                                    <td>₹{service.price}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-sm btn-outline">
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service._id)}
                                                className="btn btn-sm btn-outline btn-error"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderDocumentsTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Document Approvals</h3>
                <button
                    onClick={fetchDashboardData}
                    className="btn btn-outline btn-sm"
                >
                    <FaSync /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingDocuments.map(doc => (
                    <div key={doc._id} className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold text-gray-800">{doc.userName}</h4>
                                <p className="text-sm text-gray-500">{doc.documentType}</p>
                            </div>
                            <span className="badge badge-warning">Pending</span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div>
                                <span className="text-sm text-gray-600">Submitted:</span>
                                <span className="text-sm ml-2">{new Date(doc.submittedAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">For Service:</span>
                                <span className="text-sm ml-2">{doc.serviceName}</span>
                            </div>
                        </div>

                        {doc.previewUrl && (
                            <div className="mb-4">
                                <a
                                    href={doc.previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                    View Document →
                                </a>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDocumentAction(doc._id, 'approve')}
                                className="flex-1 btn btn-success btn-sm"
                            >
                                <FaCheck /> Approve
                            </button>
                            <button
                                onClick={() => handleDocumentAction(doc._id, 'reject')}
                                className="flex-1 btn btn-error btn-sm"
                            >
                                <FaTimes /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {pendingDocuments.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border">
                    <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700">No pending documents</h4>
                    <p className="text-gray-500">All documents have been processed</p>
                </div>
            )}
        </div>
    );

    const renderOfficersTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Department Officers</h3>
                <button
                    onClick={() => document.getElementById('createOfficerModal').showModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <FaPlus /> Add Officer
                </button>
            </div>

            {/* Create Officer Modal */}
            <dialog id="createOfficerModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Add Department Officer</h3>
                    <form onSubmit={handleCreateOfficer}>
                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Officer Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={newOfficer.name}
                                    onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={newOfficer.email}
                                    onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Phone</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered w-full"
                                    value={newOfficer.phone}
                                    onChange={(e) => setNewOfficer({ ...newOfficer, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Department</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={newOfficer.departmentId}
                                    onChange={(e) => setNewOfficer({ ...newOfficer, departmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">
                                Add Officer
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => document.getElementById('createOfficerModal').close()}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Officers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentOfficers.map(officer => (
                    <div key={officer._id} className="bg-white rounded-xl shadow-sm border p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FaUserShield className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{officer.name}</h4>
                                <p className="text-sm text-gray-500">{officer.email}</p>
                                <p className="text-sm text-gray-500">{officer.phone}</p>
                                <div className="mt-2">
                                    <span className="badge badge-outline">
                                        {departments.find(d => d._id === officer.departmentId)?.name || 'Unknown Dept'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="btn btn-sm btn-outline flex-1">
                                <FaEdit /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline btn-error flex-1">
                                <FaTrash /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDepartmentsTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Departments</h3>
                <button
                    onClick={() => document.getElementById('createDepartmentModal').showModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <FaPlus /> Create Department
                </button>
            </div>

            {/* Create Department Modal */}
            <dialog id="createDepartmentModal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Create New Department</h3>
                    <form onSubmit={handleCreateDepartment}>
                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Department Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={newDepartment.name}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    value={newDepartment.description}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Location</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={newDepartment.location}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Contact Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full"
                                        value={newDepartment.contactEmail}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, contactEmail: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">
                                        <span className="label-text">Contact Phone</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className="input input-bordered w-full"
                                        value={newDepartment.contactPhone}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, contactPhone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-primary">
                                Create Department
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => document.getElementById('createDepartmentModal').close()}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Departments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map(dept => (
                    <div key={dept._id} className="bg-white rounded-xl shadow-sm border p-5">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaBuilding className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 text-lg">{dept.name}</h4>
                                <p className="text-gray-600 text-sm mt-1">{dept.description}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📍</span>
                                <span>{dept.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📧</span>
                                <span>{dept.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📞</span>
                                <span>{dept.contactPhone}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className="btn btn-sm btn-outline flex-1">
                                <FaEdit /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline btn-error flex-1">
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
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
                            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-gray-600">Manage services, departments, officers, and approvals</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FaUserShield className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Services</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalServices}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <FaConciergeBell className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Departments</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalDepartments}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaBuilding className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending Approvals</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <FaFileAlt className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Department Officers</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalOfficers}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaUsers className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border mb-6">
                    <div className="border-b">
                        <nav className="flex -mb-px">
                            {[
                                { id: "services", label: "Services", icon: FaConciergeBell },
                                { id: "departments", label: "Departments", icon: FaBuilding },
                                { id: "documents", label: "Document Approvals", icon: FaFileAlt },
                                { id: "officers", label: "Department Officers", icon: FaUsers },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.id === "documents" && stats.pendingApprovals > 0 && (
                                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                            {stats.pendingApprovals}
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
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <>
                                {activeTab === "services" && renderServicesTab()}
                                {activeTab === "departments" && renderDepartmentsTab()}
                                {activeTab === "documents" && renderDocumentsTab()}
                                {activeTab === "officers" && renderOfficersTab()}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;