import Keycloak from 'keycloak-js';

const config = {
  url: import.meta.env.VITE_KEYCLOAK_URL?.trim(),
  realm: import.meta.env.VITE_KEYCLOAK_REALM?.trim(),
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID?.trim(),
};

export const isKeycloakConfigured = Boolean(config.url && config.realm && config.clientId);
export const keycloak = isKeycloakConfigured ? new Keycloak(config) : null;
let initialization;
export const initializeKeycloak = () => {
  if (!keycloak) return Promise.resolve(false);
  if (!initialization) initialization = keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false });
  return initialization;
};

export const keycloakAccountUrl = config.url && config.realm
  ? `${config.url.replace(/\/$/, '')}/realms/${encodeURIComponent(config.realm)}/account/`
  : null;
