const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN ---
// TODO: Reemplaza con tus credenciales reales de CallMeBot
const PHONE = '56947884339'; // e.g., +34123456789
const API_KEY = '6271542';    // Get it from CallMeBot

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATOS (Catálogo de Productos en Memoria) ---
const products = [
    { id: 1, name: 'Jalá Trenzada Tradicional', price: 4.50, image: 'https://placehold.co/300x200?text=Jala+Trenzada' },
    { id: 2, name: 'Babka de Chocolate', price: 8.00, image: 'https://placehold.co/300x200?text=Babka+Chocolate' },
    { id: 3, name: 'Hummus Casero Premium', price: 5.50, image: 'https://placehold.co/300x200?text=Hummus' },
    { id: 4, name: 'Matzá Artesanal', price: 6.00, image: 'https://placehold.co/300x200?text=Matza' },
    { id: 5, name: 'Vino Kosher Cabernet', price: 15.00, image: 'https://placehold.co/300x200?text=Vino+Kosher' },
    { id: 6, name: 'Rugelach de Canela', price: 7.50, image: 'https://placehold.co/300x200?text=Rugelach' },
    { id: 7, name: 'Gefilte Fish Casero', price: 9.00, image: 'https://placehold.co/300x200?text=Gefilte+Fish' },
    { id: 8, name: 'Pastrami Ahumado', price: 12.00, image: 'https://placehold.co/300x200?text=Pastrami' },
    { id: 9, name: 'Borekas de Papa', price: 6.50, image: 'https://placehold.co/300x200?text=Borekas' },
    { id: 10, name: 'Tahini Puro', price: 5.00, image: 'https://placehold.co/300x200?text=Tahini' },
    { id: 11, name: 'Falafel Congelado', price: 7.00, image: 'https://placehold.co/300x200?text=Falafel' },
    { id: 12, name: 'Miel Kosher para Rosh Hashaná', price: 8.50, image: 'https://placehold.co/300x200?text=Miel+Kosher' }
];

// --- RUTAS (ENDPOINTS) ---

// GET /api/products - Obtener todos los productos
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST /api/order - Procesar pedido y notificar vía WhatsApp
app.post('/api/order', async (req, res) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Formatear mensaje para WhatsApp
        let message = `*Nuevo Pedido - Tienda Kosher*\n\n`;
        items.forEach(item => {
            message += `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\n*Total: $${total.toFixed(2)}*`;

        const encodedMessage = encodeURIComponent(message);
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${encodedMessage}&apikey=${API_KEY}`;

        // Enviar petición a CallMeBot
        await axios.get(callMeBotUrl);

        console.log('Pedido enviado a WhatsApp:', message);
        res.json({ success: true, message: 'Pedido recibido y notificado.' });

    } catch (error) {
        console.error('Error al procesar el pedido:', error.message);
        res.status(500).json({ error: 'Error interno al procesar el pedido.' });
    }
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
