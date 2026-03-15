import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { loginCliente, registroCliente } from '../api/auth';

function ModalLogin({ isOpen, onClose }) {
  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (tab === 'login') {
        const data = await loginCliente(formData.email, formData.password);
        login(data.access_token, data.usuario);
        onClose();
      } else {
        await registroCliente(formData.nombre, formData.email, formData.password, formData.telefono);
        setSuccess('✅ Cuenta creada. Iniciando sesión...');
        setTimeout(() => {
          setTab('login');
          setFormData(prev => ({ ...prev, email: formData.email, password: formData.password }));
          handleSubmit();
        }, 1000);
        return;
      }
    } catch (err) {
      setError(err.response?.data?.detail || (tab === 'login' ? 'Email o contraseña incorrectos' : 'Error al registrarse'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal-head">
          <h3>{tab === 'login' ? '🔑 Iniciar Sesión' : '📝 Registrarse'}</h3>
          <p>La Esquina del Sushi</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`login-tab ${tab === 'registro' ? 'active' : ''}`}
              onClick={() => { setTab('registro'); setError(''); setSuccess(''); }}
            >
              Registrarse
            </button>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div style={{ color: '#ff6b8a', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ color: '#90ee90', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>
              {success}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="cf">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>
              <div className="cf">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>
          )}

          {/* Registro Form */}
          {tab === 'registro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="cf">
                <label>Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="cf">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>
              <div className="cf">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="662 000 0000"
                />
              </div>
              <div className="cf">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn-modal-confirm"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Procesando...' : (tab === 'login' ? 'Entrar →' : 'Registrarse →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;
