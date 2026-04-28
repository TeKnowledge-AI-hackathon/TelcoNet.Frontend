import React, { useState } from 'react';
import { ShieldAlert, Filter, CheckCircle2 } from 'lucide-react';

const ALL_ALERTS = [
  { id: 'AL-9283', device: 'Core Router #1',    issue: 'High CPU Utilization',       severity: 'Critical', time: '2 mins ago',   status: 'active' },
  { id: 'AL-9284', device: 'Switch 04 (L3)',     issue: 'Port flapping detected',     severity: 'Warning',  time: '15 mins ago',  status: 'active' },
  { id: 'AL-9285', device: 'Edge Gateway B',     issue: 'BGP session reset',          severity: 'Critical', time: '1 hour ago',   status: 'active' },
  { id: 'AL-9286', device: 'Firewall Primary',   issue: 'New signature update',       severity: 'Info',     time: '3 hours ago',  status: 'resolved' },
  { id: 'AL-9287', device: 'Tower LW-099',       issue: 'Power supply failure',       severity: 'Critical', time: '3 hours ago',  status: 'resolved' },
  { id: 'AL-9288', device: 'Access Point AP-22', issue: 'High interference detected', severity: 'Warning',  time: '5 hours ago',  status: 'active' },
  { id: 'AL-9289', device: 'Core Switch CS-01',  issue: 'VLAN misconfiguration',      severity: 'Warning',  time: '6 hours ago',  status: 'resolved' },
  { id: 'AL-9290', device: 'WAN Link #2',        issue: 'Throughput degraded 40%',    severity: 'Critical', time: '8 hours ago',  status: 'resolved' },
];

const sevStyle = {
  Critical: { color: '#f85149', bg: 'rgba(248,81,73,0.12)',  border: 'rgba(248,81,73,0.35)' },
  Warning:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
  Info:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
};

const Alerts = () => {
  const [filter, setFilter]   = useState('all');       // all | active | resolved
  const [sevFilter, setSev]   = useState('all');       // all | Critical | Warning | Info
  const [alerts, setAlerts]   = useState(ALL_ALERTS);

  const resolve = (id) =>
    setAlerts(a => a.map(x => x.id === id ? { ...x, status: 'resolved' } : x));

  const visible = alerts
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => sevFilter === 'all' || a.severity === sevFilter);

  const counts = {
    Critical: alerts.filter(a => a.severity === 'Critical' && a.status === 'active').length,
    Warning:  alerts.filter(a => a.severity === 'Warning'  && a.status === 'active').length,
    Info:     alerts.filter(a => a.severity === 'Info'     && a.status === 'active').length,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d1117', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #30363d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <ShieldAlert size={22} color="#f85149" />
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Incident Alerts</h2>
        </div>
        <p style={{ color: '#8b949e', fontSize: 13 }}>Monitor, filter and resolve network incidents</p>
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {['Critical', 'Warning', 'Info'].map(s => {
            const st = sevStyle[s];
            return (
              <div key={s} onClick={() => setSev(sevFilter === s ? 'all' : s)}
                className="card" style={{
                  cursor: 'pointer', borderColor: sevFilter === s ? st.border : undefined,
                  background: sevFilter === s ? st.bg : undefined,
                }}>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>{s} Alerts</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: st.color }}>{counts[s]}</div>
                <div style={{ fontSize: 11, color: '#8b949e', marginTop: 4 }}>Active</div>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'active', 'resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
              background: filter === f ? '#3b82f6' : '#161b22',
              color: filter === f ? '#fff' : '#8b949e',
              transition: 'all 0.15s',
            }}>
              {f === 'all' ? `All (${alerts.length})` : f === 'active' ? `Active (${alerts.filter(a=>a.status==='active').length})` : `Resolved (${alerts.filter(a=>a.status==='resolved').length})`}
            </button>
          ))}
        </div>

        {/* Alerts table */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0d1117' }}>
                {['ID', 'Device', 'Issue', 'Severity', 'Time', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #30363d' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((a, i) => {
                const s = sevStyle[a.severity];
                const isActive = a.status === 'active';
                return (
                  <tr key={i}
                    onMouseEnter={e => e.currentTarget.style.background='#1c2128'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    style={{ transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: 12, color: '#8b949e', borderBottom: '1px solid #30363d' }}>{a.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, fontSize: 13, borderBottom: '1px solid #30363d' }}>{a.device}</td>
                    <td style={{ padding: '1rem', fontSize: 13, color: '#8b949e', borderBottom: '1px solid #30363d' }}>{a.issue}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #30363d' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{a.severity}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: 12, color: '#8b949e', borderBottom: '1px solid #30363d' }}>{a.time}</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #30363d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? '#f85149' : '#10b981', animation: isActive ? 'pulse 1.5s infinite' : 'none' }}/>
                        <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#f85149' : '#10b981' }}>{isActive ? 'Active' : 'Resolved'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid #30363d' }}>
                      {isActive && (
                        <button onClick={() => resolve(a.id)} style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.35)',
                          background: 'rgba(16,185,129,0.1)', color: '#10b981',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>
                          <CheckCircle2 size={13}/> Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
