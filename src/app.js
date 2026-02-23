const express = require('express');
const resenasRoutes = require('./routes/resenas.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API funcionando correctamente.'
    });
});

app.use('/resenas', resenasRoutes);

module.exports = app;