import { Position } from '../interfaces/position.interface';
import { WeatherConditions, WeatherYearsPredictions } from '../interfaces/weather.interface';
import { PLANETS } from '../config/planets';
import {
  insertWeatherConditionIfNotExists,
  getWeatherConditionByDay,
  weatherConditionExists,
} from '../database/weather.operations';

/**
 * Returns the position of a planet based on its distance and angular position.
 * @param {number} distance - The radial distance from the reference point (sun).
 * @param {number} angle - The angular position of the planet in degrees.
 * @returns {Position} An object with `x` and `y` properties representing the coordinates.
 */
export const getPlanetPosition = (distance: number, angle: number): Position => {
  const radians = (angle * Math.PI) / 180;

  // Round to 1 decimal place as recommended
  const x = parseFloat((distance * Math.cos(radians)).toFixed(1));
  const y = parseFloat((distance * Math.sin(radians)).toFixed(1));

  return { x, y };
};

/**
 * Determines whether the planets are aligned based on their positions.
 * @param {Position} position1 - The coordinates (`x`, `y`) of the first planet.
 * @param {Position} position2 - The coordinates (`x`, `y`) of the second planet.
 * @param {Position} position3 - The coordinates (`x`, `y`) of the third planet.
 * @returns {boolean} `true` if the planets are aligned within a specified tolerance, otherwise `false`.
 */
export const arePlanetsAligned = (
  position1: Position,
  position2: Position,
  position3: Position
): boolean => {
  const determinant =
    position1.x * (position2.y - position3.y) +
    position2.x * (position3.y - position1.y) +
    position3.x * (position1.y - position2.y);
  const tolerance = 42872.22;
  return Math.abs(determinant) < tolerance;
};

/**
 * Calculates the determinant/doubled area of the triangle formed by the three planets.
 * @param {Position} position1 - The coordinates (`x`, `y`) of the first planet.
 * @param {Position} position2 - The coordinates (`x`, `y`) of the second planet.
 * @param {Position} position3 - The coordinates (`x`, `y`) of the third planet.
 * @returns {number} The absolute value of the determinant, representing the area (scaled) of the triangle
 * formed by the three planets.
 */
export const getdeterminant = (
  position1: Position,
  position2: Position,
  position3: Position
): number => {
  return Math.abs(
    position1.x * (position2.y - position3.y) +
      position2.x * (position3.y - position1.y) +
      position3.x * (position1.y - position2.y)
  );
};

/**
 * Calculates the perimeter of the triangle given the positions of the three planets.
 * @param {Position} position1 - The coordinates (`x`, `y`) of the first planet of the triangle.
 * @param {Position} position2 - The coordinates (`x`, `y`) of the second planet of the triangle.
 * @param {Position} position3 - The coordinates (`x`, `y`) of the third planet of the triangle.
 * @returns {number} The perimeter of the triangle, calculated as the sum of the distances between the planets.
 */
export const calculateTrianglePerimeter = (
  position1: Position,
  position2: Position,
  position3: Position
): number => {
  const side1 = Math.sqrt(
    Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2)
  );
  const side2 = Math.sqrt(
    Math.pow(position2.x - position3.x, 2) + Math.pow(position2.y - position3.y, 2)
  );
  const side3 = Math.sqrt(
    Math.pow(position3.x - position1.x, 2) + Math.pow(position3.y - position1.y, 2)
  );
  return side1 + side2 + side3;
};

/**
 * Determines if the sun (at the origin `{x: 0, y: 0}`) is inside the triangle formed by the three planets.
 * @param {Position} position1 - The coordinates (`x`, `y`) of the first planet of the triangle.
 * @param {Position} position2 - The coordinates (`x`, `y`) of the second planet of the triangle.
 * @param {Position} position3 - The coordinates (`x`, `y`) of the third planet of the triangle.
 * @returns {boolean} `true` if the sun is inside the triangle; otherwise, `false`.
 */
export const isSunInsideTriangle = (
  position1: Position,
  position2: Position,
  position3: Position
): boolean => {
  const sunPosition = { x: 0, y: 0 };
  const triangleDoubledArea = getdeterminant(position1, position2, position3);
  const doubledArea1 = getdeterminant(sunPosition, position1, position2);
  const doubledArea2 = getdeterminant(sunPosition, position2, position3);
  const doubledArea3 = getdeterminant(sunPosition, position3, position1);
  return triangleDoubledArea === doubledArea1 + doubledArea2 + doubledArea3;
};

/**
 * Calculates the weather conditions for a given day based on the positions of the three planets.
 * @param {number} day - The day number for which the weather prediction is calculated.
 * @returns {Promise<WeatherConditions>} A promise that resolves to a `WeatherConditions` object containing:
 * - `day` (number): The day number.
 * - `condition` (string): The weather condition (`'Sequía'`, `'Presión y temperatura óptimas'`, `'Lluvia'`, or `'Normalidad'`).
 * - `perimeter` (number | undefined): The perimeter of the triangle formed by the planets, present only if the condition is `'Lluvia'`.
 */
