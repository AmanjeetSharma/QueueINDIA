const Icon = ({ name, className = "" }) => {
  const icons = {
    dashboard: "📊",
    users: "👥",
    queue: "📋",
    analytics: "📈",
    settings: "⚙️",
    logout: "🚪",
    menu: "☰",
    bell: "🔔",
    search: "🔍",
    plus: "➕",
    edit: "✏️",
    delete: "🗑️",
    check: "✅",
    close: "❌",
    calendar: "📅",
    time: "⏰",
    location: "📍",
    department: "🏢",
    service: "🎯",
    officer: "👨‍💼",
    document: "📄",
    superadmin: "👑",
    admin: "🛡️",
    building: "🏛️",
    userCog: "👤⚙️",
    fileText: "📝",
    arrowLeft: "←",
    buildingAdd: "🏢➕",
    list: "📋",
    grid: "☰",
    filter: "🔍",
    download: "⬇️",
    upload: "⬆️"
  };
  
  return <span className={className}>{icons[name] || name}</span>;
};

export default Icon;