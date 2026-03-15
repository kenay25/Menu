import React from 'react';
import useCartStore from '../store/cartStore';
import { calcExtraCost } from '../utils/helpers';
import { PROTEINS, SAUCES, EXTRA_INGS } from '../utils/constants';

function ModalPersonalizacion({ isOpen, instanceId, onConfirm, onCancel }) {
  const { getInstance } = useCartStore();
  const instance = getInstance(instanceId);

  if (!isOpen || !instance) return null;

  const { item, mods } = instance;
  const [currentMods, setCurrentMods] = React.useState(JSON.parse(JSON.stringify(mods || {
    removed: {},
    extras: {},
    sauces: {},
    sauces2: {},
    proteins: [],
    alga: null,
    extraIngs: []
  })));

  const fixed = (item.ingredients || []).filter(i => !i.removable);
  const removable = (item.ingredients || []).filter(i => i.removable);
  const extras = item.extras || [];

  // Handlers
  const togExtraIng = (nm) => {
    setCurrentMods(prev => {
      const idx = prev.extraIngs.indexOf(nm);
      const newExtraIngs = [...prev.extraIngs];
      if (idx >= 0) newExtraIngs.splice(idx, 1);
      else newExtraIngs.push(nm);
      return { ...prev, extraIngs: newExtraIngs };
    });
  };

  const selAlga = (val) => {
    setCurrentMods(prev => ({
      ...prev,
      alga: prev.alga === val ? null : val
    }));
  };

  const togProt = (pid) => {
    setCurrentMods(prev => {
      const idx = prev.proteins.indexOf(pid);
      const newProteins = [...prev.proteins];
      if (idx >= 0) newProteins.splice(idx, 1);
      else newProteins.push(pid);
      return { ...prev, proteins: newProteins };
    });
  };

  const togSauce = (sid, maxSauces, field) => {
    setCurrentMods(prev => {
      const newSauces = { ...(prev[field] || {}) };
      if (newSauces[sid]) {
        delete newSauces[sid];
      } else {
        if (Object.keys(newSauces).length >= maxSauces) {
          alert(`Máximo ${maxSauces} salsa(s).`);
          return prev;
        }
        newSauces[sid] = true;
      }
      return { ...prev, [field]: newSauces };
    });
  };

  const togIng = (ingId) => {
    setCurrentMods(prev => ({
      ...prev,
      removed: {
        ...prev.removed,
        [ingId]: !prev.removed[ingId]
      }
    }));
  };

  const togExtra = (exId) => {
    setCurrentMods(prev => ({
      ...prev,
      extras: {
        ...prev.extras,
        [exId]: !prev.extras[exId]
      }
    }));
  };

  const handleConfirm = () => {
    if (item.hasAlga && !currentMods.alga) {
      alert('🌿 Por favor indica si lo quieres con alga o sin alga');
      return;
    }

    const extraCost = calcExtraCost(currentMods, item);
    onConfirm(currentMods, extraCost);
  };

  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{item.name}</h3>
          <p>Personaliza como quieras</p>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          {/* Extra ingredient picker */}
          {item.isExtraIng && (
            <div className="extra-picker">
              <div className="extra-picker-title">➕ ¿Qué ingrediente(s) deseas? (elige uno o varios)</div>
              <div className="extra-picker-grid">
                {EXTRA_INGS.map(nm => (
                  <div
                    key={nm}
                    className={`extra-chip ${currentMods.extraIngs?.includes(nm) ? 'sel' : ''}`}
                    onClick={() => togExtraIng(nm)}
                  >
                    {nm}
                  </div>
                ))}
              </div>
              <div className="sauce-note">$15 por ingrediente · Puedes elegir varios</div>
            </div>
          )}

          {/* Alga picker */}
          {item.hasAlga && (
            <div className="alga-section">
              <div className="alga-section-title">🌿 ¿Con o sin alga?</div>
              <div className="alga-grid">
                <div
                  className={`alga-btn ${currentMods.alga === 'con' ? 'sel' : ''}`}
                  onClick={() => selAlga('con')}
                >
                  🌿 Con alga
                </div>
                <div
                  className={`alga-btn ${currentMods.alga === 'sin' ? 'sel' : ''}`}
                  onClick={() => selAlga('sin')}
                >
                  ❌ Sin alga
                </div>
              </div>
            </div>
          )}

          {/* Protein picker */}
          {item.hasProtein && (
            <div className="protein-section">
              <div className="protein-section-title">🥩 Elige tu(s) proteína(s)</div>
              <div className="protein-grid">
                {PROTEINS.map(p => {
                  const cnt = currentMods.proteins?.filter(x => x === p.id).length || 0;
                  return (
                    <div
                      key={p.id}
                      id={`pb-${p.id}`}
                      className={`protein-btn ${cnt > 0 ? 'sel' : ''}`}
                      onClick={() => togProt(p.id)}
                    >
                      <span className="p-emoji">{p.emoji}</span>
                      <span className="p-name">{p.name}</span>
                      {cnt > 1 && <span className="p-count">{cnt}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="protein-note">Primera proteína incluida · Extras +$15 c/u</div>
            </div>
          )}

          {/* Sauce 1 */}
          {item.hasSauce && (
            <div className="sauce-section">
              <div className="sauce-section-title">🫙 Salsa para los boneles (hasta 2)</div>
              <div className="sauce-grid">
                {SAUCES.map(s => (
                  <div
                    key={s.id}
                    id={`sb-${s.id}`}
                    className={`sauce-btn ${currentMods.sauces?.[s.id] ? 'sel' : ''}`}
                    onClick={() => togSauce(s.id, 2, 'sauces')}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
              <div className="sauce-note">Puedes elegir hasta 2 salsas</div>
            </div>
          )}

          {/* Sauce 2 */}
          {item.hasSauce2 && (
            <div className="sauce-section">
              <div className="sauce-section-title">🫙 Salsa para la 2ª orden de boneles (hasta 2)</div>
              <div className="sauce-grid">
                {SAUCES.map(s => (
                  <div
                    key={s.id}
                    id={`sb2-${s.id}`}
                    className={`sauce-btn ${currentMods.sauces2?.[s.id] ? 'sel' : ''}`}
                    onClick={() => togSauce(s.id, 2, 'sauces2')}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
              <div className="sauce-note">Para la 2ª orden de boneles</div>
            </div>
          )}

          {/* Fixed ingredients */}
          {fixed.length > 0 && (
            <div className="ing-section">
              <div className="ing-section-title">🔒 Ingredientes fijos</div>
              <div className="ing-list">
                {fixed.map(i => (
                  <div key={i.id} className="ing-item">
                    <div className="ing-left">
                      <span className="ing-emoji" dangerouslySetInnerHTML={{ __html: i.emoji }} />
                      <div>
                        <div className="ing-name">{i.name}</div>
                        <div className="ing-note">{i.note}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Fijo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removable ingredients */}
          {removable.length > 0 && (
            <div className="ing-section">
              <div className="ing-section-title">✏️ Quitar ingredientes</div>
              <div className="ing-list">
                {removable.map(i => {
                  const rm = currentMods.removed?.[i.id];
                  return (
                    <div
                      key={i.id}
                      id={`ming-${i.id}`}
                      className={`ing-item ${rm ? 'removed' : ''}`}
                    >
                      <div className="ing-left">
                        <span className="ing-emoji" dangerouslySetInnerHTML={{ __html: i.emoji }} />
                        <div>
                          <div className="ing-name">{i.name}</div>
                          <div className="ing-note">{i.note}</div>
                        </div>
                      </div>
                      <button
                        className="ing-toggle"
                        onClick={() => togIng(i.id)}
                      >
                        {rm ? 'Volver a poner' : 'Quitar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras */}
          {extras.length > 0 && (
            <div className="ing-section">
              <div className="ing-section-title">➕ Agregar extras</div>
              <div className="ing-list">
                {extras.map(ex => {
                  const ad = currentMods.extras?.[ex.id];
                  return (
                    <div
                      key={ex.id}
                      id={`mex-${ex.id}`}
                      className={`ing-item ${ad ? 'extra-added' : ''}`}
                    >
                      <div className="ing-left">
                        <span className="ing-emoji" dangerouslySetInnerHTML={{ __html: ex.emoji }} />
                        <div>
                          <div className="ing-name">{ex.name}</div>
                          <div className="ing-note">{ex.note}</div>
                        </div>
                      </div>
                      <button
                        className="ing-toggle"
                        onClick={() => togExtra(ex.id)}
                      >
                        {ad ? 'Quitar' : 'Agregar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button className="btn-modal-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn-modal-confirm" onClick={handleConfirm}>
              ✓ Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPersonalizacion;
