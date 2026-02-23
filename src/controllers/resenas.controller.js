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

};

const actualizarResenaParcial = async (req, res) => {

};

const eliminarResena = async (req, res) => {
    
};

module.exports = {
    obtenerResenas,
    crearResena,
    actualizarResenaCompleta,
    actualizarResenaParcial,
    eliminarResena
};