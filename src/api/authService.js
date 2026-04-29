import apiClient from './apiClient';

export const authService = {
  login: async (credentials) => {
    const data = await apiClient('/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (userData) => {
    return apiClient('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    try {
      await apiClient('/Auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Backend logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};
