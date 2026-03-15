import React from 'react';

function PromoCard({ promo, instances, onSelect, onEdit, onRemove }) {
  const isSelected = instances.length > 0;

  const getTagInfo = (tag) => {
    const tags = {
      popular: { class: 'tag-popular', label: '⭐ Popular' },
      hot: { class: 'tag-hot', label: '🌶️ Hot' },
      new: { class: 'tag-new', label: '✨ Nuevo' }
    };
    return tags[tag] || null;
  };

  const tagInfo = getTagInfo(promo.tag);

  return (
    <div
      className={`promo-card ${isSelected ? 'selected' : ''}`}
      id={`card-${promo.id}`}
      onClick={() => onSelect(promo.id)}
    >
      <div className="promo-num">{promo.num}</div>
      <div className="promo-title">
        <span dangerouslySetInnerHTML={{ __html: promo.emoji }} /> {promo.title}
      </div>
      <div className="card-desc">{promo.desc}</div>
      <div className="card-footer">
        <span className="promo-price">${promo.price} <small>MXN</small></span>
        {tagInfo && (
          <span className={`card-tag ${tagInfo.class}`} dangerouslySetInnerHTML={{ __html: tagInfo.label }} />
        )}
      </div>

      {instances.length > 0 && (
        <div className="card-instances" id={`instances-${promo.id}`}>
          {instances.map((inst, idx) => {
            const mods = inst.mods;
            const tags = [];

            if (mods.alga) {
              tags.push(mods.alga === 'con' ? 'Con alga' : 'Sin alga');
            }
            if (mods.proteins && mods.proteins.length) {
              const pnames = mods.proteins.map(pid => {
                const pr = window.PROTEINS?.find(x => x.id === pid);
                return pr ? pr.name : '';
              }).filter(Boolean);
              if (pnames.length) tags.push(pnames.join('+'));
            }
            if (mods.sauces && Object.keys(mods.sauces).length) {
              const sauceNames = window.SAUCES?.filter(s => mods.sauces[s.id]).map(s => s.name) || [];
              if (sauceNames.length) tags.push(sauceNames.join('/'));
            }
            if (mods.extraIngs && mods.extraIngs.length) {
              tags.push(mods.extraIngs.join(', '));
            }

            const label = tags.length ? tags.join(' · ') : `Unidad ${idx + 1}`;

            return (
              <div key={inst.instanceId} className="inst-row" onClick={(e) => e.stopPropagation()}>
                <span
                  className="inst-label"
                  onClick={(e) => { e.stopPropagation(); onEdit(inst.instanceId); }}
                >
                  ✏️ {label}
                </span>
                <button
                  className="inst-remove"
                  onClick={(e) => { e.stopPropagation(); onRemove(inst.instanceId); }}
                >
                  −
                </button>
              </div>
            );
          })}
          <button
            className="inst-add-more"
            onClick={(e) => { e.stopPropagation(); onSelect(promo.id); }}
          >
            + Agregar otro igual
          </button>
        </div>
      )}
    </div>
  );
}

export default PromoCard;
