const express = require('express');
const cors = require('cors');
const resenasRoutes = require('./routes/resenas.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const videojuegosRoutes = require('./routes/videojuegos.routes');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5555");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API funcionando correctamente.'
    });
});

app.use('/resenas', resenasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/videojuegos', videojuegosRoutes);

module.exports = app;