import React, { useState, useEffect } from 'react';
import { Wifi, Users, Clock, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../api/dashboardService';

const StatCard = ({ icon, label, value, trend, color, loading }) => (
  <div className="card flex-1 min-w-[200px] cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        {React.cloneElement(icon, { className: color.replace('bg-', 'text-') })}
      </div>
      {!loading && trend && (
        <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-[#10b981]' : 'text-[#f85149]'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-[#8b949e] text-sm font-medium mb-1">{label}</div>
    <div className="text-2xl font-bold">
      {loading ? (
        <div className="h-8 w-24 bg-[#30363d] animate-pulse rounded"></div>
      ) : value}
    </div>
  </div>
);

const StatsGrid = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await dashboardService.getKpis();
        setKpis(data);
      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, []);

  const stats = [
    {
      icon: <Wifi size={20} />,
      label: 'Avg. Bandwidth',
      value: kpis ? `${kpis.avgBandwidth} Gbps` : '0 Gbps',
      trend: kpis?.bandwidthTrend,
      color: 'bg-[#3b82f6]',
    },
    {
      icon: <Users size={20} />,
      label: 'Active Nodes',
      value: kpis ? kpis.activeNodes.toLocaleString() : '0',
      trend: kpis?.nodesTrend,
      color: 'bg-[#2dd4bf]',
    },
    {
      icon: <Clock size={20} />,
      label: 'System Uptime',
      value: kpis ? `${kpis.uptime}%` : '0%',
      trend: kpis?.uptimeTrend,
      color: 'bg-[#10b981]',
    },
    {
      icon: <AlertTriangle size={20} />,
      label: 'Critical Alerts',
      value: kpis ? kpis.criticalAlerts.toString() : '0',
      trend: kpis?.alertsTrend,
      color: 'bg-[#f85149]',
    },
  ];

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} loading={loading} />
      ))}
    </div>
  );
};

export default StatsGrid;
