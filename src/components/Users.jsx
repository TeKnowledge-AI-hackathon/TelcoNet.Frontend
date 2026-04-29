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
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [modalData, setModalData] = useState({ fullName: '', email: '', role: 'Viewer' });

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

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(deleteId);
      setUsers(u => u.filter(x => x.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const deleteUser = (id) => {
    setDeleteId(id);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await userService.updateUser(editingId, modalData);
      } else {
        await userService.createUser(modalData);
      }
      setShowModal(false);
      setEditingId(null);
      setModalData({ fullName: '', email: '', role: 'Viewer' });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert('Error saving user: ' + err.message);
    }
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setModalData({ fullName: u.name, email: u.email, role: u.role });
    setShowModal(true);
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
            onClick={() => { setShowModal(true); setEditingId(null); setModalData({ fullName: '', email: '', role: 'Viewer' }); }}
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
                            onClick={() => openEdit(userItem)}
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: '#161b22', border: '1px solid #30363d', borderRadius: 24,
            width: '100%', maxWidth: 480, padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 24 }}
            >
              ×
            </button>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: '0.5rem' }}>
              {editingId ? 'Edit User' : 'Add New User'}
            </h3>
            <p style={{ color: '#8b949e', fontSize: 14, marginBottom: '2rem' }}>
              {editingId ? 'Modify user details and system permissions.' : 'Grant system access to a new team member.'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b949e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                <input 
                  type="text" 
                  value={modalData.fullName}
                  onChange={e => setModalData({...modalData, fullName: e.target.value})}
                  placeholder="e.g. John Doe"
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: '1rem', color: '#fff', outline: 'none', fontSize: 15 }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#30363d'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b949e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <input 
                  type="email" 
                  value={modalData.email}
                  onChange={e => setModalData({...modalData, email: e.target.value})}
                  placeholder="name@noc.com"
                  style={{ width: '100%', boxSizing: 'border-box', background: '#0d1117', border: '1px solid #30363d', borderRadius: 12, padding: '1rem', color: '#fff', outline: 'none', fontSize: 15 }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#30363d'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#8b949e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Role</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={modalData.role}
                    onChange={e => setModalData({...modalData, role: e.target.value})}
                    style={{ 
                      width: '100%', boxSizing: 'border-box', background: '#0d1117', 
                      border: '1px solid #30363d', borderRadius: 12, padding: '1rem', 
                      color: '#fff', outline: 'none', appearance: 'none', cursor: 'pointer',
                      fontSize: 15
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#30363d'}
                  >
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Operator">Operator (Standard)</option>
                    <option value="Viewer">Viewer (Read-only)</option>
                  </select>
                  <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8b949e' }}>▼</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: '1.5rem' }}>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid #30363d', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1c2128'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  style={{ 
                    flex: 1, padding: '1rem', background: '#3b82f6', border: 'none', borderRadius: 12, 
                    color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                >
                  {editingId ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 110, backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: '#161b22', border: '1px solid #30363d', borderRadius: 24,
            width: '100%', maxWidth: 400, padding: '2.5rem', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
          }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(248,81,73,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
              border: '1px solid rgba(248,81,73,0.3)'
            }}>
              <Trash2 size={32} color="#f85149" />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: '0.75rem' }}>Delete User</h3>
            <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6, marginBottom: '2rem' }}>
              Are you sure you want to delete this user? This action cannot be undone and will revoke all system access.
            </p>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: '0.875rem', background: 'transparent', border: '1px solid #30363d', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                No, Keep
              </button>
              <button 
                onClick={confirmDelete}
                style={{ flex: 1, padding: '0.875rem', background: '#f85149', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
