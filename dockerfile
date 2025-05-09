# ========== Comando para crear y levantar docker
# clear; docker build -t permont-chat . && docker run -d --name PermontChat -p 504:504 permont-chat
# ========== 

FROM python:3.13-alpine

WORKDIR /app

# Copiar los archivos de requirements primero para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 504

# Comando para iniciar la aplicación
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:504", "app:app"]
