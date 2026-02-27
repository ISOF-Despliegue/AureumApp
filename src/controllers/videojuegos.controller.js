const repository = require('../repositories/videojuegos.repository');

const obtenerVideojuegos = async (req, res) => {
  try {
    const videojuegos = await repository.leerVideojuegos();
    return res.status(200).json(videojuegos);
  } catch (error) {
    console.error('Error al obtener videojuegos:', error);
    return res.status(500).json({ error: 'Error interno al obtener videojuegos' });
  }
};

const obtenerVideojuegoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Id inválido' });
    }

    const videojuegos = await repository.leerVideojuegos();
    const juego = videojuegos.find(v => v.id === id);

    if (!juego) return res.status(404).json({ error: 'Videojuego no encontrado' });

    return res.status(200).json(juego);
  } catch (error) {
    console.error('Error al obtener videojuego por id:', error);
    return res.status(500).json({ error: 'Error interno al obtener videojuego' });
  }
};

const crearVideojuego = async (req, res) => {
  try {
    const { nombre, genero, plataforma, anio } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio y debe ser texto.' });
    }

    const videojuegos = await repository.leerVideojuegos();

    
    const yaExiste = videojuegos.some(v => v.nombre.toLowerCase() === nombre.trim().toLowerCase());
    if (yaExiste) {
      return res.status(409).json({ error: 'Ese videojuego ya existe en el catálogo.' });
    }

    const nuevoId = videojuegos.length > 0 ? Math.max(...videojuegos.map(v => v.id)) + 1 : 1;

    const nuevo = {
      id: nuevoId,
      nombre: nombre.trim(),
      genero: (typeof genero === 'string') ? genero.trim() : '',
      plataforma: (typeof plataforma === 'string') ? plataforma.trim() : '',
      anio: (typeof anio === 'number') ? anio : null
    };

    videojuegos.push(nuevo);
    await repository.guardarVideojuegos(videojuegos);
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear videojuego:', error);
    return res.status(500).json({ error: 'Error interno al crear videojuego' });
  }
};

const actualizarVideojuegoCompleto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, genero, plataforma, anio } = req.body;

    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Id inválido' });
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio y debe ser texto.' });
    }

    const videojuegos = await repository.leerVideojuegos();
    const index = videojuegos.findIndex(v => v.id === id);
    if (index === -1) return res.status(404).json({ error: 'Videojuego no encontrado' });

    
    const duplicado = videojuegos.some(v => v.id !== id && v.nombre.toLowerCase() === nombre.trim().toLowerCase());
    if (duplicado) return res.status(409).json({ error: 'Ya existe otro juego con ese nombre.' });

    videojuegos[index] = {
      id,
      nombre: nombre.trim(),
      genero: (typeof genero === 'string') ? genero.trim() : '',
      plataforma: (typeof plataforma === 'string') ? plataforma.trim() : '',
      anio: (typeof anio === 'number') ? anio : null
    };

    await repository.guardarVideojuegos(videojuegos);
    return res.status(200).json(videojuegos[index]);
  } catch (error) {
    console.error('Error al actualizar videojuego:', error);
    return res.status(500).json({ error: 'Error interno al actualizar videojuego' });
  }
};

const actualizarVideojuegoParcial = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;

    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Id inválido' });

    const videojuegos = await repository.leerVideojuegos();
    const index = videojuegos.findIndex(v => v.id === id);
    if (index === -1) return res.status(404).json({ error: 'Videojuego no encontrado' });

    const actualizado = { ...videojuegos[index] };

    if (body.nombre !== undefined) {
      if (typeof body.nombre !== 'string' || body.nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre debe ser texto válido.' });
      }
      const duplicado = videojuegos.some(v => v.id !== id && v.nombre.toLowerCase() === body.nombre.trim().toLowerCase());
      if (duplicado) return res.status(409).json({ error: 'Ya existe otro juego con ese nombre.' });
      actualizado.nombre = body.nombre.trim();
    }

    if (body.genero !== undefined) {
      if (typeof body.genero !== 'string') return res.status(400).json({ error: 'El género debe ser texto.' });
      actualizado.genero = body.genero.trim();
    }

    if (body.plataforma !== undefined) {
      if (typeof body.plataforma !== 'string') return res.status(400).json({ error: 'La plataforma debe ser texto.' });
      actualizado.plataforma = body.plataforma.trim();
    }

    if (body.anio !== undefined) {
      if (typeof body.anio !== 'number') return res.status(400).json({ error: 'El año debe ser número.' });
      actualizado.anio = body.anio;
    }

    videojuegos[index] = actualizado;
    await repository.guardarVideojuegos(videojuegos);
    return res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar videojuego parcial:', error);
    return res.status(500).json({ error: 'Error interno al actualizar videojuego' });
  }
};

const eliminarVideojuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Id inválido' });

    const videojuegos = await repository.leerVideojuegos();
    const index = videojuegos.findIndex(v => v.id === id);

    if (index === -1) return res.status(404).json({ error: 'Videojuego no encontrado' });

    videojuegos.splice(index, 1);
    await repository.guardarVideojuegos(videojuegos);
    return res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar videojuego:', error);
    return res.status(500).json({ error: 'Error interno al eliminar videojuego' });
  }
};

module.exports = {
  obtenerVideojuegos,
  obtenerVideojuegoPorId,
  crearVideojuego,
  actualizarVideojuegoCompleto,
  actualizarVideojuegoParcial,
  eliminarVideojuego
};