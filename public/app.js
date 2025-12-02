// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-price');
const cartCountElement = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// State
let cart = [];
const CART_STORAGE_KEY = 'tienda_sin_tacc_cart';
const CART_EXPIRY_HOURS = 2;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCart();
    updateCartUI();
});

// --- API CALLS ---
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Error al cargar productos');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        productGrid.innerHTML = '<p class="error">No se pudieron cargar los productos. Asegúrate de que el servidor esté corriendo.</p>';
    }
}

async function sendOrder(orderData) {
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    } catch (error) {
        throw new Error('Error de conexión al enviar el pedido');
    }
}

// --- RENDER FUNCTIONS ---
function renderProducts(products) {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Añadir al Carrito</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        return;
    }

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
}

// --- CART LOGIC ---
function loadCart() {
    const storedData = localStorage.getItem(CART_STORAGE_KEY);
    if (storedData) {
        const { cart: storedCart, timestamp } = JSON.parse(storedData);

        // Check Expiration
        const now = new Date().getTime();
        const hoursPassed = (now - timestamp) / (1000 * 60 * 60);

        if (hoursPassed > CART_EXPIRY_HOURS) {
            console.log('El carrito ha expirado.');
            localStorage.removeItem(CART_STORAGE_KEY);
            cart = [];
        } else {
            cart = storedCart;
        }
    }
}

function saveCart() {
    const data = {
        cart: cart,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
    updateCartUI();
}

// Make addToCart global so it can be called from HTML onclick
window.addToCart = function (id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    openCart();
};

window.removeFromCart = function (id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCountElement.textContent = totalCount;
    cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
    renderCartItems();
}

// --- CHECKOUT LOGIC ---
checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;

    const originalText = checkoutBtn.textContent;
    checkoutBtn.textContent = 'Procesando...';
    checkoutBtn.disabled = true;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = { items: cart, total };

    try {
        const result = await sendOrder(orderData);
        if (result.success) {
            alert('¡Pedido realizado con éxito! El dueño ha sido notificado por WhatsApp.');
            cart = [];
            saveCart();
            closeCart();
        } else {
            alert('Hubo un problema al procesar el pedido.');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
        checkoutBtn.textContent = originalText;
        checkoutBtn.disabled = false;
    }
});

// --- UI EVENT LISTENERS ---
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
}
