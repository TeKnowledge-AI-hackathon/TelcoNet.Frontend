import React, { useState } from 'react';
import { authService } from '../api/authService';

const LoginPage = ({ onLogin, onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


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


      <p style={{ color: '#8b949e', fontSize: 13, marginTop: 24 }}>
        Don't have an account?{' '}
        <button
          onClick={onGoToSignup}
          style={{
            background: 'none', border: 'none', color: '#3b82f6',
            cursor: 'pointer', fontWeight: 700, fontSize: 13, padding: 0,
          }}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
