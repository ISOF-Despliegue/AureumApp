const fs = require('fs/promises');
const path = require('path');

const databaseDir = path.join(__dirname, '../../data');
const databasePath = path.join(databaseDir, 'dbVideojuegos.json');

const leerVideojuegos = async () => {
  try {
    const data = await fs.readFile(databasePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const guardarVideojuegos = async (data) => {
  await fs.mkdir(databaseDir, { recursive: true });
  await fs.writeFile(databasePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = {
  leerVideojuegos,
  guardarVideojuegos
};