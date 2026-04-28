import React, { useState } from 'react';
import { Server, Search, Cpu, Wifi, Router } from 'lucide-react';

const DEVICES = [
  { id: 'DEV-001', name: 'Core Router #1',      type: 'Router',        ip: '10.0.0.1',   location: 'Lagos DC',       status: 'online',  cpu: 87, uptime: '142d 6h' },
  { id: 'DEV-002', name: 'Core Router #2',      type: 'Router',        ip: '10.0.0.2',   location: 'Lagos DC',       status: 'online',  cpu: 34, uptime: '142d 6h' },
  { id: 'DEV-003', name: 'Switch CS-01',        type: 'Switch',        ip: '10.0.1.1',   location: 'Lagos DC',       status: 'online',  cpu: 12, uptime: '89d 14h' },
  { id: 'DEV-004', name: 'Switch CS-02',        type: 'Switch',        ip: '10.0.1.2',   location: 'Lagos DC',       status: 'online',  cpu: 18, uptime: '89d 14h' },
  { id: 'DEV-005', name: 'Firewall FW-01',      type: 'Firewall',      ip: '10.0.2.1',   location: 'Lagos DC',       status: 'online',  cpu: 44, uptime: '200d 2h' },
  { id: 'DEV-006', name: 'Tower LW-099',        type: 'Access Point',  ip: '192.168.5.9',location: 'Lagos West',     status: 'offline', cpu: 0,  uptime: 'N/A' },
  { id: 'DEV-007', name: 'Edge Gateway B',      type: 'Router',        ip: '10.0.3.5',   location: 'Victoria Island',status: 'warning', cpu: 72, uptime: '45d 8h' },
  { id: 'DEV-008', name: 'Switch L3-04',        type: 'Switch',        ip: '10.0.1.4',   location: 'Ikeja',          status: 'warning', cpu: 65, uptime: '12d 3h' },
  { id: 'DEV-009', name: 'Access Point AP-22',  type: 'Access Point',  ip: '192.168.3.22',location: 'Lagos Island',  status: 'online',  cpu: 8,  uptime: '30d 0h' },
  { id: 'DEV-010', name: 'WAN Link #2',         type: 'Router',        ip: '10.0.4.1',   location: 'Lagos West',     status: 'online',  cpu: 29, uptime: '67d 11h' },
];

const typeIcon = {
  Router:        <Router size={16} />,
  Switch:        <Server size={16} />,
  Firewall:      <Wifi size={16} />,
  'Access Point': <Wifi size={16} />,
};

const statStyle = {
  online:  { color: '#10b981', label: 'Online' },
  offline: { color: '#f85149', label: 'Offline' },
  warning: { color: '#f59e0b', label: 'Warning' },
};

const Devices = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setType] = useState('all');

  const types = ['all', ...new Set(DEVICES.map(d => d.type))];

  const visible = DEVICES
    .filter(d => typeFilter === 'all' || d.type === typeFilter)
    .filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ip.includes(search) ||
      d.location.toLowerCase().includes(search.toLowerCase())
    );

  const online  = DEVICES.filter(d => d.status === 'online').length;
  const offline = DEVICES.filter(d => d.status === 'offline').length;
  const warning = DEVICES.filter(d => d.status === 'warning').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d1117', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #30363d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Server size={22} color="#2dd4bf" />
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Device Inventory</h2>
        </div>
        <p style={{ color: '#8b949e', fontSize: 13 }}>All managed network devices and their current status</p>
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Total Devices', value: DEVICES.length, color: '#3b82f6' },
            { label: 'Online',        value: online,          color: '#10b981' },
            { label: 'Warning',       value: warning,         color: '#f59e0b' },
            { label: 'Offline',       value: offline,         color: '#f85149' },
          ].map((s, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Search size={16} color="#8b949e" />
            </div>
            <input
              type="text" placeholder="Search devices..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: '#161b22', border: '1px solid #30363d', borderRadius: 10, padding: '0.625rem 1rem 0.625rem 2.5rem', color: '#f0f6fc', fontSize: 13, outline: 'none' }}
              onFocus={e => e.target.style.borderColor='#3b82f6'}
              onBlur={e => e.target.style.borderColor='#30363d'}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {types.map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 12,
                background: typeFilter === t ? '#3b82f6' : '#161b22',
                color: typeFilter === t ? '#fff' : '#8b949e',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}>
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0d1117' }}>
                {['Device', 'Type', 'IP Address', 'Location', 'CPU', 'Uptime', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #30363d' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((d, i) => {
                const s = statStyle[d.status];
                const cpuColor = d.cpu > 80 ? '#f85149' : d.cpu > 60 ? '#f59e0b' : '#10b981';
                return (
                  <tr key={i}
                    onMouseEnter={e => e.currentTarget.style.background='#1c2128'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    style={{ transition: 'background 0.15s', cursor: 'default' }}
                  >
                    <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #30363d' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>{d.id}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #30363d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8b949e' }}>
                        {typeIcon[d.type]}{d.type}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: 12, color: '#8b949e', borderBottom: '1px solid #30363d' }}>{d.ip}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: 13, color: '#8b949e', borderBottom: '1px solid #30363d' }}>{d.location}</td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #30363d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: '#30363d', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${d.cpu}%`, background: cpuColor, borderRadius: 99 }}/>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: cpuColor, width: 32, textAlign: 'right' }}>{d.cpu}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: 12, color: '#8b949e', fontFamily: 'monospace', borderBottom: '1px solid #30363d' }}>{d.uptime}</td>
                    <td style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #30363d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}88` }}/>
                        <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
                      </div>
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

export default Devices;
