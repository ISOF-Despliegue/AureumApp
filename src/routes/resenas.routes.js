const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenas.controller');

router.get('/', resenasController.obtenerResenas);
router.post('/', resenasController.crearResena);
router.put('/:id', resenasController.actualizarResenaCompleta);
router.patch('/:id', resenasController.actualizarResenaParcial);
router.delete('/:id', resenasController.eliminarResena);

module.exports = router;