import sys
import requests
import json
import os
from flask import Flask
from flask_restful import Api
from dotenv import load_dotenv

load_dotenv()

from Scripts.Endpoints.pregunta import Pregunta
sys.stdout = sys.stderr

app = Flask(__name__)
api = Api(app)


# =============== IMPLEMENTAR CON ENDPOINT DAMARIS
try:
    configuraciones = {}
    
    url_docker_a = os.getenv("URL_CONFIGS", "/api/a/configs")
    response_obj = requests.get(
        url_docker_a,
        params={},
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    print ("exito")
    # Paso 2: Verificamos el estado de la respuesta
    if response_obj.status_code == 200:
        # Paso 3: Ahora sí convertimos a JSON
        response = response_obj.json()
        configuraciones["proyectos"] = response.get('tablas', None)
        configuraciones["api_key"]   = response.get('api_key', None)
        configuraciones["prompt"]    = response.get('prompt', None)
        
        ruta_de_origen = os.path.dirname(__file__)
        ruta_destino = os.path.join(ruta_de_origen, "Files", "configs.json")
        os.makedirs(os.path.dirname(ruta_destino), exist_ok=True)

        with open (ruta_destino, "w")as file:
            json.dump(configuraciones, file, indent=4)
        print(f"✅ Configuraciones iniciales guardadas: {configuraciones}")
    else:
        print(f"Error al obtener configuraciones: {response_obj.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Error de conexión con Docker A: {str(e)}")
# ===============


# Registramos el recurso usando una función factory
api.add_resource(Pregunta, '/pregunta')

