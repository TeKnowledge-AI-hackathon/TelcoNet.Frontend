import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import AIChat from './components/AIChat';
import Users from './components/Users';
import Sidebar from './components/Sidebar';

const renderView = (view, user) => {
  switch (view) {
    case 'AIChat': return <AIChat user={user} />;
    case 'Users': return <Users user={user} />;
    default: return <AIChat user={user} />;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('AIChat');

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
        {renderView(currentView, user)}
      </div>
    </div>
  );
}

export default App;
