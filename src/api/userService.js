import apiClient from './apiClient';

export const userService = {
  getUsers: async () => {
    const users = await apiClient('/Users');
    return users.map(u => ({
      ...u,
      name: u.fullName, // Map fullName to name
      role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()) : 'Viewer',
      status: u.status || 'Active', // Default status if missing
      lastActive: u.lastActive || 'Never' // Default if missing
    }));
  },
  createUser: (userData) => apiClient('/Users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  updateUser: (id, userData) => apiClient(`/Users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role: userData.role }),
  }),
  deleteUser: (id) => apiClient(`/Users/${id}`, {
    method: 'DELETE',
  }),
};
