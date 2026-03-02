const repository = require('../repositories/resenas.repository');

/**
 * Helper para validar el cuerpo de una reseña.
 * @param {Object} body - El cuerpo de la petición. 
 * @param {boolean} esParcial - Si es true, permite campos omitidos.
 * @returns {string|null} - Un mensaje de error si la validación falla, o null si es válida.
 */
const validarDatosResena = (body, esParcial = false) => {
    const { nombreJuego, calificacion, comentario } = body;

    if (!esParcial || nombreJuego !== undefined) {
        if (!nombreJuego || typeof nombreJuego !== 'string' || nombreJuego.trim() === '') {
            return 'El nombre del juego es obligatorio y debe ser texto válido.';
        }
    }
    if (!esParcial || calificacion !== undefined) {
        if (typeof calificacion !== 'number' || calificacion < 1 || calificacion > 10) {
            return 'La calificación es obligatoria y debe ser un número entre 1 y 10.';
        }
    }
    if (!esParcial || comentario !== undefined) {
        if (!comentario || typeof comentario !== 'string' || comentario.trim() === '') {
            return 'El comentario es obligatorio y debe ser texto válido.';
        }
    }
    return null;
};

/**
 * Procesa la solicitud para consultar el listado completo de reseñas registradas.
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} 200 con el arreglo de reseñas, o 500 en caso de fallo interno.
 */
const obtenerResenas = async (req, res) => {
    try {
        const resenas = await repository.leerResenas();
        res.status(200).json(resenas);
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ error: 'Error al obtener reseñas' });
    }
};

/**
 * Procesa la creación de una nueva reseña en el sistema.
 * Verifica que el cuerpo de la petición contenga todos los campos obligatorios
 * antes de solicitar al repositorio que la guarde.
 * @param {Object} req - Petición de Express. Se espera {nombreJuego, calificacion, comentario} en req.body.
 * @param {Object} res - Respuesta de Express.
 * @returns {Promise<void>} 201 con el objeto creado, 400 si fallan las validaciones, o 500.
 */
const crearResena = async (req, res) => {
    try {
        const errorValidacion = validarDatosResena(req.body);
        if (errorValidacion) {
            return res.status(400).json({ error: errorValidacion });
        }

        const { nombreJuego, calificacion, comentario } = req.body;
        const nuevaResena = await repository.crearResena({
            nombreJuego: nombreJuego.trim(),
            calificacion,
            comentario: comentario.trim()
        });
        res.status(201).json(nuevaResena);
    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ error: 'Error al crear reseña' });
    }
};

/**
 * Sustituye por completo los datos de una reseña existente.
 * Valida que el ID proporcionado en la URL sea válido y que el cuerpo contenga
 * la información completa para sobreescribir el registro.
 * @param {Object} req - Petición de Express. Se espera req.params.id y el payload completo en req.body.
 * @param {Object} res - Respuesta de Express.
 * @returns {Promise<void>} 200 con la reseña actualizada, 400, 404 o 500.
 */
const actualizarResenaCompleta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID de reseña inválido' });
        }

        const errorValidacion = validarDatosResena(req.body);
        if (errorValidacion) {
            return res.status(400).json({ error: errorValidacion });
        }

        const resenaActualizada = await repository.actualizarResena(id, {
            nombreJuego: req.body.nombreJuego.trim(),
            calificacion: req.body.calificacion,
            comentario: req.body.comentario.trim()
        });

        if (!resenaActualizada) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.status(200).json(resenaActualizada);
    } catch (error) {
        console.error('Error al actualizar reseña:', error);
        res.status(500).json({ error: 'Error al actualizar reseña' });
    }
};

/**
 * Modifica parcialmente los datos de una reseña existente.
 * @param {Object} req - Petición de Express. Se espera req.params.id y uno o más campos en req.body.
 * @param {Object} res - Respuesta de Express.
 * @returns {Promise<void>} 200 con los datos actualizados, 400 si fallan las validaciones, 404 si no se encuentra la reseña o 500 en caso de error interno.
 */
const actualizarResenaParcial = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID de reseña inválido' });
        }

        const errorValidacion = validarDatosResena(req.body, true);
        if (errorValidacion) {
            return res.status(400).json({ error: errorValidacion });
        }

        const datosLimpios = {};
        if (req.body.nombreJuego) datosLimpios.nombreJuego = req.body.nombreJuego.trim();
        if (req.body.calificacion) datosLimpios.calificacion = req.body.calificacion;
        if (req.body.comentario) datosLimpios.comentario = req.body.comentario.trim();

        const resenaActualizada = await repository.actualizarResena(id, datosLimpios);

        if (!resenaActualizada) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.status(200).json(resenaActualizada);
    } catch (error) {
        console.error('Error al actualizar reseña:', error);
        res.status(500).json({ error: 'Error al actualizar reseña' });
    }
};

/**
 * Elimina una reseña del sistema de forma permanente.
 * Verifica la existencia del recurso mediante su ID antes de solicitar su eliminación
 * a la capa de datos.
 * * @param {Object} req - Petición de Express. Se requiere req.params.id.
 * @param {Object} res - Respuesta de Express.
 * @returns {Promise<void>} 204 si la eliminación es exitosa, 400, 404 o 500.
 */
const eliminarResena = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID de reseña inválido' });
        }

        const fueEliminada = await repository.eliminarResena(id);
        if (!fueEliminada) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar reseña:', error);
        res.status(500).json({ error: 'Error al eliminar reseña' });
    }
};

module.exports = {
    obtenerResenas,
    crearResena,
    actualizarResenaCompleta,
    actualizarResenaParcial,
    eliminarResena
};