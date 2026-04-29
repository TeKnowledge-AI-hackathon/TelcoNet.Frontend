import apiClient from './apiClient';

export const userService = {
  getUsers: () => apiClient('/Users'),
  createUser: (userData) => apiClient('/Users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  deleteUser: (id) => apiClient(`/Users/${id}`, {
    method: 'DELETE',
  }),
};
