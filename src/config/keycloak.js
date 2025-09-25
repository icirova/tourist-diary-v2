const normalize = (value) => (typeof value === 'string' ? value.trim() : '');

const keycloakConfig = {
  url: normalize(import.meta.env.VITE_KEYCLOAK_URL),
  realm: normalize(import.meta.env.VITE_KEYCLOAK_REALM),
  clientId: normalize(import.meta.env.VITE_KEYCLOAK_CLIENT_ID),
  adapterUrl: normalize(import.meta.env.VITE_KEYCLOAK_ADAPTER_URL),
  silentCheckSsoRedirectUri: normalize(import.meta.env.VITE_KEYCLOAK_SILENT_CHECK_SSO),
  loginRedirectUri: normalize(import.meta.env.VITE_KEYCLOAK_LOGIN_REDIRECT),
  logoutRedirectUri: normalize(import.meta.env.VITE_KEYCLOAK_LOGOUT_REDIRECT),
};

const isKeycloakConfigured = Boolean(
  keycloakConfig.url && keycloakConfig.realm && keycloakConfig.clientId,
);

const getDefaultAdapterUrl = () => {
  if (!keycloakConfig.url) return '';
  const base = keycloakConfig.url.endsWith('/')
    ? keycloakConfig.url.slice(0, -1)
    : keycloakConfig.url;
  return `${base}/js/keycloak.js`;
};

const keycloakAdapterUrl = keycloakConfig.adapterUrl || getDefaultAdapterUrl();

const keycloakInitOptions = (() => {
  const options = {
    onLoad: 'check-sso',
    pkceMethod: 'S256',
  };
  if (keycloakConfig.silentCheckSsoRedirectUri) {
    options.silentCheckSsoRedirectUri = keycloakConfig.silentCheckSsoRedirectUri;
  }
  return options;
})();

const keycloakLoginRedirectUri =
  keycloakConfig.loginRedirectUri || (typeof window !== 'undefined' ? window.location.href : undefined);

const keycloakLogoutRedirectUri =
  keycloakConfig.logoutRedirectUri || (typeof window !== 'undefined' ? window.location.origin : undefined);

export {
  keycloakConfig,
  isKeycloakConfigured,
  keycloakAdapterUrl,
  keycloakInitOptions,
  keycloakLoginRedirectUri,
  keycloakLogoutRedirectUri,
};
