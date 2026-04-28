import React from 'react';
import { MessageSquare, Map, BarChart2, Clock, Users, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'AIChat',    icon: <MessageSquare size={16} />, label: 'AI Chat' },
  { id: 'Map',       icon: <Map size={16} />,           label: 'Map' },
  { id: 'Analytics', icon: <BarChart2 size={16} />,     label: 'Analytics' },
  { id: 'Timeline',  icon: <Clock size={16} />,         label: 'Timeline' },
  { id: 'Users',     icon: <Users size={16} />,         label: 'Users' },
];

const TopNav = ({ currentView, setCurrentView, onLogout }) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: '#0d1117',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        height: '4rem',
        flexShrink: 0,
      }}
    >
      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.625rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.15s',
              background: currentView === item.id ? '#3b82f6' : 'transparent',
              color: currentView === item.id ? '#fff' : '#8b949e',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side - Just notifications/status since Sidebar has profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: '#161b22', padding: '0.375rem 0.875rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>System Healthy</span>
        </div>
        
        <div style={{ position: 'relative', cursor: 'pointer', padding: '0.25rem' }}>
          <Bell size={20} color="#8b949e" />
          <div style={{
            position: 'absolute', top: 2, right: 2,
            width: 8, height: 8,
            background: '#f85149',
            borderRadius: '50%',
            border: '2px solid #0d1117',
          }} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
