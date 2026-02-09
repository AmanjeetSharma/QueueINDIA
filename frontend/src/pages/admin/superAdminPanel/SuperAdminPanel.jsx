import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FaUsers, FaBuilding, FaShieldAlt, FaArrowRight, FaCog, FaChartLine } from "react-icons/fa";
import { RiDashboard3Fill } from "react-icons/ri";

const SuperAdminPanel = () => {
  const { user } = useAuth();

  const adminCards = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "System metrics and analytics",
      icon: <RiDashboard3Fill className="w-5 h-5" />,
      path: "/super-admin-panel/dashboard",
      emoji: "📊",
      hoverColor: "red" // Added hover color
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage users and permissions",
      icon: <FaUsers className="w-5 h-5" />,
      path: "/super-admin-panel/users",
      emoji: "👥",
      hoverColor: "orange"
    },
    {
      id: "departments",
      title: "Departments",
      description: "Department and services control",
      icon: <FaBuilding className="w-5 h-5" />,
      path: "/super-admin-panel/departments",
      emoji: "🏢",
      hoverColor: "amber"
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Advanced system insights",
      icon: <FaChartLine className="w-5 h-5" />,
      path: "/super-admin-panel/analytics",
      emoji: "📈",
      hoverColor: "rose"
    }
  ];

  // Function to get hover color classes
  const getHoverColorClasses = (color) => {
    const colors = {
      red: { 
        bg: 'group-hover:bg-blue-600/50', 
        border: 'group-hover:border-blue-500/50',
        icon: 'group-hover:bg-blue-600 group-hover:scale-110',
        text: 'group-hover:text-blue-300'
      },
      orange: { 
        bg: 'group-hover:bg-orange-600/50', 
        border: 'group-hover:border-orange-500/50',
        icon: 'group-hover:bg-orange-600 group-hover:scale-110',
        text: 'group-hover:text-orange-300'
      },
      amber: { 
        bg: 'group-hover:bg-purple-600/50', 
        border: 'group-hover:border-purple-500/50',
        icon: 'group-hover:bg-purple-600 group-hover:scale-110',
        text: 'group-hover:text-purple-300'
      },
      rose: { 
        bg: 'group-hover:bg-green-600/50', 
        border: 'group-hover:border-green-500/50',
        icon: 'group-hover:bg-green-600 group-hover:scale-110',
        text: 'group-hover:text-green-300'
      }
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-800/90 backdrop-blur-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Super Admin
                </h1>
                <p className="text-xs text-slate-400 mt-1">Full system control</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <FaShieldAlt className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">SUPER ADMIN</p>
                <p className="text-xs text-slate-400 truncate max-w-[100px] sm:max-w-none">
                  {user?.name?.split(' ')[0] || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome, <span className="text-red-400">Master Control</span>
                </h2>
                <p className="text-sm text-slate-300 mb-1">
                  Full system access granted to <span className="font-semibold text-red-400">{user?.name?.split(' ')[0] || 'Administrator'}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Manage users, departments, analytics, and system configurations
                </p>
              </div>

              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaShieldAlt className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-bold text-white text-sm">Full System Access</p>
                    <p className="text-xs text-red-300">All permissions enabled</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-slate-300">Complete system control</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-slate-300">Audit log access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Management Areas</h2>
              <span className="text-xs text-slate-500">{adminCards.length} sections</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {adminCards.map((card, index) => {
                const hoverClasses = getHoverColorClasses(card.hoverColor);
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="group"
                  >
                    <Link to={card.path}>
                      <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden p-4 h-full flex flex-col cursor-pointer transition-all duration-300 ${hoverClasses.bg} ${hoverClasses.border}`}>
                        <div className="relative">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center transition-all duration-300 ${hoverClasses.icon}`}>
                              {card.icon}
                            </div>
                            <div className="text-xl">
                              {card.emoji}
                            </div>
                          </div>

                          {/* Content */}
                          <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                            {card.title}
                          </h3>
                          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                            {card.description}
                          </p>

                          {/* CTA */}
                          <div className={`flex items-center gap-1.5 text-xs font-semibold text-red-400 transition-colors duration-300 ${hoverClasses.text}`}>
                            <span>Access now</span>
                            <motion.div
                              animate={{ x: [0, 2, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <FaArrowRight className="w-3 h-3" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-red-900/10 border border-red-700/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCog className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm mb-1">Security Notice</h4>
                <p className="text-xs text-slate-300">
                  You are logged in as Super Administrator. All actions are logged in the system audit trail.
                  Exercise caution when modifying system settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminPanel;