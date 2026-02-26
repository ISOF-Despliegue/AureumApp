const repository = require('../repositories/usuarios.repository');

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await repository.leerUsuarios();
        res.status(200).json(usuarios);
    }
    catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error interno al obtener los usuarios' });
    }   
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre es obligatorio.' });
        }
        if (!contraseña || contraseña.trim() === '') {
            return res.status(400).json({ error: 'La contraseña es obligatoria.' });
        }

        const usuarios = await repository.leerUsuarios();
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

        const nuevoUsuario = {
            id: nuevoId,
            nombre: nombre.trim(),
            contraseña: contraseña.trim(),
            activo: true
        };

        usuarios.push(nuevoUsuario);
        await repository.guardarUsuarios(usuarios);
        res.status(201).json(nuevoUsuario);
    }
    catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error interno al crear el usuario' });
    }
}

const cambiarContrasena = async (req, res) => {
    try {
        const { nombre, nuevaContraseña } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre es obligatorio.' });
        }

        if (!nuevaContraseña || nuevaContraseña.trim() === '') {
            return res.status(400).json({ error: 'La nueva contraseña es obligatoria.' });
        }

        const usuarios = await repository.leerUsuarios();
        const usuarioIndex = usuarios.findIndex(u => u.nombre === nombre.trim());

        if (usuarioIndex === -1) {
            return res.status(404).json({ error: 'No se encontró un usuario con ese nombre.' });
        }

        usuarios[usuarioIndex].contraseña = nuevaContraseña.trim();
        await repository.guardarUsuarios(usuarios);
        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    }
    catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error interno al cambiar la contraseña' });
    }
}

const eliminarUsuario = async (req, res) => {
    try {
        const { nombre } = req.body;
        
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'Debe ingresar un nombre de usuario a eliminar.' });
        }

        const usuarios = await repository.leerUsuarios();
        const usuarioIndex = usuarios.findIndex(u => u.nombre === nombre.trim());

        if (usuarioIndex === -1) {
            return res.status(404).json({ error: 'No se encontró un usuario con ese nombre.' });
        }
        
        await repository.eliminarUsuario(nombre.trim());
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });

    }
    catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error interno al eliminar el usuario' });
    }

}

const suspenderUsuario = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ error: 'Debe ingresar un nombre de usuario a suspender.' });
        }

        const usuarios = await repository.leerUsuarios();
        const usuarioIndex = usuarios.findIndex(u => u.nombre === nombre.trim());

        if (usuarioIndex === -1) {
            return res.status(404).json({ error: 'No se encontró un usuario con ese nombre.' });
        }

        usuarios[usuarioIndex].activo = false;
        await repository.guardarUsuarios(usuarios);
        res.status(200).json({ message: 'Usuario suspendido correctamente.' });
    }
    catch (error) {
        console.error('Error al suspender el usuario:', error);
        res.status(500).json({ error: 'Error interno al suspender el usuario' });
    }
}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    cambiarContrasena,
    eliminarUsuario,
    suspenderUsuario
};