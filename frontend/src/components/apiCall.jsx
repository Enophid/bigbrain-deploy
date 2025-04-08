import { BACKEND_PORT } from '../../backend.config.json';

export default async function apiCall(path, body, method) {
  const response = await fetch(`http://localhost:${BACKEND_PORT}` + path, {
    method: method,
    body: method === 'GET' ? undefined : JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      // Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  const json = await response.json();
  const data = await json;
  return data;
}
