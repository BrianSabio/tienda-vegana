# ✡️ Tienda Kosher

¡Bienvenido al MVP de **Tienda Kosher**! Un e-commerce dedicado a productos certificados, respetando la tradición y la calidad.

![Tienda Kosher Banner](public/assets/banner.png)

## 🚀 Características

- **🛒 Catálogo Dinámico**: Productos exclusivos Kosher cargados desde el servidor.
- **🛍️ Carrito Inteligente**: 
  - Persistencia local (no pierdes tu carrito si recargas).
  - **Auto-expiración**: Por seguridad y stock, el carrito se vacía automáticamente después de 2 horas.
- **📱 Pedidos por WhatsApp**: Integración directa. Al finalizar la compra, el dueño recibe un mensaje con el detalle del pedido.
- **🎨 Diseño Premium y Responsivo**: 
  - Interfaz limpia y moderna.
  - **100% Mobile-Friendly**: Menú hamburguesa, grids adaptables y tipografía ajustada para smartphones.

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
Hecho con 💙 para la comunidad.
