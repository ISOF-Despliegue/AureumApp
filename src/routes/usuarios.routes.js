const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.obtenerUsuarios);
router.post('/', usuariosController.crearUsuario);
router.put('/', usuariosController.suspenderUsuario);
router.patch('/cambiarContrasena', usuariosController.cambiarContrasena);
router.delete('/', usuariosController.eliminarUsuario);

module.exports = router;