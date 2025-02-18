# Equipo-de-Asistente-Virtual
Damaris Dzul, Alan Valbuena.

### Pasos para subir a mi rama
- Iniciar sesion en git desde la terminal
- Crear / Moverte a la rama deseada (git checkout -b [nombre_rama]: '-b' solo para creacion)
- Crear archivos / Modificar archivos
- Hacer stage de archivos (git add ./[nombre_archivo])
- Hacer commit de archivos en stage (git commit -m "[comentario_commit]")
- Hacer publicacion en repo (git push origin [nombre_rama])

### Pasos para subir de una rama a otra
- Publicar cambios en rama origen
- Cambiar a rama final (git checkout [nombre_rama_destino])
- Traer ultimos cambios de repo (git pull origin [nombre_rama_destino])
- Hacer fetch de cambios de rama original (git fetch origin [nombre_rama_origen])
- Hacer stage de nuevos cambios (git checkout origin/[nombre_rama_origen] -- [nombre_archivos])
- Hacer commit de nuevos cambios (git commit -m "[comentario]")
- Publicar cambios (git push)