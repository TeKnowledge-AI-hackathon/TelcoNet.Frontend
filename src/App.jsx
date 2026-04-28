import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import AIChat from './components/AIChat';
import Users from './components/Users';
import Sidebar from './components/Sidebar';
import SettingsPage from './components/SettingsPage';
import TopNav from './components/TopNav';
import Analytics from './components/Analytics';
import NetworkMap from './components/NetworkMap';
import Timeline from './components/Timeline';
import { applyTheme } from './themeUtils';

const renderView = (view, user, aiQuery, setAiQuery, setCurrentView) => {
  switch (view) {
    case 'AIChat': return <AIChat user={user} initialQuery={aiQuery} setInitialQuery={setAiQuery} />;
    case 'Map': return <NetworkMap setAiQuery={setAiQuery} setCurrentView={setCurrentView} />;
    case 'Analytics': return <Analytics />;
    case 'Timeline': return <Timeline />;
    case 'Users': return <Users user={user} />;
    case 'Settings': return <SettingsPage />;
    default: return <AIChat user={user} initialQuery={aiQuery} setInitialQuery={setAiQuery} />;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('AIChat');
  const [aiQuery, setAiQuery] = useState(null);

  useEffect(() => {
    applyTheme(0);
  }, []);

  if (!user) {
    return <LoginPage onLogin={(u) => setUser(u)} />;
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#0d1117', color: '#f0f6fc' }}>
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={() => { setUser(null); setCurrentView('AIChat'); }}
        user={user}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <TopNav currentView={currentView} setCurrentView={setCurrentView} onLogout={() => { setUser(null); setCurrentView('AIChat'); }} />
        {renderView(currentView, user, aiQuery, setAiQuery, setCurrentView)}
      </div>
    </div>
  );
}

export default App;
