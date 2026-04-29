const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // No Content — successful PUT/DELETE with empty body
  if (response.status === 204) {
    return null;
  }

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to login instead of reloading
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export default apiClient;
