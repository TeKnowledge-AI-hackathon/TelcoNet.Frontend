import apiClient from './apiClient';

export const copilotService = {
  chat: (message, sessionId) => apiClient('/Copilot/chat', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  }),
  getSessions: () => apiClient('/Copilot/sessions'),
  getSession: (sessionId) => apiClient(`/Copilot/sessions/${sessionId}`),
  saveSession: (sessionId) => apiClient(`/Copilot/sessions/${sessionId}/save`, {
    method: 'PUT',
  }),
};
