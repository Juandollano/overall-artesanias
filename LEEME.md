# Casa Over All — clon corregido de overall.com.py

Copia estática del sitio de Over All Artesanías, con los 171 productos reales (precios, fotos,
variantes de color y tamaño) y los errores del original corregidos.

## Cómo abrirlo y compartirlo

1. Doble clic en **`iniciar-servidor.bat`** (o `powershell -ExecutionPolicy Bypass -File servidor.ps1`).
2. En esta PC: <http://localhost:8080/>
3. Otras personas **en la misma red Wi-Fi**: la dirección `http://192.168.x.x:8080/` que muestra la ventana.
   La primera vez Windows puede preguntar si permitís el acceso de PowerShell a la red: aceptá **Redes privadas**.
4. Para detenerlo: cerrá la ventana o `Ctrl+C`.

Otro puerto: `servidor.ps1 -Puerto 8090`.

## Páginas

| Página | Archivo |
|---|---|
| Inicio (slider, categorías, ambientes, colecciones, destacados) | `index.html` |
| Tienda con filtros por categoría, ambiente, búsqueda, orden y "solo disponibles" | `tienda.html` |
| Ficha de producto con galería, variantes y precio por variante | `producto.html?p=<slug>` |
| Carrito y pedido por WhatsApp | `carrito.html` |
| Catálogo de regalos / Pesebres del Paraguay | `regalos.html`, `pesebres.html` |
| Nosotros / El arte inspira al arte / Glosario | `nosotros.html`, `arte.html`, `glosario.html` |

## Categorías (según la planilla "CATEGORIAS PAG WEB.xlsx")

- 15 categorías → subcategorías → material o técnica, definidas en **`js/categorias.js`**.
  Ahí también está a qué categoría va cada uno de los 171 productos: para mover uno, se edita su línea
  (`'slug-del-producto': 'categoria/subcategoria/material'`; varias rutas separadas por coma).
- Los pesebres aparecen también en **Navidad › Pesebres** automáticamente.
- Menú **Categorías** desplegable en el header; en la tienda, árbol de 3 niveles y filtro por material
  que cruza todas las categorías (por ejemplo, todo lo de ñandutí).
- Las subcategorías sin productos todavía no se muestran; aparecen solas cuando se les asigna un producto.
- **WhatsApp:** a los 4 segundos salta una ventanita con el enlace (si se cierra, no vuelve a salir en esa visita).
- **Destacados:** es una muestra con un producto de cada categoría, elegido al azar en cada visita.

## Errores del sitio original que se corrigieron

**Enlaces rotos o que no llevan a ningún lado**
- `/categoria-producto/tejidos/hamacas` y `/tejidos/manteles` (banners de la portada) daban **404**.
- La categoría **"Cuero"** de la portada no existía: ahora agrupa los 11 productos de cuero.
- **"Ao Po'i"** decía tener 15 productos pero la página salía vacía: ahora muestra los 20 productos de ao po'i.
- "Ir a la tienda" (en *El arte inspira al arte*) llevaba al inicio, no a la tienda.
- "Ver Políticas" llevaba al inicio (no existe esa página); se quitó.
- Enlaces `#` vacíos en el banner de Catálogo de regalos.
- Los enlaces de **WhatsApp** usaban `wa.me/5950981…` (con un 0 de más) y no abrían el chat: ahora `wa.me/595981754016` y `wa.me/595986128317`.
- Enlaces de "agregar al carrito" con `?utm_source=chatgpt.com` pegado, y enlaces de Google Maps llenos de parámetros de rastreo.

**Contenido y textos**
- Categorías mal escritas o duplicadas: "AaPesebre", "Fibras vgetales", dos "Cuadros y fachadas", dos "Individuales", dos "Figuras".
- Faltas de ortografía: "adquisicion", "Autentico", "Rustico", paréntesis sin cerrar en *Encaje Ju*, puntos sin espacio
  ("todo.Transforma", "económica.Todas"), espacios antes de comas, "Ao po´i" con tilde mal puesta.
- Mezcla de "Descubrí", "Descubre" y "Descubra" en la misma página: todo unificado en voseo, como el resto del sitio.
- Nombres de producto en mayúsculas ("SAGRADA FAMILIA ANGEL") normalizados.
- Precio repetido dos veces en cada tarjeta ("₲90.000 – ₲135.000 · RANGO DE PRECIOS: DESDE ₲90.000 HASTA ₲135.000").
- Producto sin precio ("Pesebre en lienzo"): ahora muestra "Consultar precio" con botón de WhatsApp en vez de ₲0.
- Los dos WhatsApp del pie se llamaban igual, "Whatsapp": ahora muestran su número.

**Imágenes**
- La sección "Descubrí otros ambientes" salía vacía y la tarjeta de **Filigrana** no tenía foto.
- 2 imágenes rotas (`src` vacío) en la portada; producto sin foto mostraba el placeholder gris de WooCommerce.
- Ninguna imagen tenía texto alternativo (`alt`): agregado.
- Fotos de hasta 2560 px y varios MB: optimizadas (las fotos de producto pasaron de 78 MB a 43 MB) y con carga diferida.

**Slider de la portada**
- Se mantienen los 4 slides a pantalla completa del original (Aire libre, Comedor, Baño, Habitación), con foto de fondo,
  header transparente encima, desplazamiento horizontal en bucle y botón "Ver más →" que lleva a cada ambiente.
- En el original el slide quedaba desalineado (se veía una franja del slide anterior a la izquierda): corregido.
- Los slides de Baño y Habitación no tenían título: se agregaron "Baños con identidad" y "Habitaciones para soñar"
  (se pueden cambiar en `index.html`).
- Cada slide entero es clicable; además se puede deslizar con el dedo, usar las flechas del teclado, y se pausa
  al pasar el mouse. Avanza cada 5 s (el original, cada 3 s, no daba tiempo a leer).

**Diseño, accesibilidad y SEO**
- Título de página duplicado ("Overall – Overall") y sin meta descripción: cada página tiene su título y descripción.
- Texto gris `#737272` con contraste insuficiente: oscurecido.
- Menú hamburguesa también en computadora: ahora el menú completo se ve en pantallas grandes.
- Widget de traducción y selector de moneda superpuestos sobre el contenido: quitados (los precios quedan en guaraníes).
- Agregado: enlace "saltar al contenido", foco visible con teclado, etiquetas en los botones de íconos y respeto de "reducir movimiento".

## Diferencias con el original

- No hay pasarela de pago ni cuentas de usuario (eso necesita el servidor de WordPress).
  El carrito se guarda en el navegador y el pedido se envía por **WhatsApp** al 0981 754 016,
  con productos, variantes, total, nombre y forma de entrega.
- Para que el sitio funcione, la carpeta tiene que servirse con `servidor.ps1` (o cualquier servidor web):
  abrir los `.html` con doble clic también funciona, salvo algunos navegadores que limitan el carrito.

## Detalles del original que no se pudieron corregir sin información de la tienda

- En "Colcha hilo fino telar" la medida 140 cm cuesta más (₲145.000) que la de 180 cm (₲135.000).
- Varios productos tienen el mismo nombre ("Pesebre madera pintada" ×3, "Pesebre en cerámica gordito" ×4…).
- "Pesebre ángel gordito" no tiene foto y "Pesebre en lienzo" no tiene precio.

Datos tomados de overall.com.py el 12/11/2026.
