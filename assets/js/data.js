/* =============================================================
   MOTO FÁCIL RÍO CUARTO — datos editables
   -------------------------------------------------------------
   Este es el ÚNICO archivo que hay que tocar para actualizar
   precios, modelos, planes y datos de contacto.
   ============================================================= */

/* ---------- 1. Datos del negocio ---------- */
const NEGOCIO = {
  nombre: "Moto Fácil Río Cuarto",
  direccion: "Pedro Goyena 16, Río Cuarto, Córdoba",
  telefonoVisible: "0358 431-7287",
  // Formato internacional sin + ni espacios. 549 = Argentina móvil.
  // CONFIRMAR que este número tenga WhatsApp activo.
  whatsapp: "5493584317287",
  instagram: "https://www.instagram.com/motofacilriocuarto/",
  facebook: "https://www.facebook.com/p/Moto-Facil-Rio-Cuarto-100064039240322/",
  mapa: "https://www.google.com/maps?q=Pedro+Goyena+16,+R%C3%ADo+Cuarto,+C%C3%B3rdoba&output=embed",
  horarios: [
    { dias: "Lunes a viernes", horas: "9:00 a 12:30 y 16:30 a 20:00" },
    { dias: "Sábados", horas: "11:00 a 13:00" }
  ]
};

/* ---------- 2. Planes de financiación ----------
   cuotas: cantidad de cuotas disponibles
   coef:   coeficiente que multiplica el precio de lista para
           obtener el TOTAL financiado. 1.00 = sin interés.
   VALORES DE EJEMPLO: reemplazar por los coeficientes reales
   que usa el local antes de publicar.                        */
const PLANES = [
  {
    id: "tarjeta",
    nombre: "Tarjeta de crédito",
    bajada: "Cuota fija en pesos con tu tarjeta. Aprobación en el momento.",
    requisitos: [
      "DNI",
      "Tarjeta de crédito a tu nombre con límite disponible",
      "No hace falta recibo de sueldo"
    ],
    opciones: [
      { cuotas: 3, coef: 1.00 },
      { cuotas: 6, coef: 1.12 },
      { cuotas: 12, coef: 1.28 },
      { cuotas: 18, coef: 1.45 }
    ]
  },
  {
    id: "personal",
    nombre: "Crédito personal",
    bajada: "Sin tarjeta. Para empleados, jubilados, pensionados y monotributistas.",
    requisitos: [
      "DNI",
      "Último recibo de haberes o constancia de monotributo",
      "Servicio a tu nombre o comprobante de domicilio",
      "Antigüedad laboral mínima de 6 meses"
    ],
    opciones: [
      { cuotas: 12, coef: 1.35 },
      { cuotas: 18, coef: 1.55 },
      { cuotas: 24, coef: 1.78 },
      { cuotas: 36, coef: 2.10 }
    ]
  },
  {
    id: "entrega",
    nombre: "Entrega + cuotas",
    bajada: "Ponés un anticipo y financiás el resto. Cuanto más entregás, menor la cuota.",
    requisitos: [
      "DNI",
      "Anticipo desde el 30% del valor de la moto",
      "Comprobante de ingresos"
    ],
    opciones: [
      { cuotas: 6, coef: 1.10 },
      { cuotas: 12, coef: 1.25 },
      { cuotas: 18, coef: 1.42 }
    ],
    admiteAnticipo: true
  }
];

/* ---------- 3. Catálogo ----------
   precio:    valor de lista en pesos (contado). ACTUALIZAR.
   img:       ruta o URL de la foto. Si queda vacío se muestra
              un placeholder con el nombre del modelo.
   destacada: true la muestra primero y con cinta.
   stock:     "disponible" | "pedido"                          */
