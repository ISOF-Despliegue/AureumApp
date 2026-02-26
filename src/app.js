const express = require('express');
const resenasRoutes = require('./routes/resenas.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API funcionando correctamente.'
    });
});

app.use('/resenas', resenasRoutes);
app.use('/usuarios', usuariosRoutes);

module.exports = app;