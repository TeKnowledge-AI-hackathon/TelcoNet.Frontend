import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

const alerts = [
  {
    id: 'AL-9283',
    device: 'Core Router #1',
    issue: 'High CPU Utilization',
    severity: 'Critical',
    time: '2 mins ago',
    status: 'active'
  },
  {
    id: 'AL-9284',
    device: 'Switch 04 (L3)',
    issue: 'Port flapping detected',
    severity: 'Warning',
    time: '15 mins ago',
    status: 'active'
  },
  {
    id: 'AL-9285',
    device: 'Edge Gateway B',
    issue: 'BGP session reset',
    severity: 'Critical',
    time: '1 hour ago',
    status: 'resolved'
  },
  {
    id: 'AL-9286',
    device: 'Firewall Primary',
    issue: 'New signature update',
    severity: 'Info',
    time: '3 hours ago',
    status: 'resolved'
  },
];

const SeverityBadge = ({ severity }) => {
  const styles = {
    Critical: 'bg-[#f85149] text-[#f85149]',
    Warning: 'bg-[#f59e0b] text-[#f59e0b]',
    Info: 'bg-[#3b82f6] text-[#3b82f6]',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-opacity-10 border border-current ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const AlertsList = () => {
  return (
    <div className="card flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Recent Incident Alerts</h3>
        <button className="text-xs font-semibold text-[#3b82f6] hover:underline">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#30363d] text-[#8b949e] text-xs uppercase tracking-wider">
              <th className="pb-3 font-semibold">ID</th>
              <th className="pb-3 font-semibold">Device</th>
              <th className="pb-3 font-semibold">Issue</th>
              <th className="pb-3 font-semibold">Severity</th>
              <th className="pb-3 font-semibold">Time</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {alerts.map((alert, index) => (
              <tr key={index} className="border-b border-[#30363d] last:border-0 hover:bg-[#1c2128] transition-colors">
                <td className="py-4 font-mono text-xs text-[#8b949e]">{alert.id}</td>
                <td className="py-4 font-semibold">{alert.device}</td>
                <td className="py-4 text-[#8b949e]">{alert.issue}</td>
                <td className="py-4">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="py-4 text-xs text-[#8b949e]">{alert.time}</td>
                <td className="py-4">
                  <div className={`w-2 h-2 rounded-full ${alert.status === 'active' ? 'bg-[#f85149] animate-pulse' : 'bg-[#10b981]'}`}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsList;
