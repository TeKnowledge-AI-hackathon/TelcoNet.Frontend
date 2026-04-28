import React from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Zap, Activity, TrendingUp, Users } from 'lucide-react';

const latencyData = [
  { time: '00:00', lagosWest: 450, lagosIsland: 42, ikeja: 28, victoriaIsland: 35 },
  { time: '04:00', lagosWest: 470, lagosIsland: 38, ikeja: 25, victoriaIsland: 30 },
  { time: '08:00', lagosWest: 490, lagosIsland: 55, ikeja: 32, victoriaIsland: 45 },
  { time: '12:00', lagosWest: 460, lagosIsland: 48, ikeja: 29, victoriaIsland: 38 },
  { time: '16:00', lagosWest: 455, lagosIsland: 44, ikeja: 27, victoriaIsland: 34 },
  { time: '20:00', lagosWest: 448, lagosIsland: 40, ikeja: 24, victoriaIsland: 32 },
];

const throughputData = [
  { time: '00:00', throughput: 2.1 },
  { time: '04:00', throughput: 1.9 },
  { time: '08:00', throughput: 3.0 },
  { time: '12:00', throughput: 4.1 },
  { time: '16:00', throughput: 4.2 },
  { time: '20:00', throughput: 4.5 },
];

const kpis = [
  {
    icon: <Zap size={22} />,
    iconBg: '#1d4ed8',
    label: 'Avg Latency',
    sublabel: 'Lagos West',
    value: '450',
    unit: 'ms',
    trend: '+285%',
    trendBad: true,
  },
  {
    icon: <Activity size={22} />,
    iconBg: '#92400e',
    label: 'Packet Loss',
    sublabel: 'Network-wide',
    value: '3.2',
    unit: '%',
    trend: '+3.2%',
    trendBad: true,
  },
  {
    icon: <TrendingUp size={22} />,
    iconBg: '#065f46',
    label: 'Throughput',
    sublabel: 'Peak today',
    value: '4.5',
    unit: 'Gbps',
    trend: '+12%',
    trendBad: false,
  },
  {
    icon: <Users size={22} />,
    iconBg: '#4c1d95',
    label: 'Active Users',
    sublabel: 'Current',
    value: '42.5',
    unit: 'K',
    trend: '-8% vs avg',
    trendBad: true,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ color: '#8b949e', fontSize: 12, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>
            {p.name}: {p.value}{p.name === 'throughput' ? ' Gbps' : ' ms'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] min-h-screen overflow-y-auto">
      <div className="px-8 py-6 border-b border-[#30363d]">
        <h2 className="text-2xl font-bold mb-1">Performance Analytics</h2>
        <p className="text-[#8b949e] text-sm">Network-wide metrics and regional comparisons</p>
      </div>

      <div className="p-8 space-y-8">
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {kpis.map((kpi, i) => (
            <div key={i} className="card cursor-pointer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: kpi.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                }}>
                  {kpi.icon}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: kpi.trendBad ? '#f85149' : '#10b981' }}>
                  {kpi.trend}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{kpi.label}</div>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 10 }}>{kpi.sublabel}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 800 }}>{kpi.value}</span>
                <span style={{ fontSize: 14, color: '#8b949e' }}>{kpi.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Latency Line Chart */}
        <div className="card">
          <h3 className="font-bold text-lg mb-6">Latency Comparison - Regional Performance (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2128" vertical={false} />
              <XAxis dataKey="time" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
                formatter={(val) => <span style={{ color: '#8b949e' }}>{val}</span>}
              />
              <Line type="monotone" dataKey="lagosWest" name="Lagos West" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="lagosIsland" name="Lagos Island" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ikeja" name="Ikeja" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="victoriaIsland" name="Victoria Island" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Throughput Area Chart */}
        <div className="card">
          <h3 className="font-bold text-lg mb-6">Network Throughput (24h)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={throughputData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2128" vertical={false} />
              <XAxis dataKey="time" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="throughput"
                name="throughput"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#throughputGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
