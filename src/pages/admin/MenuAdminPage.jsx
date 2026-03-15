import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAdminStore from '../../store/adminStore';
import { getProductos, createProducto, updateProducto, deleteProducto, updateDisponibilidad } from '../../api/productos';
import { uploadToCloudinary } from '../../utils/helpers';
import { CATEGORIAS, OPTS_MAP, EMOJI_GROUPS } from '../../utils/constants';

function MenuAdminPage() {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { token } = useAdminStore();

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => getProductos(token),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data) => createProducto(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProducto(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProducto(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
  });

  const toggleDisponibilidad = useMutation({
    mutationFn: ({ id, disponible }) => updateDisponibilidad(id, disponible, token),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id_producto);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este platillo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = (id, disponible) => {
    toggleDisponibilidad.mutate({ id, disponible: !disponible });
  };

  if (showForm) {
    return (
      <ProductoForm
        editingId={editingId}
        producto={productos?.find(p => p.id_producto === editingId)}
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
    <div className="page active" id="page-menu">
      <div className="panel-card">
        <div className="section-title">
          🍣 Gestión de Platillos
          <button className="btn-primary" onClick={() => setShowForm(true)} style={{ fontSize: '12px', padding: '6px 14px' }}>
            + Nuevo Platillo
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Cargando platillos...</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Disponibilidad</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Opciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos?.map((p) => (
                  <tr key={p.id_producto}>
                    <td>
                      <div className="toggle-wrap">
                        <div
                          className={`toggle ${p.disponible ? 'on' : ''}`}
                          onClick={() => handleToggle(p.id_producto, p.disponible)}
                          style={{ cursor: 'pointer' }}
                        ></div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{p.emoji}</span>
                        <div>
                          <div style={{ fontWeight: '600' }}>{p.nombre}</div>
                          {p.tag && (
                            <span className="badge badge-admin">{p.tag}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{CATEGORIAS[p.id_categoria]}</td>
                    <td>${p.precio}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {p.has_alga && <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>🌿 Alga</span>}
                        {p.has_protein && <span className="badge" style={{ background: '#FFF3E0', color: '#F57C00' }}>🥩 Prot</span>}
                        {p.has_sauce && <span className="badge" style={{ background: '#E3F2FD', color: '#1976D2' }}>🫙 Salsa</span>}
                        {p.has_sauce_2 && <span className="badge" style={{ background: '#E3F2FD', color: '#1976D2' }}>🫙 Salsa 2</span>}
                        {p.has_style && <span className="badge" style={{ background: '#F3E5F5', color: '#7B1FA2' }}>⚙️ Estilo</span>}
                        {p.is_extra_ing && <span className="badge" style={{ background: '#FFEBEE', color: '#C62828' }}>➕ Extra Ing</span>}
                      </div>
                    </td>
                    <td>
                      <button className="btn-action" onClick={() => handleEdit(p)}>✏️ Editar</button>
                      <button className="btn-action danger" onClick={() => handleDelete(p.id_producto)}>🗑️</button>
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

// Formulario de Producto
function ProductoForm({ editingId, producto, onSave, onCancel, isSaving }) {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    precio: producto?.precio || 0,
    id_categoria: producto?.id_categoria || 1,
    disponible: producto?.disponible ?? true,
    descripcion: producto?.descripcion || '',
    emoji: producto?.emoji || '🍣',
    tag: producto?.tag || null,
    imagen_url: producto?.imagen_url || null,
    has_alga: producto?.has_alga || false,
    has_style: producto?.has_style || false,
    has_protein: producto?.has_protein || false,
    has_sauce: producto?.has_sauce || false,
    has_sauce_1only: producto?.has_sauce_1only || false,
    has_sauce_2: producto?.has_sauce_2 || false,
    has_sauce_alitas: producto?.has_sauce_alitas || false,
    has_sushi_choice: producto?.has_sushi_choice || false,
    has_ice: producto?.has_ice || false,
    is_extra_ing: producto?.is_extra_ing || false,
    ingredientes: producto?.ingredientes || [],
    extras_producto: producto?.extras_producto || [],
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(producto?.imagen_url);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, imagen_url: url });
    } catch (error) {
      alert('Error al subir imagen: ' + error.message);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imagen_url: null });
  };

  const addIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [
        ...formData.ingredientes,
        { id: `ing_${Date.now()}`, emoji: '🥘', name: '', note: '', removable: false },
      ],
    });
  };

  const updateIngrediente = (index, field, value) => {
    const nuevos = [...formData.ingredientes];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setFormData({ ...formData, ingredientes: nuevos });
  };

  const removeIngrediente = (index) => {
    const nuevos = formData.ingredientes.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredientes: nuevos });
  };

  const addExtra = () => {
    setFormData({
      ...formData,
      extras_producto: [
        ...formData.extras_producto,
        { id: `ext_${Date.now()}`, emoji: '➕', name: '', note: '', price: 0 },
      ],
    });
  };

  const updateExtra = (index, field, value) => {
    const nuevos = [...formData.extras_producto];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setFormData({ ...formData, extras_producto: nuevos });
  };

  const removeExtra = (index) => {
    const nuevos = formData.extras_producto.filter((_, i) => i !== index);
    setFormData({ ...formData, extras_producto: nuevos });
  };

  return (
    <div className="page active">
      <div className="panel-card">
        <div className="section-title">
          {editingId ? '✏️ Editar Platillo' : '➕ Nuevo Platillo'}
          <button className="btn-secondary" onClick={onCancel} style={{ fontSize: '12px', padding: '6px 14px' }}>
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Fila 1: Nombre, Emoji, Precio, Categoría */}
          <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <div className="form-group">
              <label>Nombre del platillo</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. California"
                required
              />
            </div>
            <div className="form-group">
              <label>Emoji</label>
              <div style={{ position: 'relative' }}>
                <div className="emoji-preview-input" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    placeholder="🍣"
                    maxLength={4}
                    style={{ fontSize: '22px', textAlign: 'center', flex: 1 }}
                  />
                  <button type="button" className="btn-emoji-pick" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    ☺ Elegir
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="emoji-panel open" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '6px', zIndex: 300 }}>
                    {Object.entries(EMOJI_GROUPS).map(([group, emojis]) => (
                      <div key={group}>
                        <div className="emoji-panel-title">{group}</div>
                        <div className="emoji-panel-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                          {emojis.map((emoji) => (
                            <span
                              key={emoji}
                              className={`emoji-opt ${formData.emoji === emoji ? 'sel' : ''}`}
                              onClick={() => {
                                setFormData({ ...formData, emoji });
                                setShowEmojiPicker(false);
                              }}
                              style={{
                                fontSize: '22px',
                                padding: '5px 7px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: formData.emoji === emoji ? 'var(--pink-light)' : 'transparent',
                              }}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Precio ($)</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={formData.id_categoria}
                onChange={(e) => setFormData({ ...formData, id_categoria: parseInt(e.target.value) })}
              >
                {Object.entries(CATEGORIAS).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Descripción, Tag, Disponibilidad */}
          <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del platillo..."
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Tag (opcional)</label>
              <select
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value || null })}
              >
                <option value="">Sin tag</option>
                <option value="popular">⭐ Popular</option>
                <option value="hot">🌶️ Hot</option>
                <option value="new">✨ Nuevo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Disponibilidad</label>
              <div className="toggle-wrap" style={{ alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <div
                  className={`toggle ${formData.disponible ? 'on' : ''}`}
                  onClick={() => setFormData({ ...formData, disponible: !formData.disponible })}
                  style={{ cursor: 'pointer' }}
                ></div>
                <span>{formData.disponible ? 'Disponible' : 'No disponible'}</span>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="form-group">
            <label>Imagen</label>
            <div className="img-upload-wrap">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="img-upload-preview" />
                  <button type="button" className="btn-img-clear" onClick={handleRemoveImage}>
                    🗑️ Eliminar imagen
                  </button>
                </>
              ) : (
                <>
                  <div className="img-upload-label">Arrastra una imagen o <span>haz click para subir</span></div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </>
              )}
            </div>
          </div>

          {/* Opciones de personalización */}
          <div className="section-title" style={{ marginTop: '24px', fontSize: '14px' }}>
            ⚙️ Opciones de Personalización
          </div>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_alga}
                onChange={(e) => setFormData({ ...formData, has_alga: e.target.checked })}
              />
              🌿 Alga (Con/Sin)
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_style}
                onChange={(e) => setFormData({ ...formData, has_style: e.target.checked })}
              />
              ⚙️ Estilo (Natural/Empanizado)
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_protein}
                onChange={(e) => setFormData({ ...formData, has_protein: e.target.checked })}
              />
              🥩 Proteína
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_sauce}
                onChange={(e) => setFormData({ ...formData, has_sauce: e.target.checked })}
              />
              🫙 Salsa (Boneles)
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_sauce_1only}
                onChange={(e) => setFormData({ ...formData, has_sauce_1only: e.target.checked })}
              />
              🫙 1 Salsa Máx
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_sauce_2}
                onChange={(e) => setFormData({ ...formData, has_sauce_2: e.target.checked })}
              />
              🫙 Salsa 2ª Orden
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_sauce_alitas}
                onChange={(e) => setFormData({ ...formData, has_sauce_alitas: e.target.checked })}
              />
              🍗 Salsa Alitas
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_sushi_choice}
                onChange={(e) => setFormData({ ...formData, has_sushi_choice: e.target.checked })}
              />
              🍣 Sushi a Elegir
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.has_ice}
                onChange={(e) => setFormData({ ...formData, has_ice: e.target.checked })}
              />
              🧊 Hielo (Con/Sin)
            </label>
            <label className="opt-check" style={{ padding: '8px 12px', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formData.is_extra_ing}
                onChange={(e) => setFormData({ ...formData, is_extra_ing: e.target.checked })}
              />
              ➕ Es Ingrediente Extra
            </label>
          </div>

          {/* Ingredientes */}
          <div className="section-title" style={{ marginTop: '24px', fontSize: '14px' }}>
            🥘 Ingredientes
            <button type="button" className="btn-primary" onClick={addIngrediente} style={{ fontSize: '11px', padding: '4px 10px', marginLeft: '12px' }}>
              + Agregar
            </button>
          </div>
          {formData.ingredientes.map((ing, index) => (
            <div key={ing.id || index} className="ing-edit-row" style={{ display: 'grid', gridTemplateColumns: '44px 1fr 1fr 80px auto', gap: '6px', alignItems: 'center', background: '#FFF8F9', borderRadius: '9px', padding: '7px 10px', border: '1px solid var(--border)', marginBottom: '6px' }}>
              <input
                type="text"
                value={ing.emoji}
                onChange={(e) => updateIngrediente(index, 'emoji', e.target.value)}
                placeholder="🥘"
                maxLength={4}
                style={{ textAlign: 'center', fontSize: '20px' }}
              />
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngrediente(index, 'name', e.target.value)}
                placeholder="Nombre"
                required
              />
              <input
                type="text"
                value={ing.note}
                onChange={(e) => updateIngrediente(index, 'note', e.target.value)}
                placeholder="Nota"
              />
              <label className="opt-check" style={{ fontSize: '11px', padding: '4px 8px' }}>
                <input
                  type="checkbox"
                  checked={ing.removable}
                  onChange={(e) => updateIngrediente(index, 'removable', e.target.checked)}
                />
                removable
              </label>
              <button type="button" className="btn-del-ing" onClick={() => removeIngrediente(index)}>🗑️</button>
            </div>
          ))}

          {/* Extras */}
          <div className="section-title" style={{ marginTop: '24px', fontSize: '14px' }}>
            ➕ Extras del Producto
            <button type="button" className="btn-primary" onClick={addExtra} style={{ fontSize: '11px', padding: '4px 10px', marginLeft: '12px' }}>
              + Agregar
            </button>
          </div>
          {formData.extras_producto.map((ext, index) => (
            <div key={ext.id || index} className="extra-edit-row" style={{ display: 'grid', gridTemplateColumns: '44px 1fr 80px 70px auto', gap: '6px', alignItems: 'center', background: '#FFF8F9', borderRadius: '9px', padding: '7px 10px', border: '1px solid var(--border)', marginBottom: '6px' }}>
              <input
                type="text"
                value={ext.emoji}
                onChange={(e) => updateExtra(index, 'emoji', e.target.value)}
                placeholder="➕"
                maxLength={4}
                style={{ textAlign: 'center', fontSize: '20px' }}
              />
              <input
                type="text"
                value={ext.name}
                onChange={(e) => updateExtra(index, 'name', e.target.value)}
                placeholder="Nombre"
                required
              />
              <input
                type="text"
                value={ext.note}
                onChange={(e) => updateExtra(index, 'note', e.target.value)}
                placeholder="Nota"
              />
              <input
                type="number"
                value={ext.price}
                onChange={(e) => updateExtra(index, 'price', parseFloat(e.target.value) || 0)}
                placeholder="$"
                min="0"
                step="0.01"
              />
              <button type="button" className="btn-del-ing" onClick={() => removeExtra(index)}>🗑️</button>
            </div>
          ))}

          {/* Acciones */}
          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Platillo' : 'Crear Platillo')}
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

export default MenuAdminPage;
