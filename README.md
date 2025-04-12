# Documentación del Docker para Aplicación Flask con Gemini API

Esta documentación detalla la configuración, uso y funcionalidades del contenedor Docker para una aplicación Flask que utiliza la API de Gemini para procesar preguntas y generar respuestas contextuales.

## Contenido
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Dockerfile Explicado](#dockerfile-explicado)
4. [Requisitos](#requisitos)
5. [Construcción de la Imagen](#construcción-de-la-imagen)
6. [Ejecución del Contenedor](#ejecución-del-contenedor)
7. [API Endpoints](#api-endpoints)
8. [Funcionamiento Interno](#funcionamiento-interno)
9. [Configuración Dinámica](#configuración-dinámica)
10. [Solución de Problemas](#solución-de-problemas)

## Descripción General

Esta aplicación implementa un servicio de procesamiento de preguntas utilizando la API de Gemini para generar respuestas. La aplicación carga configuraciones dinámicamente desde un servicio externo, incluyendo tablas de contexto que se utilizan para proporcionar información relevante a la IA al formular respuestas.

## Estructura del Proyecto

```
/
├── app.py                 # Punto de entrada principal y configuración de Flask
├── endpointC.py           # Definición del endpoint REST para procesar preguntas
├── modelo_respuestas.py   # Lógica de interacción con la API de Gemini
├── configs.json           # Archivo de configuración generado dinámicamente
├── Dockerfile             # Definición del contenedor Docker
└── requirements.txt       # Dependencias de Python
```

## Dockerfile Explicado

```dockerfile
FROM python:3.9-slim                  # Imagen base ligera con Python 3.9

WORKDIR /app                          # Directorio de trabajo dentro del contenedor

# Instalar dependencias primero (estrategia de caché para builds más rápidos)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar archivos de la aplicación
COPY app.py .
COPY endpointC.py .
COPY modelo_respuestas.py .

# Inicializar archivo de configuración vacío
RUN echo "{}" > configs.json

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["python", "app.py"]
```

## Requisitos

- Docker instalado en el sistema anfitrión
- Acceso a internet para descargar la imagen base y las dependencias
- Conectividad con el servicio externo en `https://cedrus-database.onrender.com`
- Clave API de Gemini válida (obtenida dinámicamente del servicio externo)

## Construcción de la Imagen

Para construir la imagen Docker:

```bash
docker build -t flask-gemini-app .
```

Opciones adicionales:
- Usar `--no-cache` para forzar una construcción limpia
- Usar `--build-arg` si necesitas agregar variables en tiempo de construcción

## Ejecución del Contenedor

Ejecución básica:

```bash
docker run -p 3000:3000 flask-gemini-app
```

Opciones avanzadas:
```bash
# Ejecutar en modo desconectado (background)
docker run -d -p 3000:3000 --name gemini-service flask-gemini-app

# Verificar logs 
docker logs gemini-service

# Detener el contenedor
docker stop gemini-service
```

## API Endpoints

La aplicación expone el siguiente endpoint REST:

### POST /pregunta
Procesa una pregunta y devuelve una respuesta generada por Gemini.

**Ejemplo de solicitud:**
```json
{
  "pregunta": "¿Cuál es el horario de atención?"
}
```

**Ejemplo de respuesta:**
```json
{
  "status": "ok",
  "mensaje": "Respuesta enviada",
  "resultados": {
    "pregunta": "¿Cuál es el horario de atención?",
    "respuesta": "El horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM."
  }
}
```

## Funcionamiento Interno

1. Al iniciar, la aplicación intenta obtener configuraciones del servicio externo (`https://cedrus-database.onrender.com/web/registers`)
2. Estas configuraciones incluyen:
   - Tablas de contexto para consultas específicas
   - Clave API para Gemini
   - Prompt predeterminado para mejorar las respuestas
3. Cuando se recibe una pregunta:
   - Se analiza si coincide con alguna tabla de contexto disponible
   - Se formatea un prompt adecuado con el contexto relevante
   - Se envía a Gemini API para generar una respuesta
   - Se devuelve la respuesta formateada

## Configuración Dinámica

La aplicación obtiene su configuración dinámicamente al iniciar:

1. Solicita datos a `https://cedrus-database.onrender.com/web/registers`
2. Almacena la configuración en el archivo `configs.json`
3. Esta configuración incluye:
   - `tablas`: Contexto estructurado para mejorar respuestas
   - `api_key`: Clave para autenticarse con Gemini API
   - `prompt`: Instrucciones base para el modelo de lenguaje

## Solución de Problemas

### Error de conexión al iniciar

Si la aplicación muestra errores al conectarse al servicio externo:
- Verifica que `https://cedrus-database.onrender.com` esté accesible
- Comprueba que el contenedor tenga conectividad a internet
- Intenta reiniciar el contenedor

### Errores de respuesta de Gemini

Si las respuestas de la API muestran errores:
- Verifica que la clave API sea válida
- Comprueba que el formato de las solicitudes sea correcto
- Revisa los límites de uso de la API de Gemini

### Logs del contenedor

Para acceder a los logs completos:
```bash
docker logs [nombre-del-contenedor]
```

Para seguir los logs en tiempo real:
```bash
docker logs -f [nombre-del-contenedor]
```