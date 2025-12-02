# 🌿 Tienda sin TACC

¡Bienvenido al MVP de **Tienda sin TACC**! Un e-commerce simple para productos orgánicos, sin gluten y veganos.

![Tienda Preview](https://placehold.co/600x300?text=Tienda+sin+TACC+Preview)

## 🚀 Características

- **🛒 Catálogo Dinámico**: 16 productos exclusivos cargados desde el servidor.
- **🛍️ Carrito Inteligente**: 
  - Persistencia local (no pierdes tu carrito si recargas).
  - **Auto-expiración**: Por seguridad y stock, el carrito se vacía automáticamente después de 2 horas.
- **📱 Pedidos por WhatsApp**: Integración directa. Al finalizar la compra, el dueño recibe un mensaje con el detalle del pedido.
- **🎨 Diseño Premium**: Interfaz limpia, moderna y responsive (móvil y escritorio).

## 🛠️ Tecnologías Usadas

- **Frontend**: HTML5, CSS3 (Variables, Flexbox/Grid), JavaScript Vanilla.
- **Backend**: Node.js, Express.
- **Integraciones**: CallMeBot (WhatsApp Gateway).

## 🏃‍♂️ Cómo ejecutarlo localmente

1.  **Clona o descarga** este repositorio.
2.  **Instala las dependencias**:
    ```bash
    npm install
    ```
3.  **Configura tus credenciales** (Opcional para probar WhatsApp):
    - Edita `server.js` y coloca tu `PHONE` y `API_KEY` de CallMeBot.
4.  **Inicia el servidor**:
    ```bash
    npm start
    ```
5.  Visita `http://localhost:3000` en tu navegador.

## 📦 Despliegue

Este proyecto está listo para ser desplegado en **Render** u otros servicios de hosting de Node.js.
- El puerto se configura automáticamente con `process.env.PORT`.

---
Hecho con 💚 para una alimentación consciente.
