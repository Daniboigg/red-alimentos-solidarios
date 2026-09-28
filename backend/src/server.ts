import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { pool } from './config/database';

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

start();