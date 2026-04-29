import apiClient from './apiClient';

export const networkService = {
  getHealth: () => apiClient('/Network/health'),
  getNodes: () => apiClient('/Network/nodes'),
  getOutages: () => apiClient('/Network/outages'),
  getTimeline: () => apiClient('/Network/timeline'),
  getAlerts: () => apiClient('/Network/alerts'),
  acknowledgeAlert: (id) => apiClient(`/Network/alerts/${id}/acknowledge`, {
    method: 'PUT',
  }),
};
