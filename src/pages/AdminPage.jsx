import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAdminStore from '../store/adminStore';
import { loginAdmin } from '../api/auth';
import { getEstadisticasHoy, getEstadisticasSemana, getHorasPico, getMasVendidos, getTopClientes, getPedidosHabilitados, updatePedidosHabilitados } from '../api/admin';
import { getPedidos, updatePedidoEstado } from '../api/pedidos';
import { hoyHermosillo, formatMXN, pedidoHora, pedidoFecha } from '../utils/helpers';
import { ESTADOS_PEDIDO } from '../utils/constants';
import MenuAdminPage from './admin/MenuAdminPage';
import UsuariosPage from './admin/UsuariosPage';
import EstadisticasPage from './admin/EstadisticasPage';

function AdminPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { token, usuario, login, logout, setPedidosHabilitados: setPedidosState, pedidosHabilitados } = useAdminStore();
  const queryClient = useQueryClient();

  // Login
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      const data = await loginAdmin(loginForm.email, loginForm.password);
      if (data.usuario.rol !== 'admin') {
        alert('No tienes permisos de administrador');
        return;
      }
      login(data.access_token, data.usuario);
    } catch (error) {
      document.getElementById('adm-error').textContent = error.response?.data?.detail || 'Credenciales inválidas';
      document.getElementById('adm-error').style.display = 'block';
    }
  };

  const handleTogglePedidos = async () => {
    try {
      const data = await updatePedidosHabilitados(!pedidosHabilitados, token);
      setPedidosState(data.pedidos_habilitados);
      queryClient.invalidateQueries(['pedidosHabilitados']);
    } catch (error) {
      console.error('Error toggling pedidos:', error);
      setPedidosState(!pedidosHabilitados);
    }
  };

  // Fetch initial config
  useEffect(() => {
    if (token) {
      getPedidosHabilitados().then(data => setPedidosState(data.pedidos_habilitados));
    }
  }, [token]);

  if (!token) {
    return (
      <div className="login-full">
        <div className="login-card">
          <div className="kanji">鮎</div>
          <h1>Panel Admin</h1>
          <p>La Esquina del Sushi</p>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="admin@email.com"
            />
          </div>
          <div className="login-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="login-error" id="adm-error" style={{ display: 'none' }}></div>
          <button className="btn-login-full" onClick={handleLogin}>
            Entrar al panel →
          </button>
        </div>
      </div>
    );
  }

  const showPage = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-app">
      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="kanji">鮎</div>
          <h2>La Esquina<br />del Sushi</h2>
          <small>Panel Admin</small>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Principal</div>
          <div className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => showPage('dashboard')}>
            <span className="icon">📊</span><span>Dashboard</span>
          </div>
          <div className={`nav-item ${currentPage === 'pedidos' ? 'active' : ''}`} onClick={() => showPage('pedidos')}>
            <span className="icon">🧾</span><span>Pedidos</span>
          </div>
          <div className="nav-section-label">Menú</div>
          <div className={`nav-item ${currentPage === 'menu' ? 'active' : ''}`} onClick={() => showPage('menu')}>
            <span className="icon">🍣</span><span>Platillos</span>
          </div>
          <div className="nav-section-label">Reportes</div>
          <div className={`nav-item ${currentPage === 'estadisticas' ? 'active' : ''}`} onClick={() => showPage('estadisticas')}>
            <span className="icon">📈</span><span>Estadísticas</span>
          </div>
          <div className={`nav-item ${currentPage === 'clientes' ? 'active' : ''}`} onClick={() => showPage('clientes')}>
            <span className="icon">🏆</span><span>Top Clientes</span>
          </div>
          <div className="nav-section-label">Administración</div>
          <div className={`nav-item ${currentPage === 'usuarios' ? 'active' : ''}`} onClick={() => showPage('usuarios')}>
            <span className="icon">👥</span><span>Usuarios</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-chip">
            <div className="admin-avatar">{usuario?.nombre?.charAt(0).toUpperCase() || 'A'}</div>
            <div>
              <div className="admin-name">{usuario?.nombre || 'Admin'}</div>
              <div className="admin-role">Administrador</div>
            </div>
          </div>
          <button className="btn-logout-sidebar" onClick={logout}>🚪 Cerrar sesión</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button className="btn-menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <div className="topbar-title">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</div>
              <div className="topbar-sub">
                {currentPage === 'dashboard' && 'Resumen del día'}
                {currentPage === 'pedidos' && 'Gestión de pedidos'}
                {currentPage === 'menu' && 'Administración del menú'}
                {currentPage === 'estadisticas' && 'Reportes y gráficas'}
                {currentPage === 'clientes' && 'Clientes frecuentes'}
                {currentPage === 'usuarios' && 'Gestión de usuarios'}
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <div
              className={`pedidos-toggle-wrap ${pedidosHabilitados ? '' : 'off'}`}
              onClick={handleTogglePedidos}
              style={{ cursor: 'pointer' }}
            >
              <div className="pedidos-toggle-dot"></div>
              <span className="pedidos-toggle-label">
                {pedidosHabilitados ? 'Pedidos activos' : 'Pedidos cerrados'}
              </span>
              <div className={`toggle ${pedidosHabilitados ? 'on' : ''}`}></div>
            </div>
            <button className="btn-refresh" onClick={() => queryClient.invalidateQueries()}>↻ Actualizar</button>
            <a href="/" style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none' }}>← Ver menú</a>
          </div>
        </div>

        {/* Dashboard */}
        {currentPage === 'dashboard' && <DashboardPage />}

        {/* Pedidos */}
        {currentPage === 'pedidos' && <PedidosPage token={token} />}

        {/* Menu */}
        {currentPage === 'menu' && <MenuAdminPage />}

        {/* Estadisticas */}
        {currentPage === 'estadisticas' && <EstadisticasPage />}

        {/* Clientes */}
        {currentPage === 'clientes' && <ClientesPage token={token} />}

        {/* Usuarios */}
        {currentPage === 'usuarios' && <UsuariosPage />}
      </div>
    </div>
  );
}

