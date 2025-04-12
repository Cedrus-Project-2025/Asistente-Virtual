# ========== Comando para crear y levantar docker
# clear; docker build -t cedrus-chat .; docker run --name CedrusChat -p 3000:3000 cedrus-chat
# ========== 

FROM python:3.13-alpine

WORKDIR /app

# Copiar los archivos de requirements primero para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos de la aplicación
COPY . .

# Crear un archivo configs.json vacío que será llenado en tiempo de ejecución
RUN echo "{}" > configs.json

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["python", "app.py"]