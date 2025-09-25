import "./Header.scss";
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isKeycloakConfigured,
    login,
    logout,
    register,
  } = useAuth();

  const loginLabel = isKeycloakConfigured ? 'Přihlásit' : 'Vyzkoušet přihlášení';
  const registerLabel = isKeycloakConfigured ? 'Registrace' : 'Simulovat registraci';

  return (
    <header className="header">
      <h1 className="logo">Turistický deník</h1>
      <div className="header__actions">
        {!isAuthenticated ? (
          <>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={register}
              disabled={isLoading}
            >
              {registerLabel}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={login}
              disabled={isLoading}
            >
              {loginLabel}
            </button>
          </>
        ) : (
          <>
            <span className="header__user" title={user?.email || user?.username || ''}>
              {user?.name || user?.username}
            </span>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={logout}
              disabled={isLoading}
            >
              Odhlásit
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
