import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Map, BarChart2, Clock, Users, Bell, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'AIChat',    icon: <MessageSquare size={16} />, label: 'AI Chat' },
  { id: 'Map',       icon: <Map size={16} />,           label: 'Map' },
  { id: 'Analytics', icon: <BarChart2 size={16} />,     label: 'Analytics' },
  { id: 'Timeline',  icon: <Clock size={16} />,         label: 'Timeline' },
];

import { networkService } from '../api/networkService';

const TopNav = ({ currentView, setCurrentView, onLogout, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [notifications, setNotifications] = useState([]);
  const lastBeepRef = useRef(0);
  const lastShakeRef = useRef(0);

  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square'; // More attention-grabbing than sine
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio alert blocked or failed:', e);
    }
  };

  const fetchHealthAndAlerts = async () => {
    try {
      const health = await networkService.getHealth();
      const status = health.overallStatus || 'Healthy';
      setHealthStatus(status);

      const now = Date.now();
      
      // Trigger audio alert every 20 minutes if Critical
      if (status === 'Critical') {
        const TWENTY_MINUTES = 20 * 60 * 1000;
        if (now - lastBeepRef.current >= TWENTY_MINUTES) {
          playAlertSound();
          lastBeepRef.current = now;
        }

        // Shake the bell every 1 minute if Critical
        const ONE_MINUTE = 60 * 1000;
        if (now - lastShakeRef.current >= ONE_MINUTE) {
          setIsRinging(true);
          setTimeout(() => setIsRinging(false), 10000); // Shake for 10 seconds
          lastShakeRef.current = now;
        }
      }

      const alerts = await networkService.getAlerts();
      const formattedAlerts = alerts.map(a => ({
        id: a.id,
        title: a.title,
        time: new Date(a.createdAt).toLocaleTimeString(),
        type: a.severity.toLowerCase() === 'critical' ? 'error' : a.severity.toLowerCase() === 'warning' ? 'warning' : 'info'
      }));
      
      if (formattedAlerts.length > notifications.length && notifications.length > 0) {
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 3000);
      }
      
      setNotifications(formattedAlerts);
      setUnreadCount(formattedAlerts.filter(a => !a.isAcknowledged).length);
    } catch (err) {
      console.error('Failed to fetch health/alerts:', err);
    }
  };

  useEffect(() => {
    fetchHealthAndAlerts();
    const interval = setInterval(fetchHealthAndAlerts, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [notifications.length]);

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
          <div style={{ 
            width: 6, height: 6, 
            background: healthStatus === 'Healthy' ? '#10b981' : healthStatus === 'Degraded' ? '#f59e0b' : '#f85149', 
            borderRadius: '50%', 
            boxShadow: `0 0 6px ${healthStatus === 'Healthy' ? '#10b981' : healthStatus === 'Degraded' ? '#f59e0b' : '#f85149'}` 
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>System {healthStatus}</span>
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
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.name || 'User'}</div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
