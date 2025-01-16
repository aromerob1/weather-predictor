import { Position } from '../interfaces/position.interface';
import { WeatherConditions } from '../interfaces/weather.interface';
import { PLANETS } from '../config/planets';

/**
 * The function `getPlanetPosition` calculates the x and y coordinates of a planet based on its
 * distance from a reference point and the angle at which it is positioned.
 * @param {number} distance - The `distance` parameter represents the distance of a planet from a
 * reference point (e.g., the sun) in space.
 * @param {number} angle - The `angle` parameter represents the angle at which the planet is located in
 * degrees from the reference point.
 * @returns The function `getPlanetPosition` returns an object with the properties `x` and `y`, which
 * represent the x and y coordinates of a planet's position based on the given distance and angle.
 */
export const getPlanetPosition = (distance: number, angle: number): Position => {
    const radians = (angle * Math.PI) / 180;
    const x = parseFloat((distance * Math.cos(radians)).toFixed(1));
    const y = parseFloat((distance * Math.sin(radians)).toFixed(1));
    return { x, y };
};

/**
 * Checks if three planets are aligned based on their positions with one decimal place precision.
 * @param {Position} position1 - Position of the first planet with coordinates (x, y)
 * @param {Position} position2 - Position 2 is the second position of a planet in a coordinate system.
 * It consists of an x-coordinate and a y-coordinate representing the position of the planet in space.
 * @param {Position} position3 - Position 3 is the position of the third planet in a solar system. It
 * consists of x and y coordinates representing the position of the planet in space.
 * @returns The function `arePlanetsAligned` returns a boolean value indicating whether the three
 * planets represented by the input positions are aligned in a straight line. If the determinant
 * calculated based on the positions is equal to 0, it means the planets are aligned, and the function
 * returns `true`. Otherwise, it returns `false`.
 */
export const arePlanetsAligned = (position1: Position, position2: Position, position3: Position): boolean => {
    const round = (value: number) => parseFloat(value.toFixed(1));

    // Use 1 decimal place as indicated in the considerations
    position1 = { x: round(position1.x), y: round(position1.y) };
    position2 = { x: round(position2.x), y: round(position2.y) };
    position3 = { x: round(position3.x), y: round(position3.y) };

    const determinant = position1.x * (position2.y - position3.y) + position2.x * (position3.y - position1.y) + position3.x * (position1.y - position2.y);
    return Math.abs(determinant) == 0;
};

/**
 * Returns the perimeter of a triangle based on the positions of its three vertices.
 * @param {Position} position1 - Position of the first vertex of the triangle with properties `x` and
 * `y`.
 * @param {Position} position2 - Position 2 is the second vertex of the triangle in a 2D plane. It is
 * represented by its x and y coordinates.
 * @param {Position} position3 - Position 3 is the third vertex of the triangle in a 2D plane. It is
 * represented by its x and y coordinates.
 * @returns The function `calculateTrianglePerimeter` returns the perimeter of a triangle formed by
 * three positions (vertices) provided as input.
 */
export const calculateTrianglePerimeter = (position1: Position, position2: Position, position3: Position): number => {
    const side1 = Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
    const side2 = Math.sqrt(Math.pow(position2.x - position3.x, 2) + Math.pow(position2.y - position3.y, 2));
    const side3 = Math.sqrt(Math.pow(position3.x - position1.x, 2) + Math.pow(position3.y - position1.y, 2));
    return side1 + side2 + side3;
}

/**
 * Returns the weather conditions for a given day based on
 * the positions of three planets.
 * @param {number} day - The `day` parameter in the `getWeatherPredictionByDay` function represents the
 * day for which you want to get the weather prediction. This parameter is used to calculate the
 * positions of the planets (Ferengi, Vulcano, Betazoide) based on their angular speeds and radii
 * @returns The function `getWeatherPredictionByDay` returns an object with the properties `day`,
 * `condition`, and possibly `perimeter`. The `day` property represents the day for which the weather
 * prediction is being made. The `condition` property indicates the weather condition for that day,
 * which can be 'Sequía', 'Presión y temperatura óptimas', or 'Lluvia'.
 */
export const getWeatherPredictionByDay = (day: number): WeatherConditions => {
    const ferengiPosition = getPlanetPosition(PLANETS.Ferengi.radius, PLANETS.Ferengi.angularSpeed * day);
    const vulcanoPosition = getPlanetPosition(PLANETS.Vulcano.radius, PLANETS.Vulcano.angularSpeed * day);
    const betazoidePosition = getPlanetPosition(PLANETS.Betazoide.radius, PLANETS.Betazoide.angularSpeed * day);

    if (arePlanetsAligned(ferengiPosition, vulcanoPosition, betazoidePosition)) {
        if (arePlanetsAligned(ferengiPosition, vulcanoPosition, { x: 0, y: 0 }) && arePlanetsAligned(vulcanoPosition, betazoidePosition, { x: 0, y: 0 })) {
            return { day, condition: 'Sequía' };
        }
        return { day, condition: 'Presión y temperatura óptimas' };
    }
    else {
        const perimeter = calculateTrianglePerimeter(ferengiPosition, vulcanoPosition, betazoidePosition);
        return { day, condition: 'Lluvia', perimeter };
    }
}

/**
 * Returns weather predictions for a specified number of years based on daily predictions.
 * @param {number} years - The `years` parameter in the `getWeatherPredictionsByNumberOfYears` function
 * represents the number of years for which you want to generate weather predictions. This parameter is
 * used to calculate the total number of days based on the assumption that each year has 365 days.
 * @returns An array of weather predictions for each day over the specified number of years.
 */
export const getWeatherPredictionsByNumberOfYears = (years: number): WeatherConditions[] => {
    const days = years * 365;
    const predictions = [];
    for (let day = 0; day < days; day++) {
        predictions.push(getWeatherPredictionByDay(day));
    }
    return predictions;
}