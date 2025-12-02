// =========================================
// CONFIGURACIÓN Y ESTADO
// =========================================
const API_URL = '/api/products';
const ORDER_URL = '/api/order';
const CART_STORAGE_KEY = 'tienda_kosher_cart';
const CART_EXPIRY_HOURS = 2;

let cart = []; // Estado local del carrito

// =========================================
// ELEMENTOS DEL DOM
// =========================================
const dom = {
    productGrid: document.getElementById('product-grid'),
    cartSidebar: document.getElementById('cart-sidebar'),
    cartItemsContainer: document.getElementById('cart-items'),
    cartTotalElement: document.getElementById('cart-total-price'),
    cartCountElement: document.getElementById('cart-count'),
    checkoutBtn: document.getElementById('checkout-btn'),
    overlay: document.getElementById('overlay'),

    // Botones
    cartBtn: document.getElementById('cart-btn'),
    closeCartBtn: document.getElementById('close-cart'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    navMenu: document.getElementById('nav-menu')
};

// =========================================
// INICIALIZACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadCart();      // Cargar carrito del localStorage
    fetchProducts(); // Obtener productos del backend
    setupEventListeners(); // Configurar eventos
}

// =========================================
// LÓGICA DE PRODUCTOS (API)
// =========================================
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al conectar con el servidor');

        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error:', error);
        dom.productGrid.innerHTML = `
            <div class="error-msg">
                <p>Lo sentimos, no se pudieron cargar los productos.</p>
                <small>Verifica que el servidor (server.js) esté corriendo.</small>
            </div>
        `;
    }
}

function renderProducts(products) {
    dom.productGrid.innerHTML = ''; // Limpiar loader

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="btn btn-primary btn-block" 
                    onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    Añadir al Carrito
                </button>
            </div>
        `;
        dom.productGrid.appendChild(card);
    });
}

// =========================================
// LÓGICA DEL CARRITO
// =========================================

// Función Global para ser llamada desde el HTML onclick
window.addToCart = function (id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart();
    openCart(); // Abrir carrito para feedback visual
};

window.removeFromCart = function (id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

function saveCart() {
    const state = {
        cart: cart,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    updateCartUI();
}

function loadCart() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
        try {
            const { cart: storedCart, timestamp } = JSON.parse(stored);

            // Verificar expiración (2 horas)
            const now = new Date().getTime();
            const hoursPassed = (now - timestamp) / (1000 * 60 * 60);

            if (hoursPassed > CART_EXPIRY_HOURS) {
                localStorage.removeItem(CART_STORAGE_KEY);
                cart = [];
            } else {
                cart = storedCart || [];
            }
        } catch (e) {
            console.error('Error al leer localStorage', e);
            cart = [];
        }
    }
    updateCartUI();
}

function updateCartUI() {
    // 1. Calcular Totales
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 2. Actualizar Contadores
    dom.cartCountElement.textContent = totalCount;
    dom.cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;

    // 3. Renderizar Ítems
    dom.cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        dom.cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        disableCheckout(true);
    } else {
        disableCheckout(false);
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})" title="Eliminar"></i>
            `;
            dom.cartItemsContainer.appendChild(itemEl);
        });
    }
}

function disableCheckout(isDisabled) {
    if (isDisabled) {
        dom.checkoutBtn.disabled = true;
        dom.checkoutBtn.textContent = 'Carrito Vacío';
        dom.checkoutBtn.style.opacity = '0.6';
        dom.checkoutBtn.style.cursor = 'not-allowed';
    } else {
        dom.checkoutBtn.disabled = false;
        dom.checkoutBtn.textContent = 'Finalizar Compra por WhatsApp';
        dom.checkoutBtn.style.opacity = '1';
        dom.checkoutBtn.style.cursor = 'pointer';
    }
}

// =========================================
// LÓGICA DE PEDIDO (CHECKOUT)
// =========================================
dom.checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;

    const originalText = dom.checkoutBtn.textContent;
    dom.checkoutBtn.textContent = 'Procesando...';
    dom.checkoutBtn.disabled = true;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = { items: cart, total };

    try {
        const response = await fetch(ORDER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            alert('¡Pedido enviado con éxito! El dueño recibirá tu orden en WhatsApp.');
            cart = [];
            saveCart();
            closeCart();
        } else {
            alert('Error: ' + (result.error || 'No se pudo enviar el pedido.'));
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión. Inténtalo nuevamente.');
    } finally {
        dom.checkoutBtn.textContent = originalText;
        if (cart.length > 0) dom.checkoutBtn.disabled = false;
    }
});

// =========================================
// EVENTOS DE UI (MENÚ Y MODALES)
// =========================================

// Abrir/Cerrar Carrito
function openCart() {
    dom.cartSidebar.classList.add('open');
    dom.overlay.classList.add('active');
}

function closeCart() {
    dom.cartSidebar.classList.remove('open');
    dom.overlay.classList.remove('active');
}

dom.cartBtn.addEventListener('click', openCart);
dom.closeCartBtn.addEventListener('click', closeCart);

// Menú Móvil
dom.mobileMenuBtn.addEventListener('click', () => {
    dom.mobileMenuBtn.classList.toggle('active');
    dom.navMenu.classList.toggle('active');

    // Si abrimos menú, mostramos overlay también (opcional, pero recomendado)
    if (dom.navMenu.classList.contains('active')) {
        dom.overlay.classList.add('active');
    } else {
        dom.overlay.classList.remove('active');
    }
});

// Cerrar todo al hacer click en Overlay
dom.overlay.addEventListener('click', () => {
    closeCart();
    // Cerrar menú móvil si está abierto
    dom.mobileMenuBtn.classList.remove('active');
    dom.navMenu.classList.remove('active');
    dom.overlay.classList.remove('active');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        dom.mobileMenuBtn.classList.remove('active');
        dom.navMenu.classList.remove('active');
        if (!dom.cartSidebar.classList.contains('open')) {
            dom.overlay.classList.remove('active');
        }
    });
});
