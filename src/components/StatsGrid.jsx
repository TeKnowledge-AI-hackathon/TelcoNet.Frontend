import React, { useState, useEffect } from 'react';
import { Wifi, Users, Clock, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../api/dashboardService';
import { networkService } from '../api/networkService';

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
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, healthData] = await Promise.all([
          dashboardService.getKpis(),
          networkService.getHealth()
        ]);
        setStatsData({ kpis: kpiData, health: healthData });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      icon: <Wifi size={20} />,
      label: 'Avg. Bandwidth',
      value: statsData?.kpis?.throughput ? `${statsData.kpis.throughput.value} Gbps` : '0 Gbps',
      trend: statsData?.kpis?.throughput ? (statsData.kpis.throughput.changePercent > 0 ? `+${statsData.kpis.throughput.changePercent}%` : `${statsData.kpis.throughput.changePercent}%`) : '0%',
      color: 'bg-[#3b82f6]',
    },
    {
      icon: <Users size={20} />,
      label: 'Active Nodes',
      value: statsData?.health ? statsData.health.healthyNodes.toLocaleString() : '0',
      trend: `${statsData?.health?.totalNodes || 0} Total`,
      color: 'bg-[#2dd4bf]',
    },
    {
      icon: <Clock size={20} />,
      label: 'Active Outages',
      value: statsData?.health ? statsData.health.activeOutages.toString() : '0',
      trend: statsData?.health?.overallStatus || 'Unknown',
      color: 'bg-[#10b981]',
    },
    {
      icon: <AlertTriangle size={20} />,
      label: 'Packet Loss',
      value: statsData?.kpis?.packetLoss ? `${statsData.kpis.packetLoss.value}%` : '0%',
      trend: statsData?.kpis?.packetLoss ? (statsData.kpis.packetLoss.changePercent > 0 ? `+${statsData.kpis.packetLoss.changePercent}%` : `${statsData.kpis.packetLoss.changePercent}%`) : '0%',
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
