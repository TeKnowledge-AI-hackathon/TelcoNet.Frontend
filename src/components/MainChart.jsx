import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { time: '00:00', download: 400, upload: 240 },
  { time: '04:00', download: 300, upload: 139 },
  { time: '08:00', download: 900, upload: 980 },
  { time: '12:00', download: 1400, upload: 390 },
  { time: '16:00', download: 1100, upload: 480 },
  { time: '20:00', download: 800, upload: 380 },
  { time: '23:59', download: 500, upload: 430 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg shadow-xl">
        <p className="text-sm font-bold mb-2 text-[#8b949e]">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs font-semibold">
            {`${entry.name}: ${entry.value} Mbps`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MainChart = () => {
  return (
    <div className="card h-[400px] mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Network Traffic Overview</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-xs text-[#8b949e]">Download</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2dd4bf]"></div>
            <span className="text-xs text-[#8b949e]">Upload</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#8b949e" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#8b949e" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="download" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDownload)" 
            name="Download"
          />
          <Area 
            type="monotone" 
            dataKey="upload" 
            stroke="#2dd4bf" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorUpload)" 
            name="Upload"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainChart;
