import { keycloak } from '../config/keycloak';

export const apiRequest = async (path, options = {}) => {
  if (!keycloak?.authenticated) throw new Error('Pro tuto operaci se přihlaste.');
  await keycloak.updateToken(30);
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${keycloak.token}`);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const response = await fetch(`/api${path}`, { ...options, headers });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || 'Serverový požadavek se nezdařil.');
  return body;
};

