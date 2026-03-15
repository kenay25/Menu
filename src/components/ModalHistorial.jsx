import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { getMiHistorial, getHistorialPorTelefono } from '../api/historial';
import { parseMySQLDate, formatMXN, pedidoFecha, pedidoHora } from '../utils/helpers';

function ModalHistorial({ isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { sesion } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setSearchMode(false);
      setTelefono('');
      setError('');
      setData(null);

      const user = sesion?.usuario;
      if (user?.telefono) {
        cargarHistorialConToken();
      } else {
        setSearchMode(true);
        setLoading(false);
      }
    }
  }, [isOpen, sesion]);

  const cargarHistorialConToken = async () => {
    try {
      const result = await getMiHistorial(sesion.token);

      // Fix timezone
      (result.pedidos || []).forEach(p => {
        if (p.fecha && !p.fecha.endsWith('Z') && !p.fecha.includes('+')) {
          p.fecha = p.fecha.replace(' ', 'T') + '-07:00';
        }
      });

      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'No se encontraron pedidos');
      setSearchMode(true);
      setLoading(false);
    }
  };

  const buscarPorTelefono = async () => {
    if (!telefono || telefono.length < 10) {
      setError('Ingresa un teléfono válido (10 dígitos)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await getHistorialPorTelefono(telefono);

      // Fix timezone
      (result.pedidos || []).forEach(p => {
        if (p.fecha && !p.fecha.endsWith('Z') && !p.fecha.includes('+')) {
          p.fecha = p.fecha.replace(' ', 'T') + '-07:00';
        }
      });

      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'No encontramos pedidos con ese teléfono');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const ESTADO_LABEL = {
    pendiente: '🟡 Pendiente',
    preparando: '🔵 Preparando',
    listo: '🟢 Listo',
    entregado: '✅ Entregado',
    cancelado: '❌ Cancelado',
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh' }}>
        <div className="modal-head">
          <h3>📋 Mi Historial de Pedidos</h3>
          <p>Consulta tus pedidos anteriores</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading && (
            <div className="loading" style={{ padding: '40px' }}>
              {searchMode ? 'Buscando...' : 'Cargando...'}
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)' }}>
              <p style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</p>
              <p>{error}</p>
              {searchMode && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="cf">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="662 000 0000"
                      maxLength={10}
                    />
                  </div>
                  <button className="btn-modal-confirm" onClick={buscarPorTelefono}>
                    Buscar Pedidos
                  </button>
                </div>
              )}
            </div>
          )}

          {data && !loading && (
            <div>
              {/* Info cliente */}
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '16px', background: '#FFF0F4', borderRadius: '12px' }}>
                <h4 style={{ fontFamily: 'Noto Serif JP', color: 'var(--pink-deep)', marginBottom: '8px' }}>
                  {data.cliente.nombre}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
                  📱 {data.cliente.telefono}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--pink)' }}>
                      {formatMXN(data.cliente.total_gastado)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Total gastado</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--pink)' }}>
                      {data.cliente.total_pedidos}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Pedidos</div>
                  </div>
                </div>
              </div>

              {/* Lista de pedidos */}
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
                {data.pedidos.length} pedidos recientes
              </div>

              {data.pedidos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '32px', marginBottom: '10px' }}>🛒</p>
                  <p>Aún no tienes pedidos registrados</p>
                </div>
              ) : (
                data.pedidos.map((p, idx) => {
                  const fecha = parseMySQLDate(p.fecha);
                  const fechaStr = pedidoFecha(p.fecha);
                  const horaStr = pedidoHora(p.fecha);

                  return (
                    <div
                      key={p.id_pedido || idx}
                      style={{
                        background: 'var(--white)',
                        borderRadius: '14px',
                        padding: '14px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(232,84,122,0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '13px' }}>
                            {fechaStr} · {horaStr}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            {p.tipo_entrega === 'domicilio' ? '🛵 Domicilio' : '🏪 Sucursal'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px' }}>
                            {ESTADO_LABEL[p.estado] || p.estado}
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--pink)' }}>
                            {formatMXN(p.total)}
                          </div>
                        </div>
                      </div>

                      {/* Productos */}
                      {p.productos.map((prod, pidx) => {
                        let modsText = '';
                        if (prod.modificaciones) {
                          try {
                            const m = typeof prod.modificaciones === 'string'
                              ? JSON.parse(prod.modificaciones)
                              : prod.modificaciones;
                            const lines = [];
                            if (m.alga) lines.push(m.alga === 'con' ? '🌿 Con alga' : '🌿 Sin alga');
                            if (m.salsas?.length) lines.push('🫙 ' + m.salsas.join(', '));
                            if (m.sin_ingredientes?.length) lines.push('🚫 Sin: ' + m.sin_ingredientes.join(', '));
                            if (m.extras_producto?.length) lines.push('➕ ' + m.extras_producto.join(', '));
                            modsText = lines.length
                              ? <div style={{ fontSize: '11px', color: '#2E7D32', marginTop: '3px' }}>{lines.join(' · ')}</div>
                              : '';
                          } catch (e) { }
                        }

                        return (
                          <div
                            key={pidx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '6px 0',
                              borderBottom: '1px solid var(--pink-light)',
                              fontSize: '13px'
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: '600' }}>{prod.nombre}</span>
                              {' '}
                              <span style={{ color: 'var(--muted)', fontSize: '12px' }}>x{prod.cantidad}</span>
                              {modsText}
                            </div>
                            <div style={{ fontWeight: '600', color: 'var(--pink)' }}>
                              {formatMXN(prod.subtotal)}
                            </div>
                          </div>
                        );
                      })}

                      {p.notas && (
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                          📝 {p.notas}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalHistorial;
