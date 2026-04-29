import apiClient from './apiClient';

export const settingsService = {
  getSettings: () => apiClient('/Settings'),
  updateSettings: (settings) => apiClient('/Settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
};
