import backendConfig from '../backend.config.json';

// Use a hardcoded URL for production to avoid config file issues
const API_URL = import.meta.env.PROD 
  ? backendConfig.BACKEND_URL
  : `http://localhost:${backendConfig.BACKEND_PORT}`;

const ApiCall = async (path, body, method) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if the path is authentication-related
  const isAuthPath = path.includes('/admin/auth/login') || path.includes('/admin/auth/register');
  
  // Redirect to login if no token and path requires authentication
  if (!token && !isAuthPath && path.includes('/admin')) {
    // If we're not already on the login page, redirect
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login';
      return { error: 'Authentication required. Please log in.' };
    }
  }

  try {
    // Create headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      method: method,
      body: method === 'GET' ? undefined : JSON.stringify(body),
      headers: headers
    });

    // Parse the response
    let json;
    try {
      json = await response.json();
    } catch (_) {
      // Using underscore to indicate intentionally unused parameter
      return { error: 'Failed to parse server response' };
    }

    // Handle authentication issues
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // If the token is invalid or expired
        if (json.error && (json.error.includes('Invalid token') || json.error.includes('Token'))) {
          // Clear the invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
          
          return { error: 'Authentication failed. Please log in again.' };
        }
        
        // For other 403/401 errors that don't mention token
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          window.location.href = '/login';
          return { error: 'Your session has expired. Please log in again.' };
        }
      }
    }

    return json;
  } catch (error) {
    // Remove console.error
    return { error: error.message || 'Network error occurred' };
  }
};

// For backward compatibility
export default ApiCall;
