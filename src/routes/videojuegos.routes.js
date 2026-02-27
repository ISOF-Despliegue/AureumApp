const express = require('express');
const router = express.Router();
const controller = require('../controllers/videojuegos.controller');

router.get('/', controller.obtenerVideojuegos);
router.get('/:id', controller.obtenerVideojuegoPorId);
router.post('/', controller.crearVideojuego);
router.put('/:id', controller.actualizarVideojuegoCompleto);
router.patch('/:id', controller.actualizarVideojuegoParcial);
router.delete('/:id', controller.eliminarVideojuego);

module.exports = router;