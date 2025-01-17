import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// Initializes the database
const initializeDB = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    // Path to the database file
    const dbPath = path.resolve(__dirname, 'weather.db');
  
    // Open the database or create it if it does not exist
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  
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

// Export the function to get the database instance
let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const getDB = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
  if (!dbInstance) {
    dbInstance = await initializeDB();
  }
  return dbInstance;
};