export const getWeatherPredictionByDay = async (day: number): Promise<WeatherConditions> => {
  //Check if the day already exists in the database
  const dbDay: WeatherConditions | null = await getWeatherConditionByDay(day);
  if (dbDay) {
    console.log(`Day ${day} already exists in DB`);
    return { day, condition: dbDay.condition, perimeter: dbDay.perimeter };
  }

  const ferengiPosition = getPlanetPosition(
    PLANETS.Ferengi.radius,
    PLANETS.Ferengi.angularSpeed * day
  );
  const vulcanoPosition = getPlanetPosition(
    PLANETS.Vulcano.radius,
    PLANETS.Vulcano.angularSpeed * day
  );
  const betazoidePosition = getPlanetPosition(
    PLANETS.Betazoide.radius,
    PLANETS.Betazoide.angularSpeed * day
  );

  if (arePlanetsAligned(ferengiPosition, vulcanoPosition, betazoidePosition)) {
    if (
      arePlanetsAligned(ferengiPosition, vulcanoPosition, { x: 0, y: 0 }) &&
      arePlanetsAligned(vulcanoPosition, betazoidePosition, { x: 0, y: 0 }) &&
      arePlanetsAligned(betazoidePosition, ferengiPosition, { x: 0, y: 0 })
    ) {
      return { day, condition: 'Sequía' };
    }

    return { day, condition: 'Presión y temperatura óptimas' };
  } else {
    if (isSunInsideTriangle(ferengiPosition, vulcanoPosition, betazoidePosition)) {
      const perimeter = calculateTrianglePerimeter(
        ferengiPosition,
        vulcanoPosition,
        betazoidePosition
      );
      return { day, condition: 'Lluvia', perimeter };
    }
    return { day, condition: 'Normalidad' };
  }
};

/**
 * Calculates weather predictions for a specified number of years based on planetary positions and weather conditions for each day.
 * @param {number} years - The number of years for which weather predictions are calculated (assuming 365 days per year).
 * @returns {Promise<WeatherYearsPredictions>} A promise that resolves to an object containing:
 * - `droughtDays` (number): Total days with drought conditions.
 * - `rainyDays` (number): Total days with rainy conditions.
 * - `mostRainyDay` (number | undefined): The day with the highest rainfall (based on the largest triangle perimeter), or `undefined` if no rainy days exist.
 * - `optimalDays` (number): Total days with optimal conditions (e.g., pressure and temperature).
 */
export const getWeatherPredictionsByNumberOfYears = async (
  years: number
): Promise<WeatherYearsPredictions> => {
  const days = years * 365;
  let maxPerimeter = 0;
  let rainyDays = 0;
  let droughtDays = 0;
  let optimalDays = 0;
  let normalDays = 0;
  let mostRainyDay = undefined;

  let minDeterminant = 999999999999999;
  let maxDeterminant = 0;

  for (let day = 0; day < days; day++) {
    const prediction = await getWeatherPredictionByDay(day);
    const area = getdeterminant(
      getPlanetPosition(PLANETS.Ferengi.radius, PLANETS.Ferengi.angularSpeed * day),
      getPlanetPosition(PLANETS.Vulcano.radius, PLANETS.Vulcano.angularSpeed * day),
      getPlanetPosition(PLANETS.Betazoide.radius, PLANETS.Betazoide.angularSpeed * day)
    );
    if (area < minDeterminant && area !== 0) {
      minDeterminant = area;
    }
    if (area > maxDeterminant) {
      maxDeterminant = area;
    }
    if (prediction.condition === 'Lluvia' && prediction.perimeter) {
      if (prediction.perimeter > maxPerimeter) {
        maxPerimeter = prediction.perimeter;
        mostRainyDay = day;
      }
      rainyDays++;
    } else if (prediction.condition === 'Sequía') {
      droughtDays++;
    } else if (prediction.condition === 'Presión y temperatura óptimas') {
      optimalDays++;
    } else {
      normalDays++;
    }

    if (!(await weatherConditionExists(day))) {
      console.log('Creating prediction for day:', day);
      // Prepare the weather condition object
      const weatherCondition: WeatherConditions = {
        day: day,
        condition: prediction.condition,
        perimeter: prediction.perimeter,
      };

      // Insert the weather condition into the database
      try {
        await insertWeatherConditionIfNotExists(weatherCondition);
      } catch (error) {
        console.error(`Error al insertar la predicción del día ${day}:`, error);
      }
    }
    console.log(`Day ${day} already exists in DB`);
  }
  console.log('Min Determinant:', minDeterminant);
  console.log('Max Determinant:', maxDeterminant);
  return { droughtDays, rainyDays, mostRainyDay, optimalDays };
};
