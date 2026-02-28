const express = require('express');
const cors = require('cors');
const resenasRoutes = require('./routes/resenas.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const videojuegosRoutes = require('./routes/videojuegos.routes');

const app = express();

app.use(cors());
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