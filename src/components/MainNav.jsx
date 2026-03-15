import React from 'react';

function MainNav({ activeSection }) {
  const sections = [
    { id: 'combos', label: 'Combos' },
    { id: 'sushis', label: 'Sushis' },
    { id: 'entradas', label: 'Entradas' },
    { id: 'especiales', label: 'Especiales' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'promos', label: 'Promos' },
    { id: 'pedido', label: '🛒 Mi Pedido', isOrder: true }
  ];

  const handleClick = (e, sectionId) => {
    if (sectionId === 'pedido') {
      e.preventDefault();
      document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="main-nav">
      {sections.map(section => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`nav-btn ${section.isOrder ? 'nav-pedido' : ''} ${activeSection === section.id ? 'active' : ''}`}
          onClick={(e) => handleClick(e, section.id)}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}

export default MainNav;
