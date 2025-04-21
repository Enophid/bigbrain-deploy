import { BACKEND_PORT } from '../../backend.config.json';

const ApiCall = async (path, body, method) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://localhost:${BACKEND_PORT}` + path, {
      method: method,
      body: method === 'GET' ? undefined : JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (!response.ok) {
      // If response status is 401 or 403, the token might be invalid
      if (response.status === 401 || response.status === 403) {
        console.warn('Authentication issue detected:', response.status);
        // You might want to redirect to login here or handle token refresh
      }
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('API call error:', error);
    return { error: error.message };
  }
};

// For backward compatibility
export default ApiCall;
