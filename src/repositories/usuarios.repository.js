const fs = require('fs/promises');
const path = require('path');

const databaseDir = path.join(__dirname, '../../data');
const databasePath = path.join(databaseDir, 'dbUsuarios.json');

const leerUsuarios = async () => {
    try {
        const data = await fs.readFile(databasePath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const guardarUsuarios = async (data) => {
    await fs.mkdir(databaseDir, { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(data, null, 2), 'utf8');
};

const eliminarUsuario = async (nombre) => {
    const usuarios = await leerUsuarios();
    const usuariosFiltrados = usuarios.filter(u => u.nombre !== nombre.trim());
    await guardarUsuarios(usuariosFiltrados);
}

module.exports = {
    leerUsuarios,
    guardarUsuarios,
    eliminarUsuario
};