import React from 'react';
import useCartStore from '../store/cartStore';

function OrderSummary({ onEdit, onRemove, onNotesChange, notes }) {
  const { instances } = useCartStore();

  if (instances.length === 0) {
    return (
      <div className="empty-state">
        <p>🛒</p>
        <p>Tu pedido está vacío</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Agrega productos del menú para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="order-section">
      <div className="order-items">
        {instances.map((inst) => {
          const mods = inst.mods;
          const lines = [];

          if (mods.extraIngs?.length) {
            lines.push({ type: 'added', text: `➕ Ingrediente(s): ${mods.extraIngs.join(', ')}` });
          }
          if (mods.alga) {
            lines.push({ type: 'added', text: `🌿 Alga: ${mods.alga === 'con' ? 'Con alga' : 'Sin alga'}` });
          }
          if (mods.proteins?.length) {
            const pnames = mods.proteins.map(pid => {
              const pr = window.PROTEINS?.find(x => x.id === pid);
              return pr ? pr.name : pid;
            }).filter(Boolean);
            lines.push({ type: 'added', text: `🥩 Proteína(s): ${pnames.join(', ')}` });
          }
          if (mods.sauces && Object.keys(mods.sauces).length) {
            const sauceNames = window.SAUCES?.filter(s => mods.sauces[s.id]).map(s => s.name) || [];
            if (sauceNames.length) lines.push({ type: 'added', text: `🫙 Salsa: ${sauceNames.join(', ')}` });
          }
          const rm = (inst.item.ingredients || []).filter(i => mods.removed?.[i.id]);
          if (rm.length) {
            lines.push({ type: 'removed', text: `🚫 Sin: ${rm.map(i => i.name).join(', ')}` });
          }
          const ax = (inst.item.extras || []).filter(e => mods.extras?.[e.id]);
          if (ax.length) {
            lines.push({ type: 'added', text: `✅ Extra: ${ax.map(e => e.name).join(', ')}` });
          }

          return (
            <div key={inst.instanceId} className="order-item">
              <span className="oi-emoji" dangerouslySetInnerHTML={{ __html: inst.item.emoji }} />
              <div className="oi-info">
                <div className="oi-name">{inst.item.name}</div>
                {lines.map((line, idx) => (
                  <div key={idx} className={line.type === 'removed' ? 'oi-mod-removed' : 'oi-mod-added'}>
                    {line.text}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <span className="oi-price">${inst.item.price + (inst.extraCost || 0)}</span>
                <button
                  className="btn-action"
                  onClick={() => onEdit(inst.instanceId)}
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-action danger"
                  onClick={() => onRemove(inst.instanceId)}
                  style={{ padding: '4px 8px', fontSize: '11px', borderColor: '#E74C3C', color: '#E74C3C' }}
                >
                  🗑️ Quitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="notes-section">
        <label>📝 Notas generales del pedido</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Algo más que quieras agregar a todo tu pedido..."
          rows={3}
        />
      </div>
    </div>
  );
}

export default OrderSummary;
