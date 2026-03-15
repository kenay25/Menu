import React, { useState, useEffect } from 'react';
import ModalLogin from './ModalLogin';
import ModalHistorial from './ModalHistorial';
import useAuthStore from '../store/authStore';

function Header() {
  const [petals, setPetals] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [historialModalOpen, setHistorialModalOpen] = useState(false);
  const { sesion, logout, getUser } = useAuthStore();
  const user = getUser();

  useEffect(() => {
    // Generar pétalos de sakura
    const newPetals = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      animationDuration: (3 + Math.random() * 4) + 's',
      animationDelay: (Math.random() * 5) + 's',
      fontSize: (12 + Math.random() * 10) + 'px'
    }));
    setPetals(newPetals);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-sakura" id="sakura">
          {petals.map(petal => (
            <div
              key={petal.id}
              className="petal"
              style={{
                left: petal.left,
                animationDuration: petal.animationDuration,
                animationDelay: petal.animationDelay,
                fontSize: petal.fontSize
              }}
            >
              🌸
            </div>
          ))}
        </div>

        <div className="header-inner">
          <div className="logo-area">
            <div className="logo-kanji">鮎</div>
            <div className="logo-text">
              <h1>La Esquina del <span>Sushi</span></h1>
              <small>Auténtico sabor japonés</small>
            </div>
          </div>

          <div className="header-info">
            <p>📍 Blvd. Sonora #21, Hermosillo</p>
            <p>📞 <strong>(662) 200-5667</strong></p>
            <p className="hours">⏰ Mar-Dom: 1:00 PM - 10:00 PM</p>
          </div>

          <div className="header-auth" id="header-auth">
            {user ? (
              <div className="header-user">
                <span className="header-user-name">👋 {user.nombre}</span>
                {user.rol === 'admin' && (
                  <button className="btn-admin-panel" onClick={() => window.location.href = '/admin'}>
                    ⚙️ Panel Admin
                  </button>
                )}
                <button className="btn-historial-header" onClick={() => setHistorialModalOpen(true)}>
                  📋 Mi historial
                </button>
                <button className="btn-logout" onClick={logout}>
                  Salir
                </button>
              </div>
            ) : (
              <button className="btn-login-header" onClick={() => setLoginModalOpen(true)}>
                🔑 Iniciar sesión
              </button>
            )}
          </div>
        </div>

        <div className="header-banner">
          <p>🍣 ¡Los mejores sushis de la ciudad! 🍣</p>
        </div>
      </header>

      <ModalLogin
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      <ModalHistorial
        isOpen={historialModalOpen}
        onClose={() => setHistorialModalOpen(false)}
      />
    </>
  );
}

export default Header;
