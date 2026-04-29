import apiClient from './apiClient';

export const networkService = {
  getHealth: () => apiClient('/Network/health'),
  getNodes: (region, timeRange) => {
    let url = '/Network/nodes?';
    if (region) url += `region=${region}&`;
    if (timeRange) url += `timeRange=${timeRange}&`;
    return apiClient(url);
  },
  getOutages: () => apiClient('/Network/outages'),
  getTimeline: () => apiClient('/Network/timeline'),
  getAlerts: () => apiClient('/Network/alerts'),
  acknowledgeAlert: (id) => apiClient(`/Network/alerts/${id}/acknowledge`, {
    method: 'PUT',
  }),
};
