# AureumApp - API REST

## Integrantes (IOException Team)
- Rodrigo Ivan Ahumada Rodríguez
- Abraham Cano Ramírez
- Mauricio Noriega Delgado

## Sobre el proyecto
AureumApp es una API RESTful desarrollada en Node.js y Express. Sirve como el backend para una plataforma de catálogo y reseñas de videojuegos.

La API permite gestionar operaciones CRUD para tres entidades principales:
- **`/videojuegos`**: Catálogo general de juegos.
- **`/usuarios`**: Gestión de usuarios de la plataforma.
- **`/resenas`**: Calificaciones y comentarios de los juegos.

## Entorno de desarrollo local

Si deseas correr el proyecto directamente en tu máquina, sigue estos pasos:

### Requisitos previos
- [Node.js](https://nodejs.org/) (versión 20 o superior).

### Instalación y ejecución
1. Clona el repositorio y navega a la carpeta del proyecto.
2. Instala las dependencias:
```bash
npm install
```
3. Crea un archivo .env e la raíz del proyecto con el puerto deseado (ej. PORT=3000).
4. Inicia el servidor:
```bash
npm start
```
5. La API estará disponible en `http://localhost:3000`.

## Despliegue con Docker
El proyecto está preparado para ser contenerizado, aislando sus dependencias y variables de entorno.

### Requisitos previos
- [Docker](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.

### 1. Construir la imagen
Asegúrate de estar en la raíz del directorio y ejecuta:
```bash
docker build -t aureum-api .
```

### 2. Ejecutar el contenedor
Levanta la API mapeando el puerto de tu host (ej. 4000) al puerto interno del contenedor (3000). Pasamos la variable de entorno PORT dinámicamente para no depender de un archivo .env local:
```bash
docker run -d -p 4000:3000 --name api-aureum -e PORT=3000 aureum-api
```

### 3. Pruebas rápidas de endpoints
Puedes verificar que el contenedor funciona correctamente llamando al endpoint salud o consultando el catálogo:

**Healt Check:**
```bash
curl http://localhost:4000/health
```

**Obtener lista de videojuegos:**
```bash
curl http://localhost:4000/videojuegos
```

**Obtener lista de usuarios:**
```bash
curl http://localhost:4000/usuarios
```

**Obtener lista de reseñas:**
```bash
curl http://localhost:4000/resenas
```