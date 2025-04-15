import json, os
from flask import request
from flask_restful import Resource
from ..modelo_respuestas import ModeloRespuesta


class Pregunta(Resource):
    def __init__(self):
        self.location_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

        with open(os.path.join(self.location_path,'Files','configs.json'), "r") as file:
            config = json.load(file)
        self.modelo = ModeloRespuesta(config)

    def post(self):
        try:
            data = request.get_json(force=True)
            pregunta = data.get('pregunta', None)

            if not pregunta:
                return {"status": "error", "mensaje": "No se recibió ninguna pregunta"}, 400

            # Usamos el modelo real
            respuesta = self.modelo.procesar_pregunta(pregunta)

            resultado = {
                "pregunta": pregunta,
                "respuesta": respuesta
            }
            
            return {"status": "ok", "mensaje": "Respuesta enviada",'resultados':resultado}, 201

        except Exception as e:
            return {"status": "error", "mensaje": str(e)}, 500


