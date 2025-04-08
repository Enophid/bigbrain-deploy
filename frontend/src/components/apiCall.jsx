import { BACKEND_PORT } from '../../backend.config.json';

// Using named export instead of default for better imports
export const ApiCall = async (path, body, method) => {
  const response = await fetch(`http://localhost:${BACKEND_PORT}` + path, {
    method: method,
    body: method === 'GET' ? undefined : JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      // Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  const json = await response.json();
  return json;
};

// For backward compatibility
export default ApiCall;
