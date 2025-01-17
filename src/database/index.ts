import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Función asíncrona para inicializar y conectar la base de datos
const initializeDB = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    // Ruta absoluta al archivo weather.db dentro de la carpeta database
    const dbPath = path.resolve(__dirname, 'weather.db');
  
    // Abre la base de datos (la crea si no existe)
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  
    // Crea la tabla weather_conditions si no existe
    await db.exec(`
      CREATE TABLE IF NOT EXISTS weather_conditions (
        day INTEGER PRIMARY KEY,
        condition TEXT NOT NULL,
        perimeter REAL DEFAULT NULL
      );
    `);
  
    console.log('DB initialized');
    return db;
  };

// Exporta una instancia de la base de datos para ser usada en otros módulos
let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const getDB = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
  if (!dbInstance) {
    dbInstance = await initializeDB();
  }
  return dbInstance;
};