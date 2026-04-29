import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, ArrowRight, User, Terminal, Calendar } from 'lucide-react';
import { auditService } from '../api/auditService';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await auditService.getAuditLogs(page, pageSize);
        // The backend returns { total, page, pageSize, logs }
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page]);

  const filteredLogs = logs.filter(log => 
    log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    log.endpoint?.toLowerCase().includes(search.toLowerCase()) ||
    log.httpMethod?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (code) => {
    if (code >= 200 && code < 300) return '#10b981';
    if (code >= 400) return '#f85149';
    return '#f59e0b';
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
            <Shield size={22} color="#f59e0b" />
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Security Audit Log</h2>
          </div>
          <p style={{ color: '#8b949e', fontSize: 13 }}>Tracking all user actions and system events for security compliance</p>
        </div>
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Search size={18} color="#8b949e" />
            </div>
            <input
              type="text"
              placeholder="Search logs by user, action, or details..."
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
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 1.25rem', background: '#161b22',
            border: '1px solid #30363d', borderRadius: 12,
            color: '#f0f6fc', fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Logs Table */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 14, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#8b949e' }}>Loading security logs...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Timestamp</th>
                  <th style={th}>User</th>
                  <th style={th}>Action / Endpoint</th>
                  <th style={th}>Performance</th>
                  <th style={th}>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background = '#1c2128'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8b949e' }}>
                        <Calendar size={14} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #30363d' }}>
                          <User size={14} color="#8b949e" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{log.userEmail?.split('@')[0] || 'System'}</div>
                          <div style={{ fontSize: 12, color: '#8b949e' }}>{log.userEmail || 'internal-process'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ 
                          fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4, 
                          background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          {log.httpMethod}
                        </span>
                        <div style={{ fontSize: 14, color: '#f0f6fc', fontFamily: 'monospace' }}>
                          {log.endpoint}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...td, color: '#8b949e' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ fontSize: 12 }}>{log.ipAddress}</div>
                        <div style={{ fontSize: 11, color: log.durationMs > 500 ? '#f59e0b' : '#8b949e' }}>
                          ⚡ {log.durationMs}ms
                        </div>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{ 
                        padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                        background: `${getStatusColor(log.statusCode)}1a`,
                        color: getStatusColor(log.statusCode),
                        border: `1px solid ${getStatusColor(log.statusCode)}33`
                      }}>
                        HTTP {log.statusCode}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#8b949e' }}>
                      No audit logs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '1rem', background: '#161b22', border: '1px solid #30363d', borderRadius: 12 
        }}>
          <div style={{ color: '#8b949e', fontSize: 13 }}>
            Showing <span style={{ color: '#f0f6fc', fontWeight: 600 }}>{(page - 1) * pageSize + 1}</span> to <span style={{ color: '#f0f6fc', fontWeight: 600 }}>{Math.min(page * pageSize, total)}</span> of <span style={{ color: '#f0f6fc', fontWeight: 600 }}>{total}</span> logs
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{
                padding: '8px 16px', background: page === 1 ? '#0d1117' : '#21262d',
                border: '1px solid #30363d', borderRadius: 6, color: page === 1 ? '#484f58' : '#c9d1d9',
                fontSize: 13, fontWeight: 600, cursor: page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <button 
              disabled={page * pageSize >= total}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '8px 16px', background: page * pageSize >= total ? '#0d1117' : '#21262d',
                border: '1px solid #30363d', borderRadius: 6, color: page * pageSize >= total ? '#484f58' : '#c9d1d9',
                fontSize: 13, fontWeight: 600, cursor: page * pageSize >= total ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
