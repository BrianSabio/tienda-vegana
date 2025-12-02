const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
// TODO: Replace with your actual CallMeBot credentials
const PHONE = '56947884339'; // e.g., +34123456789
const API_KEY = '6271542';    // Get it from CallMeBot

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATA (In-Memory Product Catalog) ---
const products = [
    { id: 1, name: 'Pan de Masa Madre Sin Gluten', price: 3.00, image: 'https://placehold.co/300x200?text=Pan+Masa+Madre' },
    { id: 2, name: 'Queso Vegano de Anacardos', price: 4.50, image: 'https://placehold.co/300x200?text=Queso+Vegano' },
    { id: 3, name: 'Queso Vegano Madre Sin Gluten', price: 2.20, image: 'https://placehold.co/300x200?text=Queso+Madre' },
    { id: 4, name: 'Harina de Almendras', price: 12.00, image: 'https://placehold.co/300x200?text=Harina+Almendras' },
    { id: 5, name: 'Aceite de Coco Orgánico', price: 8.50, image: 'https://placehold.co/300x200?text=Aceite+Coco' },
    { id: 6, name: 'Miel Cruda', price: 9.00, image: 'https://placehold.co/300x200?text=Miel+Cruda' },
    { id: 7, name: 'Granola Sin Azúcar', price: 5.50, image: 'https://placehold.co/300x200?text=Granola' },
    { id: 8, name: 'Leche de Avena', price: 2.80, image: 'https://placehold.co/300x200?text=Leche+Avena' },
    { id: 9, name: 'Tofu Firme', price: 3.20, image: 'https://placehold.co/300x200?text=Tofu' },
    { id: 10, name: 'Quinoa Real', price: 4.00, image: 'https://placehold.co/300x200?text=Quinoa' },
    { id: 11, name: 'Semillas de Chía', price: 3.50, image: 'https://placehold.co/300x200?text=Chia' },
    { id: 12, name: 'Pasta de Lentejas', price: 3.80, image: 'https://placehold.co/300x200?text=Pasta+Lentejas' },
    { id: 13, name: 'Chocolate 85% Cacao', price: 4.20, image: 'https://placehold.co/300x200?text=Chocolate' },
    { id: 14, name: 'Té Matcha', price: 15.00, image: 'https://placehold.co/300x200?text=Matcha' },
    { id: 15, name: 'Sirope de Agave', price: 6.00, image: 'https://placehold.co/300x200?text=Agave' },
    { id: 16, name: 'Mantequilla de Maní', price: 5.00, image: 'https://placehold.co/300x200?text=Mantequilla+Mani' }
];

// --- ENDPOINTS ---

// GET /api/products - Retrieve all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST /api/order - Process order and notify via WhatsApp
app.post('/api/order', async (req, res) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Format message for WhatsApp
        let message = `*Nuevo Pedido - Tienda sin TACC*\n\n`;
        items.forEach(item => {
            message += `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\n*Total: $${total.toFixed(2)}*`;

        const encodedMessage = encodeURIComponent(message);
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${encodedMessage}&apikey=${API_KEY}`;

        // Send request to CallMeBot
        await axios.get(callMeBotUrl);

        console.log('Pedido enviado a WhatsApp:', message);
        res.json({ success: true, message: 'Pedido recibido y notificado.' });

    } catch (error) {
        console.error('Error al procesar el pedido:', error.message);
        res.status(500).json({ error: 'Error interno al procesar el pedido.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
