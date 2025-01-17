import { getDB } from './index';
import { WeatherConditions } from '../interfaces/weather.interface';
import { Database } from 'sqlite';

// Función para insertar una predicción si no existe
export const insertWeatherConditionIfNotExists = async (condition: WeatherConditions): Promise<void> => {
  const db: Database = await getDB();

  const stmt = await db.prepare(`
    INSERT OR IGNORE INTO weather_conditions (day, condition, perimeter)
    VALUES (?, ?, ?);
  `);

  await stmt.run(condition.day, condition.condition, condition.perimeter);
  await stmt.finalize();
};

// Función para verificar si una predicción ya existe
export const weatherConditionExists = async (day: number): Promise<boolean> => {
  const db: Database = await getDB();

  const row = await db.get(`
    SELECT 1 FROM weather_conditions WHERE day = ?;
  `, day);

  return !!row;
};

// Función para obtener una predicción por día
export const getWeatherConditionByDay = async (day: number): Promise<WeatherConditions | null> => {
  const db: Database = await getDB();

  const row = await db.get(`
    SELECT * FROM weather_conditions WHERE day = ?;
  `, day);

  return row;
};
