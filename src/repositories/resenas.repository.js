const fs = require('fs/promises');
const path = require('path');

const databaseDir = path.join(__dirname, '../../data');
const databasePath = path.join(databaseDir, 'dbResenas.json');

/**
 * Lee el archivo JSON de reseñas.
 * @returns {Promise<Array>} Lista de reseñas.
 */
const leerResenas = async () => {
    try {
        const data = await fs.readFile(databasePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

/**
 * Sobreescribe el archivo JSON con la nueva lista de reseñas.
 * @param {Array} data - Arreglo de reseñas a guardar.
 * @returns {Promise<void>} 
 */
const guardarResenas = async (data) => {
    await fs.mkdir(databaseDir, { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * Busca una reseña específica por su ID.
 * @param {number} id - ID de la reseña.
 * @returns {Promise<Object|undefined>} La reseña encontrada o undefined.
 */
const buscarResenaPorId = async (id) => {
    const resenas = await leerResenas();
    return resenas.find(r => r.id === id);
};

/**
 * Crea una nueva reseña, asignando un ID autoincremental.
 * @param {Object} datosResena - Objeto con nombreJuego, calificación y comentario.
 * @returns {Promise<Object>} La reseña creada con su ID asignado.
 */
const crearResena = async (datosResena) => {
    const resenas = await leerResenas();
    const nuevoId = resenas.length > 0 ? Math.max(...resenas.map(r => r.id)) + 1 : 1;

    const nuevaResena = { id: nuevoId, ...datosResena };
    resenas.push(nuevaResena);

    await guardarResenas(resenas);
    return nuevaResena;
};

/**
 * Actualiza una reseña existente por su ID.
 * @param {number} id - ID de la reseña a actualizar. 
 * @param {Object} datosActualizados - Datos a sobreescribir.
 * @returns {Promise<Object|null>} La reseña actualizada o null si no se encuentra.
 */
const actualizarResena = async (id, datosActualizados) => {
    const resenas = await leerResenas();
    const index = resenas.findIndex(r => r.id === id);

    if (index === -1) return null;

    resenas[index] = { ...resenas[index], ...datosActualizados, id };
    await guardarResenas(resenas);
    return resenas[index];
};

/**
 * Elimina una reseña por su ID.
 * @param {number} id - ID de la reseña a eliminar.
 * @returns {Promise<boolean>} True si se eliminó, false si no se encontró. 
 */
const eliminarResena = async (id) => {
    const resenas = await leerResenas();
    const index = resenas.findIndex(r => r.id === id);

    if (index === -1) return false;

    resenas.splice(index, 1);
    await guardarResenas(resenas);
    return true;
};

module.exports = {
    leerResenas,
    guardarResenas,
    buscarResenaPorId,
    crearResena,
    actualizarResena,
    eliminarResena
};