import requests

class ModeloRespuesta:
    def __init__(self, configuraciones):
        self.api_key = configuraciones.get('api_key')
        self.prompt = configuraciones.get('prompt', 'Responde de forma clara y concisa')
        self.tablas_contexto = configuraciones.get('tablas', [])  # Lista de diccionarios
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        self.headers = {
            "Content-Type": "application/json"
        }

    def procesar_pregunta(self, pregunta):
        # Buscar si alguna palabra en la pregunta coincide con una tabla
        tabla_relacionada = self.buscar_tabla_relacionada(pregunta)

        if tabla_relacionada:
            contexto = self.formatear_tabla(tabla_relacionada)
            partes = [
                {"text": f"{self.prompt}\n\nContexto:\n{contexto}"},
                {"text": f"Pregunta:\n{pregunta}"}
            ]
        else:
            partes = [
                {"text": self.prompt},
                {"text": f"Pregunta:\n{pregunta}"}
            ]

        # Armar el cuerpo del request
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": partes
                }
            ]
        }

        # Enviar request a Gemini
        respuesta = self.enviar_a_gemini(payload)
        return respuesta

    def buscar_tabla_relacionada(self, pregunta):
        palabras = pregunta.lower().split()
        for tabla in self.tablas_contexto:
            if any(nombre.lower() in palabras for nombre in tabla.get('nombres', [])):
                return tabla
        return None

    def formatear_tabla(self, tabla):
        # Asume que cada tabla es un diccionario con un nombre y una lista de filas (puede ajustarse según tu formato)
        nombre = tabla.get('nombre', 'Tabla')
        filas = tabla.get('filas', [])
        encabezado = tabla.get('encabezado', [])
        contexto = f"{nombre}:\n"

        if encabezado:
            contexto += " | ".join(encabezado) + "\n"

        for fila in filas:
            contexto += " | ".join(map(str, fila)) + "\n"
        return contexto

    def enviar_a_gemini(self, data):
        try:
            response = requests.post(self.url, json=data, headers=self.headers)
            if response.status_code == 200:
                result = response.json()
                return result['candidates'][0]['content']['parts'][0]['text']
            else:
                return f"[Error Gemini] {response.status_code}: {response.text}"
        except Exception as e:
            return f"[Error al conectar con Gemini]: {str(e)}"

