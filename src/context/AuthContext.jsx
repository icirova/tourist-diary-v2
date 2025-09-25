/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  isKeycloakConfigured,
  keycloakAdapterUrl,
  keycloakConfig,
  keycloakInitOptions,
  keycloakLoginRedirectUri,
  keycloakLogoutRedirectUri,
} from '../config/keycloak';

const AuthContext = createContext(null);

const createDefaultState = (status = isKeycloakConfigured ? 'loading' : 'guest') => ({
  status,
  user: null,
  error: null,
});

const createDemoUser = () => ({
  id: 'demo-user',
  username: 'demo',
  name: 'Demo uživatel',
});

let adapterPromise;

const loadKeycloakAdapter = () => {
  if (adapterPromise) return adapterPromise;

  adapterPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }
    if (window.Keycloak) {
      resolve(window.Keycloak);
      return;
    }
    if (!keycloakAdapterUrl) {
      reject(new Error('Keycloak adapter URL is not configured.'));
      return;
    }

    const script = document.createElement('script');
    script.src = keycloakAdapterUrl;
    script.async = true;
    script.onload = () => {
      if (window.Keycloak) {
        resolve(window.Keycloak);
      } else {
        reject(new Error('Keycloak adapter failed to load.'));
      }
    };
    script.onerror = () => {
      reject(new Error(`Unable to load Keycloak adapter from ${keycloakAdapterUrl}`));
    };
    document.head.appendChild(script);
  });

  return adapterPromise;
};

const buildUserFromToken = (keycloakInstance) => {
  const token = keycloakInstance?.tokenParsed;
  if (!token) return null;
  const { sub, preferred_username: username, email, given_name: givenName, family_name: familyName } = token;
  const fallbackName = username || email || 'Uživatel';
  const name = [givenName, familyName].filter(Boolean).join(' ') || fallbackName;
  return {
    id: sub || username || email || 'unknown-user',
    username: username || email || 'user',
    email: email || null,
    name,
  };
};

export const AuthProvider = ({ children }) => {
  const keycloakRef = useRef(null);
  const [authState, setAuthState] = useState(() => createDefaultState());
  const [authStrategy] = useState(() => (isKeycloakConfigured ? 'keycloak' : 'demo'));

  useEffect(() => {
    if (authStrategy !== 'keycloak') {
      setAuthState(createDefaultState('guest'));
      return undefined;
    }

    let isMounted = true;

    const initKeycloak = async () => {
      try {
        const KeycloakConstructor = await loadKeycloakAdapter();
        if (!isMounted) return;

        const keycloak = KeycloakConstructor({
          url: keycloakConfig.url,
          realm: keycloakConfig.realm,
          clientId: keycloakConfig.clientId,
        });

        keycloakRef.current = keycloak;

        const authenticated = await keycloak.init(keycloakInitOptions);

        if (!isMounted) return;

        if (authenticated) {
          setAuthState({ status: 'authenticated', user: buildUserFromToken(keycloak), error: null });
        } else {
          setAuthState(createDefaultState('guest'));
        }

        keycloak.onAuthSuccess = () => {
          if (!isMounted) return;
          setAuthState({ status: 'authenticated', user: buildUserFromToken(keycloak), error: null });
        };

        keycloak.onAuthLogout = () => {
          if (!isMounted) return;
          setAuthState(createDefaultState('guest'));
        };

        keycloak.onAuthError = (error) => {
          if (!isMounted) return;
          setAuthState({ status: 'error', user: null, error });
        };

        keycloak.onTokenExpired = () => {
          keycloak
            .updateToken(30)
            .then(() => {
              if (!isMounted) return;
              setAuthState({ status: 'authenticated', user: buildUserFromToken(keycloak), error: null });
            })
            .catch(() => {
              keycloak.clearToken();
              if (!isMounted) return;
              setAuthState(createDefaultState('guest'));
            });
        };
      } catch (error) {
        if (!isMounted) return;
        setAuthState({ status: 'error', user: null, error });
      }
    };

    initKeycloak();

    return () => {
      isMounted = false;
    };
  }, [authStrategy]);

  const login = useCallback(() => {
    if (authState.status === 'loading') return;

    if (authStrategy === 'keycloak') {
      keycloakRef.current?.login({ redirectUri: keycloakLoginRedirectUri });
    } else {
      setAuthState({ status: 'authenticated', user: createDemoUser(), error: null });
    }
  }, [authState.status, authStrategy]);

  const logout = useCallback(() => {
    if (authStrategy === 'keycloak') {
      keycloakRef.current?.logout({ redirectUri: keycloakLogoutRedirectUri });
    } else {
      setAuthState(createDefaultState('guest'));
    }
  }, [authStrategy]);

  const register = useCallback(() => {
    if (authState.status === 'loading') return;

    if (authStrategy === 'keycloak') {
      if (keycloakRef.current?.register) {
        keycloakRef.current.register({ redirectUri: keycloakLoginRedirectUri });
      } else {
        keycloakRef.current?.login({ redirectUri: keycloakLoginRedirectUri });
      }
    } else {
      setAuthState({ status: 'authenticated', user: createDemoUser(), error: null });
    }
  }, [authState.status, authStrategy]);

  const value = useMemo(
    () => ({
      user: authState.user,
      isAuthenticated: authState.status === 'authenticated',
      isLoading: authState.status === 'loading',
      hasError: authState.status === 'error',
      error: authState.error,
      isKeycloakConfigured: authStrategy === 'keycloak',
      login,
      logout,
      register,
    }),
    [authState, authStrategy, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export default AuthContext;