// Dashboard Component
function DashboardPage() {
  const hoy = hoyHermosillo();
  const { token } = useAdminStore();

  const { data: statsHoy } = useQuery({
    queryKey: ['statsHoy', hoy],
    queryFn: () => getEstadisticasHoy(hoy, token),
    enabled: !!token,
  });

  const { data: statsSemana } = useQuery({
    queryKey: ['statsSemana', hoy],
    queryFn: () => getEstadisticasSemana(hoy, token),
    enabled: !!token,
  });

  const { data: horasPico } = useQuery({
    queryKey: ['horasPico', hoy],
    queryFn: () => getHorasPico(hoy, token),
    enabled: !!token,
  });

  const { data: masVendidos } = useQuery({
    queryKey: ['masVendidos'],
    queryFn: () => getMasVendidos(token),
    enabled: !!token,
  });

  return (
    <div className="page active" id="page-dashboard">
      <div className="metrics-grid" id="metrics-hoy">
        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-label">Pedidos Hoy</div>
          <div className="metric-value">{statsHoy?.total_pedidos || '—'}</div>
          <div className="metric-sub">Cargando...</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-label">Ventas Hoy</div>
          <div className="metric-value pink">{statsHoy ? formatMXN(statsHoy.total_ventas) : '—'}</div>
          <div className="metric-sub">Cargando...</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🟢</div>
          <div className="metric-label">Listos</div>
          <div className="metric-value green">{statsHoy?.entregados || '—'}</div>
          <div className="metric-sub">Cargando...</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-label">Por entregar</div>
          <div className="metric-value">{statsHoy?.en_proceso || '—'}</div>
          <div className="metric-sub">Cargando...</div>
        </div>
      </div>

      <div className="dashboard-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
        <div className="panel-card">
          <div className="section-title">📈 Ventas últimos 7 días</div>
          <div className="bar-chart" id="chart-semana">
            {statsSemana?.map((d, i) => (
              <div key={i} className="bar-row">
                <div className="bar-label">{new Date(d.fecha + 'T07:00:00Z').toLocaleDateString('es-MX', { weekday: 'short' })}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.min((d.total_ventas / Math.max(...statsSemana.map(x => x.total_ventas))) * 100, 100)}%` }}>
                    <span className="bar-val">{formatMXN(d.total_ventas)}</span>
                  </div>
                </div>
                <div className="bar-val-right">{d.total_pedidos} ped</div>
              </div>
            )) || <div className="loading">Cargando...</div>}
          </div>
        </div>
        <div className="panel-card">
          <div className="section-title">⏰ Horas pico</div>
          <div className="bar-chart" id="chart-horas">
            {horasPico?.slice(0, 5).map((h, i) => (
              <div key={i} className="bar-row">
                <div className="bar-label">{h.label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.min((h.total_ventas / Math.max(...horasPico.map(x => x.total_ventas))) * 100, 100)}%` }}>
                    <span className="bar-val">{formatMXN(h.total_ventas)}</span>
                  </div>
                </div>
                <div className="bar-val-right">{h.total_pedidos} ped</div>
              </div>
            )) || <div className="loading">Cargando...</div>}
          </div>
        </div>
      </div>

      <div className="panel-card" style={{ marginTop: '20px' }}>
        <div className="section-title">🏆 Productos más vendidos</div>
        <div className="top-list" id="top-productos-dash">
          {masVendidos?.slice(0, 5).map((p, i) => (
            <div key={i} className="top-item">
              <div className="top-rank">{i + 1}</div>
              <div className="top-name">{p.producto}</div>
              <div className="top-sub">{p.veces_pedido} pedidos</div>
              <div className="top-val">{formatMXN(p.ingresos)}</div>
            </div>
          )) || <div className="loading">Cargando...</div>}
        </div>
      </div>
    </div>
  );
}

