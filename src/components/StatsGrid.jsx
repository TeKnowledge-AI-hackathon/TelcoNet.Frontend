import React from 'react';
import { Wifi, Users, Clock, AlertTriangle } from 'lucide-react';

const StatCard = ({ icon, label, value, trend, color }) => (
  <div 
    onClick={() => alert(`Showing details for ${label}`)}
    className="card flex-1 min-w-[200px] cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        {React.cloneElement(icon, { className: color.replace('bg-', 'text-') })}
      </div>
      <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-[#10b981]' : 'text-[#f85149]'}`}>
        {trend}
      </span>
    </div>
    <div className="text-[#8b949e] text-sm font-medium mb-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const StatsGrid = () => {
  const stats = [
    {
      icon: <Wifi size={20} />,
      label: 'Avg. Bandwidth',
      value: '1.2 Gbps',
      trend: '+12.5%',
      color: 'bg-[#3b82f6]',
    },
    {
      icon: <Users size={20} />,
      label: 'Active Nodes',
      value: '4,129',
      trend: '+2.1%',
      color: 'bg-[#2dd4bf]',
    },
    {
      icon: <Clock size={20} />,
      label: 'Uptime',
      value: '99.98%',
      trend: '+0.01%',
      color: 'bg-[#10b981]',
    },
    {
      icon: <AlertTriangle size={20} />,
      label: 'Critical Alerts',
      value: '12',
      trend: '-15.4%',
      color: 'bg-[#f85149]',
    },
  ];

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
