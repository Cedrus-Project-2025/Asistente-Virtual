import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import cumbresDelSol from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Función mejorada para recuperar contexto relevante
const retrieveContext = (userMessage) => {
  const userMessageLower = userMessage.toLowerCase();
  let context = "";
  const contextItems = [];
  
  // Mapeo de palabras clave a secciones de la base de datos
  const keywordMappings = [
    {
      keywords: ["ubicación", "dónde está", "dónde queda", "dirección", "como llegar", "zona", "lugar"],
      getter: () => {
        const ubi = cumbresDelSol.ubicacion;
        return `Ubicación: ${ubi.direccion}, Col. ${ubi.colonia}, ${ubi.municipio}, ${ubi.estado}, CP ${ubi.codigo_postal}.`;
      }
    },
    {
      keywords: ["cerca", "cercano", "alrededor", "proximidad", "distancia"],
      getter: () => {
        return `Puntos de interés cercanos: ${cumbresDelSol.ubicacion.puntos_interes_cercanos.map(p => `${p.nombre} (${p.distancia})`).join(', ')}.`;
      }
    },
    {
      keywords: ["precio", "costo", "valor", "cuánto cuesta", "inversión", "cuestan", "valen"],
      getter: () => {
        return `Precio por m²: ${cumbresDelSol.terreno.precio_m2.toLocaleString()} ${cumbresDelSol.terreno.moneda}. Contamos con lotes desde ${cumbresDelSol.terreno.tamaños_lote[0].superficie_min} m² hasta ${cumbresDelSol.terreno.tamaños_lote[2].superficie_max} m².`;
      }
    },
    {
      keywords: ["lote", "terreno", "metros", "superficie", "tamaño", "medidas"],
      getter: () => {
        const terreno = cumbresDelSol.terreno;
        return `Ofrecemos ${terreno.lotes_disponibles} lotes disponibles en tres categorías: ${terreno.tamaños_lote.map(t => `${t.tipo} (${t.superficie_min}-${t.superficie_max} m²)`).join(', ')}.`;
      }
    },
    {
      keywords: ["amenidades", "instalaciones", "servicios", "club", "alberca", "gimnasio", "áreas comunes", "beneficios"],
      getter: () => {
        return `Amenidades: ${cumbresDelSol.amenidades.join(', ')}.`;
      }
    },
    {
      keywords: ["financiamiento", "crédito", "pago", "enganche", "apartado", "mensualidad", "hipoteca", "préstamo"],
      getter: () => {
        const fin = cumbresDelSol.plan_financiamiento;
        return `Opciones de financiamiento: ${fin.opciones.map(op => op.descripcion).join(', ')}. Condiciones: ${fin.condiciones.join(' ')}.`;
      }
    },
    {
      keywords: ["contacto", "teléfono", "celular", "llamar", "comunicar", "email", "correo", "whatsapp", "visitar"],
      getter: () => {
        const contacto = cumbresDelSol.contacto;
        return `Teléfono: ${contacto.telefono_principal}. WhatsApp: ${contacto.whatsapp.join(', ')}. Correo: ${contacto.correo}. Oficina de ventas: ${contacto.oficina_ventas} (${contacto.horario}).`;
      }
    },
    {
      keywords: ["casa", "modelo", "vivienda", "construir", "construcción", "diseño"],
      getter: () => {
        return `Modelos de casa disponibles: ${cumbresDelSol.modelos_casa.map(m => `${m.nombre} (${m.habitaciones} recámaras, ${m.superficie_construccion} m², desde ${m.precio_desde.toLocaleString()} MXN)`).join('; ')}.`;
      }
    },
    {
      keywords: ["entrega", "fecha", "cuándo", "tiempos", "plazo", "avance", "disponibilidad"],
      getter: () => {
        return `Fecha de entrega estimada: ${cumbresDelSol.fecha_entrega_estimada}. Estado actual: ${cumbresDelSol.estado_desarrollo}.`;
      }
    },
    {
      keywords: ["plusvalía", "inversión", "patrimonio", "futuro", "crecer", "valorización"],
      getter: () => {
        return `Cumbres del Sol es una excelente inversión. La Fase 1 ya cuenta con ${cumbresDelSol.etapas_desarrollo[0].porcentaje_ocupacion}% de ocupación, y la zona presenta un alto índice de plusvalía.`;
      }
    },
    {
      keywords: ["mantenimiento", "cuota", "gastos", "administración"],
      getter: () => {
        // Buscar la pregunta sobre mantenimiento en las FAQ
        const mantenimientoFaq = cumbresDelSol.faq.find(faq => faq.pregunta.includes("mantenimiento"));
        return mantenimientoFaq ? mantenimientoFaq.respuesta : "Contamos con cuotas de mantenimiento accesibles que cubren todos los servicios del fraccionamiento.";
      }
    }
  ];

  // Revisar si alguna palabra clave coincide con el mensaje
  for (const mapping of keywordMappings) {
    if (mapping.keywords.some(keyword => userMessageLower.includes(keyword))) {
      contextItems.push(mapping.getter());
    }
  }

  // Incluir testimonios cuando pregunten por experiencias o referencias
  if (userMessageLower.includes("opinión") || userMessageLower.includes("experiencia") || userMessageLower.includes("testimonio") || userMessageLower.includes("referencia")) {
    contextItems.push(`Testimonios de clientes: ${cumbresDelSol.testimonios.map(t => `"${t.comentario}" - ${t.nombre}, ${t.fecha}`).join('; ')}.`);
  }
  
  // Contestar preguntas específicas de las FAQ
  for (const faq of cumbresDelSol.faq) {
    const palabrasClavePregunta = faq.pregunta.toLowerCase().split(' ');
    // Si el mensaje contiene al menos 3 palabras clave de la pregunta (excepto artículos y preposiciones)
    const palabrasRelevantes = palabrasClavePregunta.filter(p => p.length > 3);
    if (palabrasRelevantes.some(palabra => userMessageLower.includes(palabra))) {
      contextItems.push(`${faq.pregunta}: ${faq.respuesta}`);
    }
  }
  
  // Construir el contexto con los items encontrados
  if (contextItems.length > 0) {
    context = contextItems.join('\n');
  } else {
    // Si no hay contexto específico, proporcionar información general
    context = `${cumbresDelSol.nombre} - ${cumbresDelSol.eslogan}. ${cumbresDelSol.descripcion}`;
  }
  
  return context;
};

