import React, { useState, useEffect } from 'react';
import { MessageSquare, Map, BarChart2, Clock, Users, Bell, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'AIChat',    icon: <MessageSquare size={16} />, label: 'AI Chat' },
  { id: 'Map',       icon: <Map size={16} />,           label: 'Map' },
  { id: 'Analytics', icon: <BarChart2 size={16} />,     label: 'Analytics' },
  { id: 'Timeline',  icon: <Clock size={16} />,         label: 'Timeline' },
];

const TopNav = ({ currentView, setCurrentView, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Tower Lagos-Garki failed', time: '2 mins ago', type: 'error' },
    { id: 2, title: 'High latency on Ikeja backhaul', time: '15 mins ago', type: 'warning' },
    { id: 3, title: 'Maintenance scheduled for VI', time: '1 hr ago', type: 'info' },
  ]);

  // Simulate an incoming notification after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Play sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play blocked by browser interaction policy:", e));

      // Trigger shake animation
      setIsRinging(true);
      setUnreadCount(prev => prev + 1);

      // Add new notification to list
      setNotifications(prev => [
        { id: Date.now(), title: 'CRITICAL: Core Router Port Harcourt unreachable', time: 'Just now', type: 'error' },
        ...prev
      ]);

      // Stop shaking after 3 seconds
      setTimeout(() => setIsRinging(false), 3000);
    }, 5000); // Triggers 5 seconds after dashboard loads

    return () => clearTimeout(timer);
  }, []);

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
      {/* Left side brand */}
      <div style={{ display: 'flex', alignItems: 'center', width: '200px' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>
          Data Center
        </span>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
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

      {/* Right side - Notifications and Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
        
        {/* System Healthy Pill */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: '#161b22', padding: '0.375rem 0.75rem', 
          borderRadius: '999px', border: '1px solid #30363d',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>System Healthy</span>
          <Activity size={14} color="#8b949e" />
        </div>
        
        <style>{`
          @keyframes bellRing {
            0% { transform: rotate(0); }
            15% { transform: rotate(15deg); }
            30% { transform: rotate(-15deg); }
            45% { transform: rotate(10deg); }
            60% { transform: rotate(-10deg); }
            75% { transform: rotate(5deg); }
            85% { transform: rotate(-5deg); }
            100% { transform: rotate(0); }
          }
          .bell-shake {
            animation: bellRing 0.8s ease-in-out infinite;
            transform-origin: top center;
            display: inline-block;
          }
        `}</style>
        
        <div style={{ position: 'relative' }}>
          <div 
            style={{ position: 'relative', cursor: 'pointer', padding: '0.25rem' }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setUnreadCount(0); // clear unread count on open
              setIsRinging(false);
            }}
          >
            <div className={isRinging ? 'bell-shake' : ''}>
              <Bell size={20} color={showNotifications || isRinging ? "#fff" : "#8b949e"} />
            </div>
            
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 14, height: 14,
                background: '#f85149',
                borderRadius: '50%',
                border: '2px solid var(--bg-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 9, fontWeight: 'bold'
              }}>
                {unreadCount}
              </div>
            )}
          </div>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
              width: 320, background: '#161b22', border: '1px solid #30363d',
              borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 50, overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #30363d', fontWeight: 600, fontSize: 14 }}>
                Recent Alerts
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ 
                    padding: '12px 16px', borderBottom: '1px solid #30363d',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }} onMouseEnter={e => e.currentTarget.style.background = '#1c2128'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ 
                        width: 8, height: 8, borderRadius: '50%', 
                        background: n.type === 'error' ? '#f85149' : n.type === 'warning' ? '#f59e0b' : '#3b82f6' 
                      }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#c9d1d9' }}>{n.title}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#8b949e', paddingLeft: 16 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Admin User</div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-color)' }} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