// Pedidos Component
function PedidosPage({ token }) {
  const hoy = hoyHermosillo();
  const [filtro, setFiltro] = useState(null);

  const { data: pedidos, refetch } = useQuery({
    queryKey: ['pedidos', hoy, filtro],
    queryFn: () => getPedidos(hoy, filtro, 200, token),
    enabled: !!token,
    refetchInterval: 30000,
  });

  const updateEstado = useMutation({
    mutationFn: ({ id, estado }) => updatePedidoEstado(id, estado, token),
    onSuccess: () => refetch(),
  });

  return (
    <div className="page" id="page-pedidos">
      <div className="panel-card">
        <div className="section-title">📋 Pedidos de hoy</div>
        <div className="filters" id="filters-hoy">
          <button className={`filter-btn ${!filtro ? 'active' : ''}`} onClick={() => setFiltro(null)}>Todos</button>
          <button className={`filter-btn ${filtro === 'recibido' ? 'active' : ''}`} onClick={() => setFiltro('recibido')}>🔵 Recibidos</button>
          <button className={`filter-btn ${filtro === 'preparando' ? 'active' : ''}`} onClick={() => setFiltro('preparando')}>🟡 Preparando</button>
          <button className={`filter-btn ${filtro === 'listo' ? 'active' : ''}`} onClick={() => setFiltro('listo')}>🟢 Listos</button>
          <button className={`filter-btn ${filtro === 'entregado' ? 'active' : ''}`} onClick={() => setFiltro('entregado')}>✅ Entregados</button>
          <button className={`filter-btn ${filtro === 'cancelado' ? 'active' : ''}`} onClick={() => setFiltro('cancelado')}>❌ Cancelados</button>
        </div>
        <div className="table-wrap" style={{ marginBottom: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tbody-pedidos-hoy">
              {pedidos?.map((p) => (
                <tr key={p.id_pedido}>
                  <td>{p.id_pedido}</td>
                  <td>{p.nombre_cliente}</td>
                  <td>{p.tipo_entrega === 'domicilio' ? '🛵 Domicilio' : '🏪 Sucursal'}</td>
                  <td>{formatMXN(p.total)}</td>
                  <td>
                    <select
                      className="estado-select"
                      value={p.estado}
                      onChange={(e) => updateEstado.mutate({ id: p.id_pedido, estado: e.target.value })}
                    >
                      {Object.entries(ESTADOS_PEDIDO).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>{pedidoHora(p.fecha_pedido)}</td>
                  <td>
                    <button className="btn-action" onClick={() => alert('Ver detalle')}>👁️</button>
                  </td>
                </tr>
              )) || <tr><td colSpan="7" className="loading">Cargando...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Clientes Component
function ClientesPage({ token }) {
  const { data: topClientes } = useQuery({
    queryKey: ['topClientes'],
    queryFn: () => getTopClientes('todos', null, token),
    enabled: !!token,
  });

  return (
    <div className="page" id="page-clientes">
      <div className="panel-card">
        <div className="section-title">🏆 Top Clientes</div>
        <div className="top-list">
          {topClientes?.map((c, i) => (
            <div key={i} className="top-item">
              <div className="top-rank">{i + 1}</div>
              <div className="top-name">{c.nombre}</div>
              <div className="top-sub">{c.telefono}</div>
              <div className="top-val">{formatMXN(c.total_gastado)}</div>
            </div>
          )) || <div className="loading">Cargando...</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
