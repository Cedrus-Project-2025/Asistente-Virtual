// database.js
const cumbresDelSol = {
  // Información general del desarrollo
  nombre: "Residencial Cumbres del Sol",
  eslogan: "Elevando su estilo de vida",
  descripcion: "Cumbres del Sol es un exclusivo desarrollo residencial que combina la tranquilidad de la naturaleza con el confort de la vida moderna. Situado en una ubicación privilegiada con vistas panorámicas, nuestro desarrollo ofrece espacios diseñados para crear experiencias familiares inolvidables.",
  sitio_web: "www.cumbresdelsol.com",
  año_fundacion: 2022,
  estado_desarrollo: "En construcción - Fase 2",
  fecha_entrega_estimada: "Diciembre 2025",
  
  // Ubicación y características geográficas
  ubicacion: {
    direccion: "Av. del Sol 1250",
    colonia: "Lomas del Valle",
    municipio: "Santa Catarina",
    estado: "Nuevo León",
    codigo_postal: "66350",
    coordenadas: {
      latitud: 25.6811,
      longitud: -100.4627
    },
    puntos_interes_cercanos: [
      {nombre: "Centro Comercial Valle Oriente", distancia: "10 minutos"},
      {nombre: "Hospital Christus Muguerza", distancia: "15 minutos"},
      {nombre: "Aeropuerto Internacional MTY", distancia: "25 minutos"},
      {nombre: "Escuela Americana", distancia: "8 minutos"},
      {nombre: "Parque Natural La Huasteca", distancia: "7 minutos"}
    ]
  },
  
  // Detalles del terreno y lotes
  terreno: {
    superficie_total: 120000, // m²
    numero_lotes: 87,
    precio_m2: 9800,
    moneda: "MXN",
    lotes_disponibles: 42,
    tamaños_lote: [
      {tipo: "Estándar", superficie_min: 250, superficie_max: 350},
      {tipo: "Premium", superficie_min: 400, superficie_max: 600},
      {tipo: "Exclusivo", superficie_min: 700, superficie_max: 1200}
    ],
    restricciones_construccion: [
      "Altura máxima: 9 metros",
      "Coeficiente de ocupación: 70%",
      "Restricción frontal: 5 metros",
      "Restricción lateral: 2 metros"
    ]
  },
  
  // Amenidades del desarrollo
  amenidades: [
    "Casa club con alberca semiolímpica",
    "Gimnasio equipado",
    "Áreas verdes y jardines paisajísticos",
    "Parque infantil",
    "Canchas deportivas (tenis y pádel)",
    "Senderos para correr y ciclovía",
    "Seguridad 24/7 con acceso controlado",
    "Sistema de vigilancia CCTV",
    "Área de BBQ y eventos sociales",
    "Spa y sauna"
  ],
  
  // Casas modelo disponibles
  modelos_casa: [
    {
      nombre: "Modelo Luna",
      descripcion: "Diseño contemporáneo ideal para familias jóvenes",
      habitaciones: 3,
      baños: 2.5,
      superficie_construccion: 180,
      niveles: 2,
      precio_desde: 4800000,
      caracteristicas: [
        "Acabados de lujo",
        "Vestidor en habitación principal",
        "Cocina integral con isla",
        "Jardín amplio"
      ],
      disponibilidad: "Inmediata"
    },
    {
      nombre: "Modelo Solsticio",
      descripcion: "Residencia de lujo con espacios amplios y luminosos",
      habitaciones: 4,
      baños: 3.5,
      superficie_construccion: 320,
      niveles: 2,
      precio_desde: 7500000,
      caracteristicas: [
        "Doble altura en sala",
        "Oficina/estudio",
        "Terraza panorámica",
        "Sistema domótico integrado",
        "Área de servicio completa"
      ],
      disponibilidad: "3 meses"
    },
    {
      nombre: "Modelo Horizonte",
      descripcion: "Diseño vanguardista con énfasis en la sustentabilidad",
      habitaciones: 3,
      baños: 3,
      superficie_construccion: 250,
      niveles: 2,
      precio_desde: 5900000,
      caracteristicas: [
        "Paneles solares incluidos",
        "Sistema de captación de agua pluvial",
        "Ventanales de piso a techo",
        "Jardín vertical integrado",
        "Sala de cine en casa"
      ],
      disponibilidad: "Sobre planos"
    }
  ],
  
  // Opciones y planes de financiamiento
  plan_financiamiento: {
    opciones: [
      {
        descripcion: "Pago de contado",
        beneficios: ["10% de descuento en precio de lista", "Escrituración inmediata"],
        requisitos: ["Comprobante de fondos"]
      },
      {
        descripcion: "Financiamiento directo",
        beneficios: ["Sin revisión de buró de crédito", "Tasa preferencial del 9% anual"],
        requisitos: ["30% de enganche", "Identificación oficial", "Comprobante de domicilio"],
        plazos_disponibles: [5, 10, 15]
      },
      {
        descripcion: "Financiamiento bancario",
        beneficios: ["Enganche desde 20%", "Plazos hasta 20 años"],
        bancos_afiliados: ["BBVA", "Banorte", "Santander", "HSBC"]
      }
    ],
    condiciones: [
      "Precios sujetos a cambio sin previo aviso",
      "Enganche no reembolsable",
      "Aprobación de crédito sujeta a evaluación"
    ]
  },
  
  // Información de contacto y ventas
  contacto: {
    oficina_ventas: "Av. Constitución 2348, Col. Centro, Monterrey",
    horario: "Lunes a Sábado de 9:00 a 18:00, Domingos de 10:00 a 14:00",
    telefono_principal: "+52 (81) 8345-6789",
    correo: "ventas@cumbresdelsol.com",
    whatsapp: ["+52 (81) 4567-8901", "+52 (81) 4567-8902"],
    redes_sociales: {
      facebook: "fb.com/cumbresdelsol",
      instagram: "@cumbres_del_sol",
      youtube: "youtube.com/cumbresdelsol"
    }
  },
  
  // Preguntas frecuentes
  faq: [
    {
      pregunta: "¿Cuándo es la fecha de entrega estimada?",
      respuesta: "La fase actual del desarrollo tiene fecha de entrega estimada para diciembre de 2025, aunque algunas secciones estarán listas desde mediados de 2025."
    },
    {
      pregunta: "¿Qué incluye el precio del terreno?",
      respuesta: "El precio incluye escrituración, conexión a servicios básicos (agua, luz, drenaje), acceso a todas las amenidades del fraccionamiento y cuota de mantenimiento por el primer año."
    },
    {
      pregunta: "¿Cuál es el monto de mantenimiento mensual?",
      respuesta: "La cuota de mantenimiento es de $2,500 MXN mensuales, que cubre seguridad 24/7, mantenimiento de áreas comunes, recolección de basura y acceso a amenidades."
    },
    {
      pregunta: "¿Puedo construir con mi propio arquitecto?",
      respuesta: "Sí, puede construir con su propio arquitecto siempre que el diseño cumpla con las normativas del fraccionamiento y sea aprobado por nuestro comité arquitectónico."
    },
    {
      pregunta: "¿Ofrecen servicio de construcción de vivienda?",
      respuesta: "Sí, contamos con constructoras asociadas que pueden edificar su casa según nuestros modelos o diseños personalizados con precios preferenciales para nuestros clientes."
    }
  ],
  
  // Testimonios de clientes
  testimonios: [
    {
      nombre: "Familia Rodríguez",
      comentario: "Elegir Cumbres del Sol fue la mejor decisión. La calidad de vida y la tranquilidad son incomparables.",
      fecha: "Marzo 2024"
    },
    {
      nombre: "Luis y Marcela Garza",
      comentario: "Nos encantó la seguridad y las amenidades. Nuestros hijos disfrutan mucho de los espacios al aire libre.",
      fecha: "Enero 2024"
    },
    {
      nombre: "Roberto Sánchez",
      comentario: "La vista desde nuestro terreno es espectacular y la plusvalía ha incrementado significativamente en solo meses.",
      fecha: "Noviembre 2023"
    }
  ],
  
  // Etapas de desarrollo y avances
  etapas_desarrollo: [
    {
      fase: "Fase 1",
      estado: "Completada",
      fecha_entrega: "Agosto 2023",
      lotes: "1-28",
      porcentaje_ocupacion: 95
    },
    {
      fase: "Fase 2",
      estado: "En construcción",
      fecha_entrega: "Diciembre 2025",
      lotes: "29-65",
      porcentaje_avance: 60
    },
    {
      fase: "Fase 3",
      estado: "Planeación",
      fecha_inicio_estimada: "Marzo 2025",
      lotes: "66-87",
      estado_ventas: "Pre-venta disponible"
    }
  ]
};

export default cumbresDelSol;