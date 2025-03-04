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

// Función para recuperar contexto basado en la nueva estructura
const retrieveContext = (userMessage) => {
    let context = "";

    // Buscar coincidencias en los valores de la base de datos
    if (userMessage.toLowerCase().includes("ubicación") || userMessage.toLowerCase().includes("dónde está")) {
        context += `Ubicación: ${cumbresDelSol.ubicacion.direccion}, ${cumbresDelSol.ubicacion.municipio}, ${cumbresDelSol.ubicacion.estado}.\n`;
    }
    
    if (userMessage.toLowerCase().includes("precio") || userMessage.toLowerCase().includes("costo")) {
        context += `Precio por m²: ${cumbresDelSol.terreno.precio_m2} ${cumbresDelSol.terreno.moneda}.\n`;
    }

    if (userMessage.toLowerCase().includes("amenidades") || userMessage.toLowerCase().includes("instalaciones")) {
        context += `Amenidades: ${cumbresDelSol.amenidades.join(', ')}.\n`;
    }

    if (userMessage.toLowerCase().includes("financiamiento") || userMessage.toLowerCase().includes("crédito")) {
        context += `Opciones de financiamiento: ${cumbresDelSol.plan_financiamiento.opciones.map(op => op.descripcion).join(', ')}.\n`;
        context += `Condiciones: ${cumbresDelSol.plan_financiamiento.condiciones.join(', ')}.\n`;
    }

    if (userMessage.toLowerCase().includes("contacto") || userMessage.toLowerCase().includes("teléfono")) {
        context += `Teléfono principal: ${cumbresDelSol.contacto.telefono_principal}.\n`;
        context += `WhatsApp: ${cumbresDelSol.contacto.whatsapp.join(', ')}.\n`;
    }

    // Si no encuentra contexto relevante, devuelve la descripción general
    return context || `Descripción: ${cumbresDelSol.descripcion}`;
};

app.post('/chatbot', async (req, res) => {
    const userMessage = req.body.message;
    const context = retrieveContext(userMessage); // Obtener contexto relevante
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${context}\n${userMessage}` }] }]
            })
        });

        const data = await response.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se recibió respuesta.";

        res.json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