// Crear prompt personalizado para el asistente
const crearPromptPersonalizado = (userMessage, context) => {
  return `
  INSTRUCCIONES PARA EL ASISTENTE DE VENTAS DE CUMBRES DEL SOL:
  
  Eres Ana Martínez, asesora inmobiliaria senior de Cumbres del Sol, un exclusivo desarrollo residencial en Santa Catarina, Nuevo León. Tienes 7 años de experiencia en el sector inmobiliario y conoces perfectamente cada detalle del desarrollo.
  
  PERSONALIDAD Y TONO:
  - Proyecta calidez, profesionalismo y conocimiento experto
  - Muestra entusiasmo genuino por el proyecto sin sonar excesivamente comercial
  - Utiliza un lenguaje claro, directo pero elegante
  - Sé empática con las necesidades e inquietudes del cliente
  - Habla siempre en primera persona como representante oficial ("Nuestro desarrollo...", "Le invito a...")
  
  OBJETIVOS PRINCIPALES:
  - Resolver dudas con información precisa y relevante
  - Transmitir la exclusividad y valor del desarrollo
  - Generar interés y confianza
  - Motivar al cliente a agendar una visita o solicitar más información
  
  LINEAMIENTOS DE COMUNICACIÓN:
  - Mantén respuestas concisas (máximo 3-4 oraciones)
  - Personaliza tus respuestas mencionando detalles específicos (ubicación, amenidades, etc.)
  - Destaca al menos un beneficio o ventaja competitiva en cada respuesta
  - Concluye frecuentemente con una invitación a la acción (agendar cita, visitar show room, etc.)
  - Si no conoces alguna información específica, ofrece canalizarlo con un especialista
  - Evita negaciones ("no tenemos", "no podemos"); usa siempre enfoques positivos
  
  INFORMACIÓN CONTEXTUAL SOBRE CUMBRES DEL SOL:
  ${context}
  
  PREGUNTA/COMENTARIO DEL CLIENTE:
  ${userMessage}
  
  Tu respuesta (como Ana Martínez, asesora de Cumbres del Sol):`;
};

app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;
  const context = retrieveContext(userMessage);
  const promptPersonalizado = crearPromptPersonalizado(userMessage, context);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptPersonalizado }]
        }]
      })
    });
    
    const data = await response.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "¡Gracias por su interés en Cumbres del Sol! En este momento no puedo procesar su consulta. ¿Le gustaría que un asesor se comunique directamente con usted? Llámenos al +52 (81) 8345-6789.";
    
    res.json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ 
      reply: "Aprecio su interés en Cumbres del Sol. Parece que estamos experimentando una dificultad técnica momentánea. ¿Podría contactarnos al +52 (81) 8345-6789 o por WhatsApp? Estaré encantada de atenderle personalmente.",
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});