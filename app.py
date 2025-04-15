import sys
import requests
import json
from flask import Flask
from flask_restful import Api

from Scripts.Endpoints.pregunta import Pregunta
sys.stdout = sys.stderr

app = Flask(__name__)
api = Api(app)


# =============== IMPLEMENTAR CON ENDPOINT DAMARIS
try:
    configuraciones = {}

    url_docker_a = "https://cumbres-api.onrender.com"
    response_obj = requests.get(
        url_docker_a,
        data=json.dumps({"nombre_tabla": "proyectos"}),
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    print ("exito")
    # Paso 2: Verificamos el estado de la respuesta
    if response_obj.status_code == 200:
        # Paso 3: Ahora sí convertimos a JSON
        response = response_obj.json()
        configuraciones["tablas"] = response.get('tablas_contexto', None)
        configuraciones["api_key"] = response.get('api_key', None)
        configuraciones["prompt"] = response.get('prompt', None)
        with open ("configs.json", "w")as file:
            json.dump(configuraciones, file, indent=4)
        print(f"✅ Configuraciones iniciales guardadas: {configuraciones}")
    else:
        print(f"Error al obtener configuraciones: {response_obj.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Error de conexión con Docker A: {str(e)}")
# ===============


# Registramos el recurso usando una función factory
api.add_resource(Pregunta, '/pregunta')

