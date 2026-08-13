import { useState } from 'react';
import "./Header.scss";
import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';

const Header = () => {
  const { user, isAuthenticated, isAdmin, isLoading, isKeycloakConfigured, login, logout, resetPassword } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  return <header className="header">
    <div className="header__brand">
      <h1 className="logo">Cestovní deník</h1>
      <p className="header__subtitle">Místa, poznámky a vzpomínky z cest.</p>
    </div>
    <div className="header__actions">
      {!isAuthenticated ? <>
        <button type="button" className="btn btn--secondary" disabled title="Účty vytváří administrátorka v Keycloaku">Registrace pouze na pozvánku</button>
        <button type="button" className="btn btn--primary" onClick={login} disabled={isLoading || !isKeycloakConfigured}>Přihlásit</button>
      </> : <>
        <span className="header__user" title={user?.email}>{user?.name || user?.email}</span>
        <button type="button" className="btn btn--secondary" onClick={resetPassword}>Můj účet</button>
        {isAdmin && <button type="button" className="btn btn--primary" onClick={() => setShowAdmin(true)}>Správa</button>}
        <button type="button" className="btn btn--secondary" onClick={logout} disabled={isLoading}>Odhlásit</button>
      </>}
    </div>
    {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
  </header>;
};
export default Header;
