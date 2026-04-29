import apiClient from './apiClient';

const transformChartData = (data) => {
  if (!data || !data.labels || !data.series) return [];
  
  return data.labels.map((label, index) => {
    const point = { time: label };
    data.series.forEach(s => {
      // Use the series name as the key, but sanitize it for JS object keys if needed
      // (though Recharts handles spaces fine)
      point[s.name] = s.data[index];
    });
    return point;
  });
};

export const dashboardService = {
  getKpis: () => apiClient('/Dashboard/kpis'),
  getLatencyChart: async () => {
    const data = await apiClient('/Dashboard/charts/latency');
    return transformChartData(data);
  },
  getThroughputChart: async () => {
    const data = await apiClient('/Dashboard/charts/throughput');
    return transformChartData(data);
  },
};
