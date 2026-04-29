import React, { useState, useEffect } from 'react';
import { UserCircle, Search, Pencil, Trash2, Plus, Shield } from 'lucide-react';
import { userService } from '../api/userService';

const ROLES = [
  {
    role: 'Admin',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.3)',
    perms: ['Full access', 'User management', 'System config', 'Execute actions'],
  },
  {
    role: 'Operator',
    color: '#2dd4bf',
    bg: 'rgba(45,212,191,0.07)',
    border: 'rgba(45,212,191,0.25)',
    perms: ['View data', 'Execute actions', 'Escalate incidents', 'Edit configurations'],
  },
  {
    role: 'Viewer',
    color: '#8b949e',
    bg: 'rgba(139,148,158,0.07)',
    border: 'rgba(139,148,158,0.25)',
    perms: ['View data', 'Download reports', 'Read-only access'],
  },
];

const roleBadge = {
  Admin:    { bg: 'rgba(139,92,246,0.15)',  color: '#8b5cf6', border: 'rgba(139,92,246,0.4)' },
  Operator: { bg: 'rgba(45,212,191,0.12)',  color: '#2dd4bf', border: 'rgba(45,212,191,0.35)' },
  Viewer:   { bg: 'rgba(139,148,158,0.12)', color: '#8b949e', border: 'rgba(139,148,158,0.3)' },
};

const Users = ({ user }) => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const deleteUser = (id) => {
    if (window.confirm('Delete this user?')) setUsers(u => u.filter(x => x.id !== id));
  };

  const th = {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 700,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #30363d',
    background: '#161b22',
  };

  const td = {
    padding: '1rem',
    borderBottom: '1px solid #30363d',
    fontSize: 14,
    verticalAlign: 'middle',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d1117', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem 2rem',
        borderBottom: '1px solid #30363d',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <UserCircle size={22} color="#3b82f6" />
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>User Management</h2>
          </div>
          <p style={{ color: '#8b949e', fontSize: 13 }}>Manage user access and role-based permissions</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => alert('Add user dialog coming soon')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0.625rem 1.25rem',
              background: '#3b82f6', color: 'white',
              border: 'none', borderRadius: 10,
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(59,130,246,0.25)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
          >
            <Plus size={18} /> Add User
          </button>
        )}
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Search size={18} color="#8b949e" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 12, padding: '0.875rem 1rem 0.875rem 2.75rem',
              color: '#f0f6fc', fontSize: 14, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = '#30363d'}
          />
        </div>

        {/* Users Table */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Last Active</th>
                {user?.role === 'admin' && <th style={th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(userItem => {
                const badge = roleBadge[userItem.role];
                const isActive = userItem.status === 'Active';
                return (
                  <tr
                    key={userItem.id}
                    style={{ transition: 'background 0.15s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1c2128'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{userItem.name}</div>
                      <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>{userItem.email}</div>
                    </td>
                    <td style={td}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 6,
                        fontSize: 12, fontWeight: 700,
                        background: badge.bg, color: badge.color,
                        border: `1px solid ${badge.border}`,
                      }}>
                        {userItem.role}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: isActive ? '#10b981' : '#8b949e',
                          boxShadow: isActive ? '0 0 6px #10b98188' : 'none',
                        }} />
                        <span style={{ color: isActive ? '#f0f6fc' : '#8b949e', fontSize: 14 }}>
                          {userItem.status}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...td, color: '#8b949e' }}>{userItem.lastActive}</td>
                    {user?.role === 'admin' && (
                      <td style={td}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => alert(`Editing ${userItem.name}`)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#3b82f6', display: 'flex' }}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteUser(userItem.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#f85149', display: 'flex' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Role Permission Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {ROLES.map(r => (
            <div key={r.role} style={{
              background: r.bg,
              border: `1px solid ${r.border}`,
              borderRadius: 14, padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Shield size={20} color={r.color} />
                <span style={{ fontWeight: 800, fontSize: 16, color: r.color }}>{r.role}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {r.perms.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: r.color, fontWeight: 700 }}>✓</span>
                    <span style={{ color: '#8b949e' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
