import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Zap, Activity, TrendingUp, Users } from 'lucide-react';
import { dashboardService } from '../api/dashboardService';

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
  const [kpisData, setKpisData] = useState(null);
  const [latencyChart, setLatencyChart] = useState([]);
  const [throughputChart, setThroughputChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpis, latency, throughput] = await Promise.all([
          dashboardService.getKpis(),
          dashboardService.getLatencyChart(),
          dashboardService.getThroughputChart(),
        ]);
        setKpisData(kpis);
        setLatencyChart(latency);
        setThroughputChart(throughput);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = [
    {
      icon: <Zap size={22} />,
      iconBg: '#1d4ed8',
      label: 'Avg Latency',
      sublabel: kpisData?.avgLatency?.scope || 'Global',
      value: kpisData?.avgLatency?.value || '0',
      unit: kpisData?.avgLatency?.unit || 'ms',
      trend: `${kpisData?.avgLatency?.changePercent > 0 ? '+' : ''}${kpisData?.avgLatency?.changePercent || 0}%`,
      trendBad: (kpisData?.avgLatency?.changePercent || 0) > 0,
    },
    {
      icon: <Activity size={22} />,
      iconBg: '#92400e',
      label: 'Packet Loss',
      sublabel: kpisData?.packetLoss?.scope || 'Network-wide',
      value: kpisData?.packetLoss?.value || '0',
      unit: kpisData?.packetLoss?.unit || '%',
      trend: `${kpisData?.packetLoss?.changePercent > 0 ? '+' : ''}${kpisData?.packetLoss?.changePercent || 0}%`,
      trendBad: (kpisData?.packetLoss?.changePercent || 0) > 0,
    },
    {
      icon: <TrendingUp size={22} />,
      iconBg: '#065f46',
      label: 'Throughput',
      sublabel: 'Peak today',
      value: kpisData?.throughput?.value || '0',
      unit: kpisData?.throughput?.unit || 'Gbps',
      trend: `${kpisData?.throughput?.changePercent > 0 ? '+' : ''}${kpisData?.throughput?.changePercent || 0}%`,
      trendBad: false,
    },
    {
      icon: <Users size={22} />,
      iconBg: '#4c1d95',
      label: 'Active Users',
      sublabel: 'Current',
      value: (kpisData?.activeUsers?.value / 1000).toFixed(1) || '0',
      unit: 'K',
      trend: `${kpisData?.activeUsers?.changePercent > 0 ? '+' : ''}${kpisData?.activeUsers?.changePercent || 0}%`,
      trendBad: false,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] min-h-screen overflow-y-auto">
      <div className="px-8 py-6 border-b border-[#30363d]">
        <h2 className="text-2xl font-bold mb-1">Performance Analytics</h2>
        <p className="text-[#8b949e] text-sm">Network-wide metrics and regional comparisons</p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#8b949e' }}>Loading analytics data...</div>
      ) : (
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
              <LineChart data={latencyChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2128" vertical={false} />
                <XAxis dataKey="time" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
                  formatter={(val) => <span style={{ color: '#8b949e' }}>{val}</span>}
                />
                {latencyChart.length > 0 && Object.keys(latencyChart[0])
                  .filter(key => key !== 'time')
                  .map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      name={key} 
                      stroke={index === 0 ? "#f59e0b" : index === 1 ? "#10b981" : index === 2 ? "#3b82f6" : "#8b5cf6"} 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Throughput Area Chart */}
          <div className="card">
            <h3 className="font-bold text-lg mb-6">Network Throughput (24h)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={throughputChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                {throughputChart.length > 0 && Object.keys(throughputChart[0])
                  .filter(key => key !== 'time')
                  .map((key, index) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#throughputGrad)"
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
