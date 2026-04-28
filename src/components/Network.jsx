import React, { useState } from 'react';
import { Activity, Wifi, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const trafficData = [
  { time: '00:00', in: 320, out: 180 },
  { time: '04:00', time2: '04:00', in: 210, out: 120 },
  { time: '08:00', in: 780, out: 450 },
  { time: '12:00', in: 1200, out: 680 },
  { time: '16:00', in: 980, out: 540 },
  { time: '20:00', in: 650, out: 380 },
  { time: '23:59', in: 420, out: 220 },
];

const packetData = [
  { time: '00:00', loss: 0.1 },
  { time: '04:00', loss: 0.05 },
  { time: '08:00', loss: 0.8 },
  { time: '12:00', loss: 2.1 },
  { time: '16:00', loss: 3.2 },
  { time: '20:00', loss: 1.4 },
  { time: '23:59', loss: 0.6 },
];

const interfaces = [
  { name: 'GE0/0/0', description: 'WAN Uplink', speed: '1 Gbps', in: '450 Mbps', out: '210 Mbps', status: 'up' },
  { name: 'GE0/0/1', description: 'Core Switch Link', speed: '10 Gbps', in: '3.2 Gbps', out: '1.8 Gbps', status: 'up' },
  { name: 'GE0/0/2', description: 'Backup Fiber', speed: '1 Gbps', in: '0 Mbps', out: '0 Mbps', status: 'standby' },
  { name: 'GE0/0/3', description: 'Server Farm', speed: '10 Gbps', in: '1.1 Gbps', out: '980 Mbps', status: 'up' },
  { name: 'GE0/0/4', description: 'DMZ Segment', speed: '1 Gbps', in: '78 Mbps', out: '34 Mbps', status: 'up' },
  { name: 'GE0/0/5', description: 'Lagos West Ring', speed: '1 Gbps', in: '0 Mbps', out: '0 Mbps', status: 'down' },
];

const statusStyle = {
  up:      { color: '#10b981', label: 'Up' },
  down:    { color: '#f85149', label: 'Down' },
  standby: { color: '#f59e0b', label: 'Standby' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#8b949e', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>
            {p.name}: {p.value} {p.name === 'loss' ? '%' : 'Mbps'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Network = () => {
  const [refreshed, setRefreshed] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d1117', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Activity size={22} color="#3b82f6" />
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Network Overview</h2>
          </div>
          <p style={{ color: '#8b949e', fontSize: 13 }}>Live interface statistics and traffic analysis</p>
        </div>
        <button
          onClick={() => { setRefreshed(true); setTimeout(() => setRefreshed(false), 1000); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.5rem 1rem', background: '#161b22',
            border: '1px solid #30363d', borderRadius: 10,
            color: '#f0f6fc', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} style={{ animation: refreshed ? 'spin 0.5s linear' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Total Bandwidth', value: '11.2 Gbps', icon: <Wifi size={20} />, color: '#3b82f6' },
            { label: 'Traffic In', value: '6.8 Gbps', icon: <ArrowDown size={20} />, color: '#10b981' },
            { label: 'Traffic Out', value: '3.9 Gbps', icon: <ArrowUp size={20} />, color: '#2dd4bf' },
            { label: 'Packet Loss', value: '3.2 %', icon: <Activity size={20} />, color: '#f59e0b' },
          ].map((k, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ padding: 8, borderRadius: 8, background: `${k.color}22`, color: k.color }}>{k.icon}</div>
              </div>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Traffic Volume (Mbps)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2128" vertical={false}/>
                <XAxis dataKey="time" stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="in" name="In" stroke="#3b82f6" strokeWidth={2} fill="url(#inGrad)"/>
                <Area type="monotone" dataKey="out" name="Out" stroke="#2dd4bf" strokeWidth={2} fill="url(#outGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Packet Loss (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={packetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2128" vertical={false}/>
                <XAxis dataKey="time" stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="loss" name="loss" fill="#f59e0b" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interface table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #30363d' }}>
            <h3 style={{ fontWeight: 700 }}>Interface Status</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#161b22' }}>
                {['Interface', 'Description', 'Speed', 'Traffic In', 'Traffic Out', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #30363d' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interfaces.map((iface, i) => {
                const s = statusStyle[iface.status];
                return (
                  <tr key={i} onMouseEnter={e => e.currentTarget.style.background='#1c2128'} onMouseLeave={e => e.currentTarget.style.background='transparent'} style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: 13, fontFamily: 'monospace', borderBottom: '1px solid #30363d' }}>{iface.name}</td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: 13, color: '#8b949e', borderBottom: '1px solid #30363d' }}>{iface.description}</td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: 13, borderBottom: '1px solid #30363d' }}>{iface.speed}</td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: 13, color: '#10b981', borderBottom: '1px solid #30363d' }}>{iface.in}</td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: 13, color: '#2dd4bf', borderBottom: '1px solid #30363d' }}>{iface.out}</td>
                    <td style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #30363d' }}>
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

export default Network;
