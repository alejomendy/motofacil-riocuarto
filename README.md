# Moto Fácil Río Cuarto — catálogo con financiación

Sitio estático (HTML, CSS y JavaScript sin dependencias) para que el cliente elija la moto,
simule la cuota, cargue sus datos y arranque el trámite por WhatsApp sin escribir nada.

## Estructura

```
index.html                    estructura de la página
assets/css/styles.css         estilos
assets/js/data.js             ÚNICO archivo a editar: motos, precios, planes y contacto
assets/js/app.js              catálogo, filtros, simulador y armado del mensaje
assets/img/favicon-*.png      ícono de pestaña del navegador
assets/img/frente-local.png   foto del frente del local (usada en el hero)
assets/img/motos/*            fotos de catálogo de cada modelo
```

## Identidad

Paleta clara tomada del logo de la marca: índigo `#453E8C` y naranja `#E87B33`, sobre
fondo crema `#F7F4EC`. Tipografías Sora (títulos) e Inter (texto), definidas como
variables CSS al inicio de `styles.css`. El logo es texto (`motofácil`), sin ícono
adicional, para que quede siempre nítido en cualquier tamaño de pantalla.

## Fotos del catálogo

14 de las 16 motos ya tienen foto real, bajada de los sitios oficiales de cada marca o
de fichas técnicas públicas (fichamotos.com.ar) y guardada localmente en
`assets/img/motos/`. Quedan sin foto (se ve el placeholder "Foto a cargar"):

- **Yamaha New Crypton 110**: no se encontró una foto oficial de uso libre disponible.

Al agregar una foto nueva, guardarla en `assets/img/motos/` y poner la ruta en el campo
`img` de esa moto en `data.js`. Las fotos son de referencia del modelo y pueden no
coincidir exactamente en color con la unidad real en stock (aclarado en la nota legal
del catálogo).

## Antes de publicar

1. **WhatsApp.** En `data.js`, `NEGOCIO.whatsapp` está en `5493584317287`, derivado del
   fijo 0358 431-7287. Hay que confirmar que ese número tenga WhatsApp activo; si el
   negocio usa otro celular, reemplazarlo en formato internacional sin `+` ni espacios.
2. **Coeficientes de financiación.** Los valores en `PLANES` son de ejemplo. Cada opción
   tiene un `coef` que multiplica el precio para obtener el total financiado
   (`1.00` es sin interés). Reemplazar por los coeficientes reales del local.
3. **Precios y modelos.** Los precios de `MOTOS` son de referencia. Actualizarlos con la
   lista vigente y borrar o agregar modelos según el stock real.
4. **Foto de la Crypton** (opcional): conseguir una foto del modelo y agregarla.

## Cómo agregar una moto

Copiar un bloque del array `MOTOS` en `data.js` y cambiar los campos. El `id` debe ser
único. `stock` acepta `"disponible"` o `"pedido"`. `destacada: true` la muestra primero
con la cinta "Más elegida". `tipo` acepta `"Cub"`, `"Street"` o `"Enduro"` (son las tres
categorías de la sección "Buscá por categoría"; un tipo nuevo no tendría tarjeta propia
ahí sin agregar su color en `TIPO_META` dentro de `app.js`).

## Ver el sitio localmente

```bash
npx -y serve -l 4321 .
```

Luego abrir http://localhost:4321

## Publicar

Al ser estático, sirve cualquier hosting: Vercel, Netlify, Cloudflare Pages o un FTP
común. No hay build ni backend. Los datos del formulario no se guardan en ningún lado:
viajan solo dentro del mensaje de WhatsApp que el cliente envía.
