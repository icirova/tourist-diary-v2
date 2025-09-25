/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const createAnonymousState = () => ({ user: null });

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => createAnonymousState());

  const login = useCallback(() => {
    // Placeholder implementation – replace with Keycloak login flow.
    setState({ user: { id: 'demo-user', name: 'Demo User' } });
  }, []);

  const logout = useCallback(() => {
    setState(createAnonymousState());
  }, []);

  const register = useCallback(() => {
    // Placeholder implementation – reuse login for now.
    setState({ user: { id: 'demo-user', name: 'Demo User' } });
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: Boolean(state.user),
      login,
      logout,
      register,
    }),
    [state.user, login, logout, register],
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
