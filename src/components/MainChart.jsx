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

import { dashboardService } from '../api/dashboardService';
import { useState, useEffect } from 'react';

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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await dashboardService.getThroughputChart();
        setChartData(data);
      } catch (err) {
        console.error('Failed to fetch throughput chart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

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
      
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-[#161b22]/50 rounded-lg animate-pulse text-[#8b949e] font-medium">
          Loading live traffic data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
              tickFormatter={(value) => `${value}G`}
            />
            <Tooltip content={<CustomTooltip />} />
            {chartData.length > 0 && Object.keys(chartData[0])
              .filter(key => key !== 'time')
              .map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={index === 0 ? "#3b82f6" : index === 1 ? "#2dd4bf" : "#8b5cf6"} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill={index === 0 ? "url(#colorPrimary)" : "none"} 
                  name={key}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MainChart;
