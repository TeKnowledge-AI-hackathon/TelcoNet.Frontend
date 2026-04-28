import React from 'react';
import StatsGrid from './StatsGrid';
import MainChart from './MainChart';
import AlertsList from './AlertsList';
import { Search, Bell, Filter, Calendar, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <header className="h-16 border-b border-[#30363d] flex items-center justify-between px-8 bg-[#0d1117] sticky top-0 z-10">
        <div className="flex items-center gap-4 bg-[#161b22] px-4 py-2 rounded-xl border border-[#30363d] w-96">
          <Search size={18} className="text-[#8b949e]" />
          <input 
            type="text" 
            placeholder="Search nodes, devices, or incidents..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#8b949e]"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-lg cursor-pointer hover:bg-[#1c2128]">
            <Calendar size={16} className="text-[#8b949e]" />
            <span className="text-xs font-semibold">Last 24 Hours</span>
          </div>
          <div className="relative cursor-pointer">
            <Bell size={20} className="text-[#8b949e] hover:text-white transition-colors" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#f85149] rounded-full border-2 border-[#0d1117]"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#2dd4bf] glow-teal flex items-center justify-center text-black font-bold text-xs cursor-pointer">
            JD
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Network Operations Center</h1>
            <p className="text-[#8b949e]">Real-time infrastructure health and traffic monitoring.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => alert('Filtering options...')}
              className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-sm font-semibold hover:bg-[#1c2128] transition-colors cursor-pointer"
            >
              <Filter size={16} />
              Filters
            </button>
            <button 
              onClick={() => alert('Generating PDF report...')}
              className="px-4 py-2 bg-[#3b82f6] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              Generate Report
            </button>
          </div>
        </div>

        <StatsGrid />
        <MainChart />
        <div className="flex gap-6">
          <AlertsList />
          {/* Small side card for device status distribution or similar */}
          <div className="w-80 space-y-6">
            <div className="card">
              <h4 className="text-sm font-bold mb-4">Device Distribution</h4>
              <div className="space-y-3">
                {[
                  { label: 'Routers', count: 124, color: 'bg-[#3b82f6]' },
                  { label: 'Switches', count: 842, color: 'bg-[#2dd4bf]' },
                  { label: 'Firewalls', count: 12, color: 'bg-[#f85149]' },
                  { label: 'Access Points', count: 3151, color: 'bg-[#10b981]' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#8b949e]">{item.label}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#30363d] rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 4129) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card border-[#10b981]/30 bg-[#10b981]/5">
              <div className="flex items-center gap-2 text-[#10b981] mb-2">
                <ShieldCheck size={18} />
                <span className="text-sm font-bold">System Secure</span>
              </div>
              <p className="text-xs text-[#8b949e]">All security protocols are active and no breaches detected in the last 72 hours.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
