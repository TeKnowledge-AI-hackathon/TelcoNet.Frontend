import apiClient from './apiClient';

export const dashboardService = {
  getKpis: () => apiClient('/Dashboard/kpis'),
  getLatencyChart: () => apiClient('/Dashboard/charts/latency'),
  getThroughputChart: () => apiClient('/Dashboard/charts/throughput'),
};