const MOTOS = [
  {
    id: "honda-wave-110",
    marca: "Honda", modelo: "Wave 110 S",
    tipo: "Cub", cilindrada: 110, precio: 3450000,
    img: "assets/img/motos/honda-wave-110.jpg", destacada: true, stock: "disponible",
    specs: { motor: "109 cc, 4T", arranque: "Eléctrico y patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "La más elegida para el uso diario. Bajo consumo, repuestos en todos lados y reventa asegurada."
  },
  {
    id: "honda-twister-125",
    marca: "Honda", modelo: "CB125F Twister",
    tipo: "Street", cilindrada: 125, precio: 5290000,
    img: "assets/img/motos/honda-twister-125.jpg", destacada: true, stock: "disponible",
    specs: { motor: "124 cc, 4T", arranque: "Eléctrico", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Street naked liviana, cómoda en ciudad y con potencia de sobra para ruta corta."
  },
  {
    id: "honda-xr150l",
    marca: "Honda", modelo: "XR 150 L",
    tipo: "Enduro", cilindrada: 150, precio: 6890000,
    img: "assets/img/motos/honda-xr150l.jpg", destacada: false, stock: "disponible",
    specs: { motor: "149 cc, 4T", arranque: "Eléctrico y patada", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Doble propósito real: calle, camino de tierra y campo sin pedir permiso."
  },
  {
    id: "honda-biz-125",
    marca: "Honda", modelo: "Biz 125",
    tipo: "Cub", cilindrada: 125, precio: 4750000,
    img: "assets/img/motos/honda-biz-125.png", destacada: false, stock: "disponible",
    specs: { motor: "124 cc, 4T", arranque: "Eléctrico", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "Automatizada, práctica y económica. Ideal para delivery y trámites."
  },
  {
    id: "yamaha-ybr-125",
    marca: "Yamaha", modelo: "YBR 125 ED",
    tipo: "Street", cilindrada: 125, precio: 5150000,
    img: "assets/img/motos/yamaha-ybr-125.jpg", destacada: false, stock: "disponible",
    specs: { motor: "124 cc, 4T", arranque: "Eléctrico", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Un clásico confiable. Andar noble y mantenimiento barato."
  },
  {
    id: "yamaha-fzs-150",
    marca: "Yamaha", modelo: "FZ-S FI 150",
    tipo: "Street", cilindrada: 150, precio: 8450000,
    img: "assets/img/motos/yamaha-fzs-150.jpg", destacada: true, stock: "disponible",
    specs: { motor: "149 cc, inyección", arranque: "Eléctrico", transmision: "5 velocidades", freno: "Disco y disco" },
    detalle: "Inyección electrónica, frenos a disco en ambas ruedas y presencia de moto grande."
  },
  {
    // Sin foto oficial disponible todavía: se muestra el placeholder "Foto a cargar".
    id: "yamaha-crypton-110",
    marca: "Yamaha", modelo: "New Crypton 110",
    tipo: "Cub", cilindrada: 110, precio: 3690000,
    img: "", destacada: false, stock: "disponible",
    specs: { motor: "113 cc, 4T", arranque: "Eléctrico y patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "Consumo mínimo y chasis liviano. La compañera del día a día."
  },
  {
    id: "motomel-blitz-110",
    marca: "Motomel", modelo: "Blitz 110 Base",
    tipo: "Cub", cilindrada: 110, precio: 2290000,
    img: "assets/img/motos/motomel-blitz-110.png", destacada: true, stock: "disponible",
    specs: { motor: "107 cc, 4T", arranque: "Patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "La puerta de entrada más accesible. Entra en casi cualquier presupuesto de cuota."
  },
  {
    id: "motomel-skua-150",
    marca: "Motomel", modelo: "Skua 150 V6",
    tipo: "Enduro", cilindrada: 150, precio: 4390000,
    img: "assets/img/motos/motomel-skua-150.png", destacada: false, stock: "disponible",
    specs: { motor: "149 cc, 4T", arranque: "Eléctrico y patada", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Enduro nacional probada en tierra, con suspensión alta y buen despeje."
  },
  {
    id: "corven-energy-110",
    marca: "Corven", modelo: "Energy 110",
    tipo: "Cub", cilindrada: 110, precio: 2390000,
    img: "assets/img/motos/corven-energy-110.jpg", destacada: false, stock: "disponible",
    specs: { motor: "107 cc, 4T", arranque: "Eléctrico y patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "Económica, robusta y con service simple en cualquier taller."
  },
  {
    id: "corven-triax-150",
    marca: "Corven", modelo: "Triax 150 R3",
    tipo: "Enduro", cilindrada: 150, precio: 4590000,
    img: "assets/img/motos/corven-triax-150.jpg", destacada: false, stock: "disponible",
    specs: { motor: "149 cc, 4T", arranque: "Eléctrico y patada", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Buena relación precio y prestación para quien sale del asfalto."
  },
  {
    id: "guerrero-trip-110",
    marca: "Guerrero", modelo: "Trip 110",
    tipo: "Cub", cilindrada: 110, precio: 2250000,
    img: "assets/img/motos/guerrero-trip-110.png", destacada: false, stock: "disponible",
    specs: { motor: "107 cc, 4T", arranque: "Patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "Una de las cuotas más bajas del catálogo. Simple y efectiva."
  },
  {
    id: "zanella-zb-110",
    marca: "Zanella", modelo: "ZB 110 Z1",
    tipo: "Cub", cilindrada: 110, precio: 2320000,
    img: "assets/img/motos/zanella-zb-110.png", destacada: false, stock: "pedido",
    specs: { motor: "107 cc, 4T", arranque: "Eléctrico y patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "Clásica de ciudad, liviana y fácil de manejar para quien arranca."
  },
  {
    id: "keller-stratus-150",
    marca: "Keller", modelo: "Stratus 150",
    tipo: "Street", cilindrada: 150, precio: 3790000,
    img: "assets/img/motos/keller-stratus-150.jpg", destacada: false, stock: "disponible",
    specs: { motor: "149 cc, 4T", arranque: "Eléctrico", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Street de 150 a precio de 125. Buena opción para ruta corta."
  },
  {
    id: "keller-crono-plus-110",
    marca: "Keller", modelo: "Crono Classic Plus 110",
    tipo: "Cub", cilindrada: 110, precio: 2190000,
    img: "assets/img/motos/keller-crono-plus-110.png", destacada: false, stock: "pedido",
    specs: { motor: "107 cc, 4T", arranque: "Eléctrico y patada", transmision: "4 velocidades", freno: "Tambor" },
    detalle: "La opción más accesible para arrancar hoy mismo con cuota mínima."
  },
  {
    id: "motomel-strato-euro-150",
    marca: "Motomel", modelo: "Strato Euro 150",
    tipo: "Street", cilindrada: 150, precio: 4890000,
    img: "assets/img/motos/motomel-strato-euro-150.png", destacada: false, stock: "disponible",
    specs: { motor: "149 cc, 4T", arranque: "Eléctrico", transmision: "5 velocidades", freno: "Disco delantero" },
    detalle: "Street cómoda de dos plazas amplias, pensada para andar acompañado."
  }
];

/* ---------- 4. Preguntas frecuentes ---------- */
const FAQS = [
  {
    q: "¿Qué necesito para sacar la moto en cuotas?",
    a: "Con DNI y un comprobante de ingresos alcanza en la mayoría de los casos. Si vas por tarjeta de crédito, solo el DNI y la tarjeta a tu nombre."
  },
  {
    q: "¿Puedo si soy jubilado o pensionado?",
    a: "Sí. Trabajamos con líneas específicas para jubilados y pensionados, con cuota descontada del haber."
  },
  {
    q: "¿Y si soy monotributista o trabajo por mi cuenta?",
    a: "También. Se evalúa con constancia de monotributo o movimientos de cuenta. Consultanos tu caso puntual."
  },
  {
    q: "¿La moto se entrega patentada?",
    a: "Se entrega con toda la documentación para patentar. Te acompañamos en el trámite en el Registro."
  },
  {
    q: "¿Cuánto tarda la aprobación?",
    a: "Con tarjeta es en el momento. Con crédito personal, generalmente dentro de las 24 a 48 horas hábiles."
  },
  {
    q: "¿Los precios de la web son finales?",
    a: "Son precios de referencia y pueden variar según lista vigente y stock. Te confirmamos el valor exacto por WhatsApp antes de cerrar."
  }
];
