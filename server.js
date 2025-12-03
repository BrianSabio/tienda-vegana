const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN ---
// TODO: Reemplaza con tus credenciales reales de CallMeBot
const PHONE = process.env.PHONE;
const API_KEY = process.env.API_KEY;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATOS (Catálogo de Productos en Memoria) ---
const products = [
    { id: 1, name: 'Pasta de Maní Natural Entrenuts 370 gr.', price: 3000, image: '/assets/pasta-mani-natural.jpg' },
    { id: 2, name: 'Pasta de Maní Crocante Entrenuts 370 gr.', price: 3000, image: '/assets/pasta-mani-crocante.jpg' },
    { id: 3, name: 'Pasta de Maní Coco Entrenuts 370 gr.', price: 3000, image: '/assets/pasta-mani-coco.jpg' },
    { id: 4, name: 'Pasta de Maní Stevia Entrenuts 370 gr.', price: 3000, image: '/assets/pasta-mani-stevia.jpg' },
    { id: 5, name: 'Avena Instantánea Cumaná 400 gr.', price: 3000, image: '/assets/avena-instantanea.jpg' },
    { id: 6, name: 'Avena Tradicional Cumaná 400 gr.', price: 3000, image: '/assets/avena-tradicional.jpg' },
    { id: 7, name: 'Mix Semillas Ensalada Cumaná 250 gr.', price: 2500, image: '/assets/mix-semillas-ensalada.jpg' },
    { id: 8, name: 'Mix Semillas Desayuno Cumaná 250 gr.', price: 2500, image: '/assets/mix-semillas-desayuno.jpg' },
    { id: 9, name: 'Semillas de Chía Cumaná 1 kg.', price: 12000, image: '/assets/semillas-chia.jpg' },
    { id: 10, name: 'Semillas de Lino Cumaná 1 kg.', price: 5000, image: '/assets/semillas-lino.jpg' },
    { id: 11, name: 'Semillas de Sésamo Cumaná 1 kg.', price: 7000, image: '/assets/semillas-sesamo.jpg' },
    { id: 12, name: 'Semillas de Girasol Cumaná 1 kg.', price: 7000, image: '/assets/semillas-girasol.jpg' },
    { id: 13, name: 'Semillas de Fenogreco Cumaná 1 kg.', price: 8000, image: '/assets/semillas-fenogreco.jpg' },
    { id: 14, name: 'Semillas de Mostaza Cumaná 1 kg.', price: 7000, image: '/assets/semillas-mostaza.jpg' },
    { id: 15, name: 'Cúrcuma en Polvo Cumaná 1 kg.', price: 9000, image: '/assets/curcuma-polvo.jpg' },
    { id: 16, name: 'Harina de Coco Cumaná 1 kg.', price: 9000, image: '/assets/harina-coco.jpg' }
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
