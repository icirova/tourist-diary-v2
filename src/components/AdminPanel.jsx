import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../data/apiClient';

const AdminPanel = ({ onClose }) => {
  const [usage, setUsage] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => { apiRequest('/admin/usage').then(setUsage).catch((error) => setMessage(error.message)); }, []);
  const totalBytes = useMemo(() => usage.reduce((sum, row) => sum + Number(row.photoBytes || 0), 0), [usage]);
  const percent = totalBytes / (1024 ** 3) * 100;
  return <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="admin-title">
    <button className="auth-modal__backdrop" type="button" aria-label="Zavřít" onClick={onClose} />
    <section className="auth-modal__panel admin-panel">
      <button className="auth-modal__close" type="button" aria-label="Zavřít" onClick={onClose}>×</button>
      <h2 id="admin-title">Správa deníku</h2>
      <p>{usage.length} účtů · {usage.reduce((sum, row) => sum + Number(row.tripCount), 0)} výletů</p>
      <p className={percent >= 70 ? 'error-message' : ''}>Fotografie: {(totalBytes / 1024 / 1024).toFixed(1)} MB ({percent.toFixed(1)} % z interního limitu 1 GB)</p>
      <p>Nové účty a role spravujte v administrační konzoli Keycloak.</p>
      {message && <p role="alert">{message}</p>}
      <div className="admin-panel__table">{usage.map((row) => <p key={row.userId}><strong>{row.email}</strong> · {row.tripCount} výletů · {(row.photoBytes / 1024 / 1024).toFixed(1)} MB · {row.status}</p>)}</div>
    </section>
  </div>;
};
AdminPanel.propTypes = { onClose: PropTypes.func.isRequired };
export default AdminPanel;
