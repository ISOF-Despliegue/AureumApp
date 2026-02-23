const repository = require('../repositories/resenas.repository');

const obtenerResenas = async (req, res) => {
    try {
        const resenas = await repository.leerResenas();
        res.json(resenas);
    } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        res.status(500).json({ error: 'Error interno al obtener las reseñas' });
    }
};

const crearResena = async (req, res) => {
    try {
        const { nombreJuego, calificacion, comentario } = req.body;
        
        if (!nombreJuego || typeof nombreJuego !== 'string' || nombreJuego.trim() === '') {
            return res.status(400).json({ error: 'El nombre del juego es obligatorio y debe ser texto.' });
        }

        if (calificacion === undefined || typeof calificacion !== 'number' || calificacion < 1 || calificacion > 10) {
            return res.status(400).json({ error: 'La calificación es obligatoria y debe ser un número entre 1 y 10.' });
        }

        if (!comentario || typeof comentario !== 'string' || comentario.trim() === '') {
            return res.status(400).json({ error: 'El comentario es obligatorio y debe ser texto.' });
        }

        const resenas = await repository.leerResenas();

        const nuevoId = resenas.length > 0 ? Math.max(...resenas.map(r => r.id)) + 1 : 1;

        const nuevaResena = {
            id: nuevoId,
            nombreJuego: nombreJuego.trim(),
            calificacion,
            comentario: comentario.trim()
        };
        resenas.push(nuevaResena);
        await repository.guardarResenas(resenas);
        res.status(201).json(nuevaResena);
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        res.status(500).json({ error: 'Error interno al crear la reseña' });
    }
};

const actualizarResenaCompleta = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombreJuego, calificacion, comentario } = req.body;

        if (!nombreJuego || typeof nombreJuego !== 'string' || nombreJuego.trim() === '') {
            return res.status(400).json({ error: 'El nombre del juego es obligatorio y debe ser texto.' });
        }

        if (calificacion === undefined || typeof calificacion !== 'number' || calificacion < 1 || calificacion > 10) {
            return res.status(400).json({ error: 'La calificación es obligatoria y debe ser un número entre 1 y 10.' });
        }

        if (!comentario || typeof comentario !== 'string' || comentario.trim() === '') {
            return res.status(400).json({ error: 'El comentario es obligatorio y debe ser texto.' });
        }

        const resenas = await repository.leerResenas();
        const index = resenas.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        resenas[index] = {
            id,
            nombreJuego: nombreJuego.trim(),
            calificacion,
            comentario: comentario.trim()
        };
        await repository.guardarResenas(resenas);
        res.status(200).json(resenas[index]);
    } catch (error) {
        console.error('Error al actualizar la reseña:', error);
        res.status(500).json({ error: 'Error interno al actualizar la reseña' });
    }
};

const actualizarResenaParcial = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const cuerpo = req.body;

        const resenas = await repository.leerResenas();
        const index = resenas.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        const resenaActualizada = { ...resenas[index] };
        if (cuerpo.nombreJuego !== undefined) {
            if (typeof cuerpo.nombreJuego !== 'string' || cuerpo.nombreJuego.trim() === '') {
                return res.status(400).json({ error: 'El nombre del juego debe ser texto válido.' });
            }
            resenaActualizada.nombreJuego = cuerpo.nombreJuego.trim();
        }

        if (cuerpo.calificacion !== undefined) {
            if (typeof cuerpo.calificacion !== 'number' || cuerpo.calificacion < 1 || cuerpo.calificacion > 10) {
                return res.status(400).json({ error: 'La calificación debe ser un número entre 1 y 10.' });
            }
            resenaActualizada.calificacion = cuerpo.calificacion;
        }

        if (cuerpo.comentario !== undefined) {
            if (typeof cuerpo.comentario !== 'string' || cuerpo.comentario.trim() === '') {
                return res.status(400).json({ error: 'El comentario debe ser texto válido.' });
            }
            resenaActualizada.comentario = cuerpo.comentario.trim();
        }

        resenas[index] = resenaActualizada;
        await repository.guardarResenas(resenas);
        res.status(200).json(resenaActualizada);
    } catch (error) {
        console.error('Error al actualizar la reseña:', error);
        res.status(500).json({ error: 'Error interno al actualizar la reseña' });
    }
};

const eliminarResena = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resenas = await repository.leerResenas();
        const index = resenas.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        resenas.splice(index, 1);
        await repository.guardarResenas(resenas);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        res.status(500).json({ error: 'Error interno al eliminar la reseña' });
    }
};

module.exports = {
    obtenerResenas,
    crearResena,
    actualizarResenaCompleta,
    actualizarResenaParcial,
    eliminarResena
};