import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartment } from "../../../context/DepartmentContext";
import { useService } from "../../../context/ServiceContext";
import { useAuth } from "../../../context/AuthContext";

import DashboardTab from "./components/DashboardTab";
import UserManagementTab from "./components/UserManagement/UserManagementTab";
import DepartmentManagementTab from "./components/DepartmentManagement/DepartmentManagementTab";
import Icon from "./components/Icon";

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { loading: deptLoading } = useDepartment();
  const { loading: serviceLoading } = useService();
  const { user, loading: authLoading } = useAuth();

  // 🔥 ONLY auth should block rendering
  const showGlobalLoader = authLoading;
  const showSoftLoader = deptLoading || serviceLoading;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "users", label: "User Management", icon: "users" },
    { id: "departments", label: "Departments", icon: "department" }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex">

      {/* SIDEBAR */}
      <aside className="w-60 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
              <Icon name="superadmin" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base truncate">Super Admin</h1>
              <p className="text-xs text-gray-500 truncate">System Controller</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon name={tab.icon} size={18} />
              <span className="font-medium text-sm truncate">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* HEADER */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/60 backdrop-blur-md border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-lg capitalize">
              {activeTab.replace("-", " ")}
            </h2>
            <p className="text-xs text-gray-500">Real-time system control</p>
          </div>

          {/* USER */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm"
          >
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name || "Super Admin"}</p>
              <p className="text-xs text-red-600">FULL SYSTEM ACCESS</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </motion.div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-hidden p-4 relative">

          {/* 🔴 HARD BLOCK — ONLY for auth */}
          {showGlobalLoader && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          )}

          {/* 🟡 SOFT LOADER — data refresh */}
          {showSoftLoader && (
            <div className="absolute top-4 right-4 z-40">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full bg-white rounded-2xl shadow-lg p-4 overflow-auto"
            >
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "users" && <UserManagementTab />}
              {activeTab === "departments" && <DepartmentManagementTab />}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
