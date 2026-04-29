import React, { useState } from 'react';
import { authService } from '../api/authService';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoUsers = [
    { name: 'Admin User', email: 'admin@noc.com', role: 'admin', color: 'text-purple-400 bg-purple-400' },
    { name: 'NOC Operator', email: 'operator@noc.com', role: 'operator', color: 'text-blue-400 bg-blue-400' },
    { name: 'Read-Only Viewer', email: 'viewer@noc.com', role: 'viewer', color: 'text-gray-400 bg-gray-400' },
  ];

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 mb-8 shadow-2xl" style={{ width: '100%', maxWidth: '400px' }}>

        <h2 className="text-2xl font-bold text-center mb-8">Sign in to TelcoNet</h2>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 mb-6">
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
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#3b82f6] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
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
