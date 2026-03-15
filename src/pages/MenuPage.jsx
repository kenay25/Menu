import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import MainNav from '../components/MainNav';
import MenuCard from '../components/MenuCard';
import PromoCard from '../components/PromoCard';
import ModalPersonalizacion from '../components/ModalPersonalizacion';
import ModalCliente from '../components/ModalCliente';
import OrderSummary from '../components/OrderSummary';
import FloatBar from '../components/FloatBar';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import usePedidosHabilitados from '../hooks/usePedidosHabilitados';
import { getMenuToken } from '../api/auth';
import { getProductos } from '../api/productos';
import { createPedido } from '../api/pedidos';
import { buildWhatsAppMessage, buildPedidoPayload, calcExtraCost } from '../utils/helpers';
import { MENU, PROMOS } from '../data/menuData';
import { PROTEINS, SAUCES } from '../utils/constants';

// Expose data globally for modal functions
window.PROTEINS = PROTEINS;
window.SAUCES = SAUCES;

function MenuPage() {
  const [activeSection, setActiveSection] = useState('combos');
  const [modalOpen, setModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [currentInstanceId, setCurrentInstanceId] = useState(null);
  const [isNewInstance, setIsNewInstance] = useState(false);
  const [orderType, setOrderType] = useState('recoger');
  const [orderNotes, setOrderNotes] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const { instances, addInstance, updateInstance, removeInstance, clearCart, getTotal, getCount } = useCartStore();
  const { sesion, getUser } = useAuthStore();
  const pedidosHabilitados = usePedidosHabilitados();

  // Get menu token and products
  const { data: menuToken } = useQuery({
    queryKey: ['menuToken'],
    queryFn: getMenuToken,
    staleTime: Infinity,
  });

  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: () => getProductos(menuToken),
    enabled: !!menuToken,
    staleTime: 5 * 60 * 1000,
  });

  // Sync images from API to static MENU
  useEffect(() => {
    if (productos) {
      // Update MENU items with images from API
      productos.forEach(prod => {
        const menuItem = Object.values(MENU).flat().find(m => m.dbId === prod.id_producto);
        if (menuItem && prod.imagen_url) {
          menuItem.img = prod.imagen_url;
        }
      });
    }
  }, [productos]);

  // Scroll spy
  useEffect(() => {
    const sections = ['combos', 'sushis', 'entradas', 'especiales', 'bebidas', 'promos', 'pedido'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -75% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const findItem = (id) => {
    const promo = PROMOS.find((x) => x.id === id);
    if (promo) return promo;
    for (const key of Object.keys(MENU)) {
      const found = MENU[key].find((x) => x.id === id);
      if (found) return found;
    }
    return null;
  };

  const getItemInstances = (itemId) => instances.filter((o) => o.itemId === itemId);

  const handleSelectItem = (itemId) => {
    const instanceId = addInstance(findItem(itemId));
    setCurrentInstanceId(instanceId);
    setIsNewInstance(true);
    setModalOpen(true);
  };

  const openModalEdit = (instanceId) => {
    setCurrentInstanceId(instanceId);
    setIsNewInstance(false);
    setModalOpen(true);
  };

  const handleConfirmMods = (mods, extraCost) => {
    if (!currentInstanceId) return;
    updateInstance(currentInstanceId, mods, extraCost);
    setModalOpen(false);
  };

  const handleCancelModal = () => {
    if (isNewInstance && currentInstanceId) {
      removeInstance(currentInstanceId);
    }
    setModalOpen(false);
  };

  const handleClearOrder = () => {
    if (confirm('¿Estás seguro de limpiar todo el pedido?')) {
      clearCart();
      setOrderNotes('');
    }
  };

  const handleCheckout = () => {
    if (!pedidosHabilitados) {
      alert('🚫 Los pedidos están temporalmente cerrados. Intenta más tarde.');
      return;
    }
    if (getCount() === 0) {
      alert('Agrega productos al pedido primero.');
      return;
    }
    setClientModalOpen(true);
  };

  const handleSendWhatsApp = async () => {
    if (!customerData.name || !customerData.phone) {
      alert('Por favor ingresa tu nombre y teléfono.');
      return;
    }
    if (orderType === 'envio' && !customerData.address) {
      alert('Por favor ingresa la dirección de entrega.');
      return;
    }

    try {
      // Try to save to backend
      if (menuToken) {
        const payload = buildPedidoPayload(
          instances,
          customerData.name,
          customerData.phone,
          customerData.address,
          orderType,
          orderNotes
        );
        await createPedido(payload, menuToken);
        console.log('✅ Pedido guardado en backend');
      }
    } catch (error) {
      console.error('Error saving to backend:', error);
    }

    // Send to WhatsApp
    const msg = buildWhatsAppMessage(
      instances,
      customerData.name,
      customerData.phone,
      customerData.address,
      orderType,
      orderNotes
    );
    window.open(`https://wa.me/526624580620?text=${encodeURIComponent(msg)}`, '_blank');

    // Clear cart
    clearCart();
    setClientModalOpen(false);
  };

  const renderMenuSection = (sectionKey, sectionId, title, subtitle) => (
    <section id={sectionId} className="sec-anchor">
      <div className="sec-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="menu-grid">
        {MENU[sectionKey].map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            instances={getItemInstances(item.id)}
            onSelect={handleSelectItem}
            onEdit={openModalEdit}
            onRemove={removeInstance}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="app">
      <Header />

      <MainNav activeSection={activeSection} />

      <main className="main">
        {!pedidosHabilitados && (
          <div className="pedidos-cerrados-banner" style={{ display: 'flex', marginBottom: '16px' }}>
            🚫 Los pedidos están temporalmente cerrados
          </div>
        )}

        {renderMenuSection('combos', 'combos', 'Combos', 'Las mejores combinaciones')}
        {renderMenuSection('sushis', 'sushis', 'Sushis', 'Especialidades de la casa')}
        {renderMenuSection('entradas', 'entradas', 'Entradas', 'Para comenzar')}
        {renderMenuSection('especiales', 'especiales', 'Especiales', 'Platillos especiales')}
        {renderMenuSection('bebidas', 'bebidas', 'Bebidas', 'Para acompañar')}

        <section id="promos" className="sec-anchor">
          <div className="sec-header">
            <h2>Promociones</h2>
            <p>Ahorra con nuestros paquetes especiales</p>
          </div>
          <div className="menu-grid">
            {PROMOS.map((promo) => (
              <PromoCard
                key={promo.id}
                promo={promo}
                instances={getItemInstances(promo.id)}
                onSelect={handleSelectItem}
                onEdit={openModalEdit}
                onRemove={removeInstance}
              />
            ))}
          </div>
        </section>

        <section id="pedido" className="sec-anchor order-section">
          <div className="sec-header">
            <h2>🛒 Mi Pedido</h2>
            <p>Revisa tu pedido antes de enviar</p>
          </div>
          <OrderSummary
            onEdit={openModalEdit}
            onRemove={removeInstance}
            onNotesChange={setOrderNotes}
            notes={orderNotes}
          />
        </section>
      </main>

      <FloatBar
        total={getTotal()}
        count={getCount()}
        onClear={handleClearOrder}
        onCheckout={handleCheckout}
        pedidosAbiertos={pedidosHabilitados}
      />

      <ModalPersonalizacion
        isOpen={modalOpen}
        instanceId={currentInstanceId}
        onConfirm={handleConfirmMods}
        onCancel={handleCancelModal}
      />

      <ModalCliente
        isOpen={clientModalOpen}
        orderType={orderType}
        customerData={customerData}
        onClose={() => setClientModalOpen(false)}
        onOrderTypeChange={setOrderType}
        onCustomerDataChange={(field, value) =>
          setCustomerData((prev) => ({ ...prev, [field]: value }))
        }
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
}

export default MenuPage;
