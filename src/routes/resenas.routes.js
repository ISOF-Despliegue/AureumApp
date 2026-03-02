const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenas.controller');

/**
 * @route GET /resenas
 * @desc Obtiene todas las reseñas registradas.
 */
router.get('/', resenasController.obtenerResenas);

/**
 * @route POST /resenas
 * @desc Crea una nueva reseña.
 * @body { nombreJuego, calificacion, comentario }
 */
router.post('/', resenasController.crearResena);

/**
 * @route PUT /resenas/:id
 * @desc Actualiza todos los datos de una reseña existente.
 * @body { nombreJuego, calificacion, comentario }
 */
router.put('/:id', resenasController.actualizarResenaCompleta);

/**
 * @route PATCH /resenas/:id
 * @desc Actualiza parcialmente una reseña existente.
 * @body { nombreJuego?, calificacion?, comentario? }
 */
router.patch('/:id', resenasController.actualizarResenaParcial);

/**
 * @route DELETE /resenas/:id
 * @desc Elimina una reseña por su ID.
 */
router.delete('/:id', resenasController.eliminarResena);

module.exports = router;