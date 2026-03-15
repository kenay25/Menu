import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAdminStore from '../../store/adminStore';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../../api/admin';
import { ROLES_USUARIO } from '../../utils/constants';

function UsuariosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();
  const { token } = useAdminStore();

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => getUsuarios(token),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data) => createUsuario(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUsuario(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUsuario(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id_usuario);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteMutation.mutate(id);
    }
  };

  if (showForm) {
    return (
      <UsuarioForm
        editingId={editingId}
        usuario={usuarios?.find(u => u.id_usuario === editingId)}
        onSave={(data) => {
          if (editingId) {
            updateMutation.mutate({ id: editingId, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        onCancel={resetForm}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <div className="page active" id="page-usuarios">
      <div className="panel-card">
        <div className="section-title">
          👥 Gestión de Usuarios
          <button className="btn-primary" onClick={() => setShowForm(true)} style={{ fontSize: '12px', padding: '6px 14px' }}>
            + Nuevo Usuario
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios?.map((u) => (
                  <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td style={{ fontWeight: '600' }}>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.telefono || '—'}</td>
                    <td>
                      <span className={`badge ${u.rol === 'admin' ? 'badge-admin' : u.rol === 'cocina' ? 'badge-cocina' : 'badge-caja'}`}>
                        {ROLES_USUARIO[u.rol] || u.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.activo ? 'badge-listo' : 'badge-cancelado'}`}>
                        {u.activo ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </td>
                    <td>
                      {u.ultimo_acceso
                        ? new Date(u.ultimo_acceso + 'Z').toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Nunca'}
                    </td>
                    <td>
                      <button className="btn-action" onClick={() => handleEdit(u)}>✏️ Editar</button>
                      <button className="btn-action danger" onClick={() => handleDelete(u.id_usuario)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Formulario de Usuario
function UsuarioForm({ editingId, usuario, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
    password: '',
    telefono: usuario?.telefono || '',
    rol: usuario?.rol || 'caja',
    activo: usuario?.activo ?? true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // No enviar password vacío si es edición
    const dataToSend = { ...formData };
    if (editingId && !formData.password) {
      delete dataToSend.password;
    }
    
    onSave(dataToSend);
  };

  return (
    <div className="page active">
      <div className="panel-card">
        <div className="section-title">
          {editingId ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
          <button className="btn-secondary" onClick={onCancel} style={{ fontSize: '12px', padding: '6px 14px' }}>
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del usuario"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="662 000 0000"
              />
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                {Object.entries(ROLES_USUARIO).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Contraseña {editingId && <span style={{ color: 'var(--muted)', fontWeight: '400' }}>(dejar vacío si no desea cambiar)</span>}
              </label>
              <div className="pwd-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingId ? '••••••••' : 'Contraseña'}
                  required={!editingId}
                />
                <button
                  type="button"
                  className="btn-eye-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'var(--muted)',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <div className="toggle-wrap" style={{ alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <div
                  className={`toggle ${formData.activo ? 'on' : ''}`}
                  onClick={() => setFormData({ ...formData, activo: !formData.activo })}
                  style={{ cursor: 'pointer' }}
                ></div>
                <span>{formData.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuariosPage;
