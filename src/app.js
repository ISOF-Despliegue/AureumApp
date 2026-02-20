const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const reseñas = [];

// Health
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API funcionando correctamente"
    });
});

// Crear reseña
app.post("/reseñas", (req, res) => {
    const { nombreJuego, calificacion, comentario } = req.body;
    if (!nombreJuego || !calificacion || !comentario) {
        return res.status(400).json({
            error: "Todos los datos son obligatorios"
        });
    }

    const nuevaReseña = {
        id: reseñas.length + 1,
        nombreJuego,
        calificacion,
        comentario
    };
    reseñas.push(nuevaReseña);
    res.status(201).json(nuevaReseña);
});

// Ver reseñas
app.get("/reseñas", (req, res) => {
    res.json(reseñas);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});