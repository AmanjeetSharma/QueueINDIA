// pages/department/services/ServiceList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { useService } from '../../../../../context/ServiceContext';
import { useDepartment } from '../../../../../context/DepartmentContext';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiClock,
  FiFileText,
  FiUsers,
  FiSettings
} from 'react-icons/fi';

const ServiceList = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentDepartment, getDepartmentById } = useDepartment();
  const { deleteService, loading } = useService();

  const [services, setServices] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, serviceId: null, serviceName: '' });

  useEffect(() => {
    fetchDepartmentServices();
  }, [deptId]);

  const fetchDepartmentServices = async () => {
    try {
      setFetching(true);
      const deptData = await getDepartmentById(deptId);
      if (deptData?.data?.services) {
        setServices(deptData.data.services);
      }
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteClick = (service) => {
    setDeleteModal({ show: true, serviceId: service._id, serviceName: service.name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteService(deptId, deleteModal.serviceId);
      setServices(prev => prev.filter(s => s._id !== deleteModal.serviceId));
      setDeleteModal({ show: false, serviceId: null, serviceName: '' });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const canManage = () => {
    return user?.role === 'SUPER_ADMIN' ||
      currentDepartment?.staff?.some(
        staff => staff.userId?._id === user?._id || staff.userId === user?._id
      );
  };

  const getQueueTypeBadge = (type) => {
    const styles = {
      Token:  'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
      Slot:   'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30',
      Hybrid: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    };
    return styles[type] || 'bg-slate-700/60 text-slate-400 ring-1 ring-slate-600/40';
  };

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  /* ── Main ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">

            {/* Left: back + title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => navigate('/departments')}
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                aria-label="Back"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold text-slate-100 truncate leading-tight">
                  {currentDepartment?.name || 'Department'}
                  <span className="text-slate-500 font-normal"> / Services</span>
                </h1>
                <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
                  Manage all services offered by this department
                </p>
              </div>
            </div>

            {/* Right: add button */}
            {canManage() && (
              <button
                onClick={() => navigate(`/manage/departments/${deptId}/services/create`)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Add</span>
                <span className="hidden sm:inline"> Service</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

        {/* Empty state */}
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/60 mb-5">
              <FiSettings className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">No services yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              This department has no services.
              {canManage() && ' Add one to get started.'}
            </p>
            {canManage() && (
              <button
                onClick={() => navigate(`/manage/departments/${deptId}/services/create`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                deptId={deptId}
                canManage={canManage()}
                navigate={navigate}
                onDelete={handleDeleteClick}
                getQueueTypeBadge={getQueueTypeBadge}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Delete modal ──────────────────────────────────────────────────── */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModal({ show: false, serviceId: null, serviceName: '' })}
          />
          {/* panel */}
          <div className="relative z-10 w-full sm:max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl">
            {/* red accent bar */}
            <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-red-500/0 via-red-500/60 to-red-500/0 rounded-full" />

            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/15 shrink-0 mt-0.5">
                <FiTrash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100 mb-1">Delete Service</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Delete <span className="text-slate-200 font-medium">"{deleteModal.serviceName}"</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, serviceId: null, serviceName: '' })}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Service Card ─────────────────────────────────────────────────────────── */
const ServiceCard = ({ service, deptId, canManage, navigate, onDelete, getQueueTypeBadge }) => {
  const tm = service.tokenManagement || {};

  return (
    <div className="group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl overflow-hidden transition-all duration-200">

      {/* Card body */}
      <div className="p-4 sm:p-5">

        {/* Top row: name + badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 truncate leading-snug">
              {service.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono tracking-wide">
              {service.serviceCode}
            </p>
          </div>
          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wide ${getQueueTypeBadge(tm.queueType)}`}>
            {tm.queueType || 'Hybrid'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {service.description || 'No description provided'}
        </p>

        {/* Meta row – horizontal on mobile, vertical-ish on larger */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {tm.slotStartTime || '10:00'} – {tm.slotEndTime || '17:00'}
          </span>
          <span className="flex items-center gap-1.5">
            <FiUsers className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            Daily max: {tm.maxDailyServiceTokens ?? '∞'}
          </span>
          <span className="flex items-center gap-1.5">
            <FiFileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {service.requiredDocs?.length || 0} doc{service.requiredDocs?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Footer: tags + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 gap-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {service.priorityAllowed && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25 rounded-full">
                Priority
              </span>
            )}
            {service.isDocumentUploadRequired && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/25 rounded-full">
                Docs
              </span>
            )}
          </div>

          {/* Actions */}
          {canManage && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => navigate(`/manage/departments/${deptId}/services/${service._id}/edit`)}
                className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                title="Edit service"
              >
                <FiEdit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(service)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete service"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;