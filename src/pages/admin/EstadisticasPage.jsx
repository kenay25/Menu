import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAdminStore from '../../store/adminStore';
import { getEstadisticasHoy, getEstadisticasSemana, getEstadisticasMes, getHorasPico, getMasVendidos, getTopClientes } from '../../api/admin';
import { hoyHermosillo, formatMXN, chartDate } from '../../utils/helpers';
import { CATEGORIAS } from '../../utils/constants';

function EstadisticasPage() {
  const [periodo, setPeriodo] = useState('semana'); // 'semana' | 'mes'
  const hoy = hoyHermosillo();
  const { token } = useAdminStore();

  // Estadísticas de hoy
  const { data: statsHoy } = useQuery({
    queryKey: ['statsHoy', hoy],
    queryFn: () => getEstadisticasHoy(hoy, token),
    enabled: !!token,
  });

  // Estadísticas semanales/mensuales
  const { data: statsPeriodo } = useQuery({
    queryKey: ['statsPeriodo', periodo, hoy],
    queryFn: () => periodo === 'semana' 
      ? getEstadisticasSemana(hoy, token)
      : getEstadisticasMes(hoy, token),
    enabled: !!token,
  });

  // Horas pico
  const { data: horasPico } = useQuery({
    queryKey: ['horasPico', hoy],
    queryFn: () => getHorasPico(hoy, token),
    enabled: !!token,
  });

  // Productos más vendidos
  const { data: masVendidos } = useQuery({
    queryKey: ['masVendidos'],
    queryFn: () => getMasVendidos(token),
    enabled: !!token,
  });

  // Top clientes
  const { data: topClientes } = useQuery({
    queryKey: ['topClientes'],
    queryFn: () => getTopClientes('todos', null, token),
    enabled: !!token,
  });

  // Calcular totales del período
  const totalVentasPeriodo = statsPeriodo?.reduce((sum, d) => sum + d.total_ventas, 0) || 0;
  const totalPedidosPeriodo = statsPeriodo?.reduce((sum, d) => sum + d.total_pedidos, 0) || 0;
  const ticketPromedioPeriodo = totalPedidosPeriodo > 0 ? totalVentasPeriodo / totalPedidosPeriodo : 0;

  // Calcular día con más ventas
  const diaMaxVentas = statsPeriodo?.reduce((max, d) => 
    d.total_ventas > (max?.total_ventas || 0) ? d : max
  , null);

  // Calcular hora pico máxima
  const horaPicoMax = horasPico?.reduce((max, h) => 
    h.total_ventas > (max?.total_ventas || 0) ? h : max
  , null);

  return (
    <div className="page active" id="page-estadisticas">
      {/* Header con selector de período */}
      <div className="panel-card">
        <div className="section-title">
          📊 Estadísticas y Reportes
          <div className="filters" style={{ marginBottom: 0 }}>
            <button
              className={`filter-btn ${periodo === 'semana' ? 'active' : ''}`}
              onClick={() => setPeriodo('semana')}
            >
              📅 Última Semana
            </button>
            <button
              className={`filter-btn ${periodo === 'mes' ? 'active' : ''}`}
              onClick={() => setPeriodo('mes')}
            >
              📅 Este Mes
            </button>
          </div>
        </div>

        {/* Métricas del período seleccionado */}
        <div className="metrics-grid" style={{ marginTop: '20px' }}>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-label">Ventas del Período</div>
            <div className="metric-value pink">{formatMXN(totalVentasPeriodo)}</div>
            <div className="metric-sub">{periodo === 'semana' ? 'Últimos 7 días' : 'Este mes'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🧾</div>
            <div className="metric-label">Pedidos del Período</div>
            <div className="metric-value">{totalPedidosPeriodo}</div>
            <div className="metric-sub">{periodo === 'semana' ? 'Últimos 7 días' : 'Este mes'}</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💳</div>
            <div className="metric-label">Ticket Promedio</div>
            <div className="metric-value">{formatMXN(ticketPromedioPeriodo)}</div>
            <div className="metric-sub">Por pedido</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🏆</div>
            <div className="metric-label">Día con Más Ventas</div>
            <div className="metric-value" style={{ fontSize: '18px' }}>
              {diaMaxVentas ? chartDate(diaMaxVentas.fecha) : '—'}
            </div>
            <div className="metric-sub">{diaMaxVentas ? formatMXN(diaMaxVentas.total_ventas) : 'Sin datos'}</div>
          </div>
        </div>
      </div>

      {/* Gráfica de Ventas por Día */}
      <div className="panel-card">
        <div className="section-title">
          📈 Ventas por Día {periodo === 'semana' ? '(Últimos 7 días)' : '(Este Mes)'}
        </div>
        <div className="bar-chart">
          {statsPeriodo?.map((d, i) => {
            const maxVenta = Math.max(...statsPeriodo.map(x => x.total_ventas));
            const porcentaje = maxVenta > 0 ? (d.total_ventas / maxVenta) * 100 : 0;
            
            return (
              <div key={i} className="bar-row">
                <div className="bar-label">{chartDate(d.fecha)}</div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${porcentaje}%` }}
                  >
                    <span className="bar-val">{formatMXN(d.total_ventas)}</span>
                  </div>
                </div>
                <div className="bar-val-right">{d.total_pedidos} pedidos</div>
              </div>
            );
          }) || <div className="loading">Cargando...</div>}
        </div>
      </div>

      {/* Gráfica de Horas Pico */}
      <div className="panel-card">
        <div className="section-title">
          ⏰ Horas Pico del Día
        </div>
        <div className="bar-chart">
          {horasPico?.slice(0, 12).map((h, i) => {
            const maxVenta = Math.max(...horasPico.map(x => x.total_ventas));
            const porcentaje = maxVenta > 0 ? (h.total_ventas / maxVenta) * 100 : 0;
            
            return (
              <div key={i} className="bar-row">
                <div className="bar-label">{h.label}</div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${porcentaje}%` }}
                  >
                    <span className="bar-val">{formatMXN(h.total_ventas)}</span>
                  </div>
                </div>
                <div className="bar-val-right">{h.total_pedidos} pedidos</div>
              </div>
            );
          }) || <div className="loading">Cargando...</div>}
        </div>
        {horaPicoMax && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#FFF0F4', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
              🕐 Hora con más ventas
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--pink)' }}>
              {horaPicoMax.label} - {formatMXN(horaPicoMax.total_ventas)} ({horaPicoMax.total_pedidos} pedidos)
            </div>
          </div>
        )}
      </div>

      {/* Productos Más Vendidos */}
      <div className="panel-card">
        <div className="section-title">
          🏆 Top 10 Productos Más Vendidos
        </div>
        <div className="top-list">
          {masVendidos?.slice(0, 10).map((p, i) => {
            const maxIngresos = Math.max(...masVendidos.map(x => x.ingresos));
            const porcentaje = maxIngresos > 0 ? (p.ingresos / maxIngresos) * 100 : 0;
            
            return (
              <div key={i} className="top-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div className="top-rank" style={{ 
                    background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'transparent',
                    color: i < 3 ? '#000' : 'var(--pink)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: i < 3 ? '50%' : '0',
                    fontWeight: '700',
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div className="top-name" style={{ flex: 1 }}>{p.producto}</div>
                  <div className="top-val">{formatMXN(p.ingresos)}</div>
                </div>
                <div className="bar-track" style={{ height: '8px' }}>
                  <div 
                    className="bar-fill" 
                    style={{ width: `${porcentaje}%`, height: '100%' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                  {p.veces_pedido} veces pedido
                </div>
              </div>
            );
          }) || <div className="loading">Cargando...</div>}
        </div>
      </div>

      {/* Top Clientes */}
      <div className="panel-card">
        <div className="section-title">
          👑 Top 10 Clientes
        </div>
        <div className="top-list">
          {topClientes?.slice(0, 10).map((c, i) => {
            const maxGastado = Math.max(...topClientes.map(x => x.total_gastado));
            const porcentaje = maxGastado > 0 ? (c.total_gastado / maxGastado) * 100 : 0;
            
            return (
              <div key={i} className="top-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div className="top-rank" style={{ 
                    background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'transparent',
                    color: i < 3 ? '#000' : 'var(--pink)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: i < 3 ? '50%' : '0',
                    fontWeight: '700',
                  }}>
                    {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="top-name">{c.nombre}</div>
                    <div className="top-sub">{c.telefono}</div>
                  </div>
                  <div className="top-val">{formatMXN(c.total_gastado)}</div>
                </div>
                <div className="bar-track" style={{ height: '8px' }}>
                  <div 
                    className="bar-fill" 
                    style={{ width: `${porcentaje}%`, height: '100%' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                  {c.total_pedidos} pedidos
                </div>
              </div>
            );
          }) || <div className="loading">Cargando...</div>}
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="panel-card">
        <div className="section-title">
          📋 Resumen Ejecutivo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#E8F5E9', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#2E7D32', marginBottom: '8px' }}>
              💰 Ingreso Promedio Diario
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1B5E20' }}>
              {formatMXN(statsPeriodo?.length > 0 ? totalVentasPeriodo / statsPeriodo.length : 0)}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#E3F2FD', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#1565C0', marginBottom: '8px' }}>
              📦 Pedidos Promedio por Día
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0D47A1' }}>
              {statsPeriodo?.length > 0 ? Math.round(totalPedidosPeriodo / statsPeriodo.length) : 0}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#FFF3E0', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#E65100', marginBottom: '8px' }}>
              🕐 Hora Más Ocupada
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#BF360C' }}>
              {horaPicoMax?.label || '—'}
            </div>
          </div>
          <div style={{ padding: '16px', background: '#F3E5F5', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6A1B9A', marginBottom: '8px' }}>
              🏆 Producto Estrella
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#4A148C' }}>
              {masVendidos?.[0]?.producto || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Exportar Reporte */}
      <div className="panel-card">
        <div className="section-title">
          💾 Exportar Reporte
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary"
            onClick={() => {
              const data = {
                periodo: periodo,
                fechaGeneracion: new Date().toLocaleString('es-MX'),
                totalVentas: totalVentasPeriodo,
                totalPedidos: totalPedidosPeriodo,
                ticketPromedio: ticketPromedioPeriodo,
                ventasPorDia: statsPeriodo,
                horasPico: horasPico,
                productosMasVendidos: masVendidos,
                topClientes: topClientes,
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `reporte-${periodo}-${hoy}.json`;
              a.click();
            }}
          >
            📄 Exportar JSON
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {
              const contenido = `
REPORTE DE ESTADÍSTICAS - La Esquina del Sushi
Generado: ${new Date().toLocaleString('es-MX')}
Período: ${periodo === 'semana' ? 'Última Semana' : 'Este Mes'}

═══════════════════════════════════════════════
RESUMEN DEL PERÍODO
═══════════════════════════════════════════════
Ventas Totales: ${formatMXN(totalVentasPeriodo)}
Pedidos Totales: ${totalPedidosPeriodo}
Ticket Promedio: ${formatMXN(ticketPromedioPeriodo)}
Día con Más Ventas: ${diaMaxVentas ? chartDate(diaMaxVentas.fecha) : 'N/A'}

═══════════════════════════════════════════════
VENTAS POR DÍA
═══════════════════════════════════════════════
${statsPeriodo?.map(d => `${chartDate(d.fecha)}: ${formatMXN(d.total_ventas)} (${d.total_pedidos} pedidos)`).join('\n') || 'Sin datos'}

═══════════════════════════════════════════════
HORAS PICO
═══════════════════════════════════════════════
${horasPico?.slice(0, 5).map(h => `${h.label}: ${formatMXN(h.total_ventas)} (${h.total_pedidos} pedidos)`).join('\n') || 'Sin datos'}

═══════════════════════════════════════════════
PRODUCTOS MÁS VENDIDOS
═══════════════════════════════════════════════
${masVendidos?.slice(0, 5).map((p, i) => `${i + 1}. ${p.producto} - ${formatMXN(p.ingresos)} (${p.veces_pedido} pedidos)`).join('\n') || 'Sin datos'}

═══════════════════════════════════════════════
TOP CLIENTES
═══════════════════════════════════════════════
${topClientes?.slice(0, 5).map((c, i) => `${i + 1}. ${c.nombre} - ${formatMXN(c.total_gastado)} (${c.total_pedidos} pedidos)`).join('\n') || 'Sin datos'}
              `.trim();
              const blob = new Blob([contenido], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `reporte-${periodo}-${hoy}.txt`;
              a.click();
            }}
          >
            📄 Exportar TXT
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasPage;
