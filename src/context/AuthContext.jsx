/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initializeKeycloak, isKeycloakConfigured, keycloak, keycloakAccountUrl } from '../config/keycloak';
import { apiRequest } from '../data/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(isKeycloakConfigured);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    if (!keycloak?.authenticated) { setUser(null); return; }
    const profile = await apiRequest('/me');
    if (profile.status !== 'active') { await keycloak.logout(); return; }
    setUser(profile);
  }, []);

  useEffect(() => {
    if (!keycloak) { setIsLoading(false); return undefined; }
    let mounted = true;
    initializeKeycloak()
      .then(() => loadUser()).catch(setError).finally(() => mounted && setIsLoading(false));
    keycloak.onAuthSuccess = () => loadUser().catch(setError);
    keycloak.onAuthLogout = () => setUser(null);
    keycloak.onTokenExpired = () => keycloak.updateToken(30).catch(() => keycloak.login());
    return () => { mounted = false; };
  }, [loadUser]);

  const login = useCallback(() => keycloak?.login({ redirectUri: window.location.href }), []);
  const logout = useCallback(() => keycloak?.logout({ redirectUri: window.location.origin }), []);
  const resetPassword = useCallback(() => {
    if (keycloakAccountUrl) window.location.assign(keycloakAccountUrl);
  }, []);
  const value = useMemo(() => ({
    user, isAuthenticated: Boolean(user), isAdmin: user?.role === 'admin', isLoading,
    hasError: Boolean(error), error, isKeycloakConfigured, login, logout, resetPassword,
  }), [user, isLoading, error, login, logout, resetPassword]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthProvider.propTypes = { children: PropTypes.node.isRequired };
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
