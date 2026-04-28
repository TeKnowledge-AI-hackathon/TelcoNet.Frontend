import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoUsers = [
    { name: 'Admin User', email: 'admin@noc.com', role: 'admin', color: 'text-purple-400 bg-purple-400' },
    { name: 'NOC Operator', email: 'operator@noc.com', role: 'operator', color: 'text-blue-400 bg-blue-400' },
    { name: 'Read-Only Viewer', email: 'viewer@noc.com', role: 'viewer', color: 'text-gray-400 bg-gray-400' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 mb-8 shadow-2xl" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-[#2dd4bf] rounded-xl flex items-center justify-center glow-teal" style={{ background: '#2dd4bf' }}>
             <Zap size={28} color="#000000" />
           </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8">Sign in to TelcoNet</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="email" 
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-xl outline-none focus:border-[#3b82f6] transition-colors"
          />
          <input 
            type="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] p-4 rounded-xl outline-none focus:border-[#3b82f6] transition-colors"
          />
        </div>
        
        <button 
          onClick={() => {
            const foundUser = demoUsers.find(u => u.email === email);
            const loggedInUser = foundUser || { name: 'Admin User', email: 'admin@noc.com', role: 'admin' };
            onLogin(loggedInUser);
          }}
          className="w-full bg-[#3b82f6] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          Sign In
        </button>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6" style={{ width: '100%', maxWidth: '400px' }}>
        <p className="text-[#8b949e] text-sm mb-4 font-medium">Demo Accounts</p>
        <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {demoUsers.map((user, i) => (
            <div 
              key={i}
              onClick={() => { setEmail(user.email); setPassword('password123'); }}
              className="flex justify-between items-center p-4 bg-[#0d1117] border border-[#30363d] rounded-xl cursor-pointer hover:bg-[#1c2128] transition-colors"
            >
              <div>
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-[#8b949e]">{user.email}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-opacity-10 ${user.color.split(' ')[0]} border border-current`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
