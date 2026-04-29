import React, { useState } from 'react';
import { authService } from '../api/authService';

const SignupPage = ({ onLogin, onGoToLogin }) => {
  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const handleSignup = async () => {
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ fullName: fullName.trim(), email: email.trim(), password, role: 'view' });
      setSuccess('Account created! Signing you in…');
      // Auto-login after registration
      const data = await authService.login({ email: email.trim(), password });
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 12,
    padding: '1rem',
    color: '#f0f6fc',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#8b949e',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: '#0d1117',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      {/* Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(59,130,246,0.4)',
        }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>T</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>TelcoNet NOC</span>
      </div>

      {/* Card */}
      <div style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 20,
        padding: '2.5rem',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 4 }}>
          Create an account
        </h2>
        <p style={{ color: '#8b949e', fontSize: 13, textAlign: 'center', marginBottom: 28 }}>
          Request access to the TelcoNet NOC dashboard
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.4)',
            color: '#f85149', borderRadius: 10, padding: '0.75rem 1rem',
            fontSize: 13, marginBottom: 20, textAlign: 'center',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)',
            color: '#10b981', borderRadius: 10, padding: '0.75rem 1rem',
            fontSize: 13, marginBottom: 20, textAlign: 'center',
          }}>
            ✓ {success}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="name@noc.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 13,
                }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                style={{ ...inputStyle, paddingRight: '3rem' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 13,
                }}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              width: '100%', padding: '1rem',
              background: loading ? '#1e40af' : '#3b82f6',
              color: '#fff', border: 'none', borderRadius: 12,
              fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
              transition: 'all 0.2s',
              marginTop: 4,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#3b82f6'; }}
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </div>
      </div>

      {/* Footer link */}
      <p style={{ color: '#8b949e', fontSize: 13, marginTop: 24 }}>
        Already have an account?{' '}
        <button
          onClick={onGoToLogin}
          style={{
            background: 'none', border: 'none', color: '#3b82f6',
            cursor: 'pointer', fontWeight: 700, fontSize: 13, padding: 0,
          }}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default SignupPage;
