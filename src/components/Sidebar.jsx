import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  Server, 
  Settings, 
  MessageSquare,
  Zap,
  Shield
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, onLogout, user }) => {
  const menuItems = [
    { id: 'AIChat', icon: <MessageSquare size={20} />, label: 'AI Intelligence' },
  ];
  
  if (user && user.role === 'Admin') {
    menuItems.push({ id: 'Users', icon: <Server size={20} />, label: 'Users' });
    menuItems.push({ id: 'AuditLog', icon: <Shield size={20} />, label: 'Audit Log' });
  }

  menuItems.push({ id: 'Settings', icon: <Settings size={20} />, label: 'Settings' });

  return (
    <div className="w-64 h-screen border-r border-[#30363d] flex flex-col p-4 bg-[#0d1117] sticky top-0 shrink-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <span className="text-xl font-bold tracking-tight">TelcoNet <span className="text-[#2dd4bf]">NOC</span></span>
      </div>

      <div className="flex-1 space-y-2">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-[#161b22] text-[#2dd4bf] border border-[#30363d] glow-teal' 
                : 'text-[#8b949e] hover:bg-[#161b22] hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 bg-[#161b22] rounded-2xl border border-[#30363d]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-bold">
            {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-[#8b949e] uppercase">{user?.role}</div>
          </div>
        </div>
        <button 
          onClick={() => onLogout()}
          className="w-full py-2 text-xs font-semibold text-[#8b949e] hover:text-white transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
