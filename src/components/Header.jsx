import "./Header.scss";
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, login, logout, register } = useAuth();

  return (
    <header className="header">
      <h1 className="logo">Turistický deník</h1>
      <div className="header__actions">
        {!isAuthenticated ? (
          <>
            <button type="button" className="btn btn--secondary" onClick={register}>
              Registrace
            </button>
            <button type="button" className="btn btn--primary" onClick={login}>
              Přihlásit
            </button>
          </>
        ) : (
          <button type="button" className="btn btn--secondary" onClick={logout}>
            Odhlásit
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
