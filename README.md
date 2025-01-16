# Weather Predictor

_A TypeScript-based system that predicts weather conditions using planetary alignments, including droughts, rainy periods, and optimal weather conditions for the next 10 years._

---

## Features
- Predicts **drought periods** when all planets align with the sun.
- Identifies **rainy periods**, including the day of maximum rainfall, using geometric calculations.
- Detects **optimal weather conditions** when planets align but not with the sun.
- Calculates **planetary positions** and uses the perimeter of the triangle formed by planets to predict rainfall.

---

## Technologies Used
- **TypeScript**: For strongly typed JavaScript development.
- **Node.js**: Backend runtime for building scalable applications.
- **Git**: For version control.
- **Geometric principles**: To calculate alignments and areas.

---

## Installation
Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/aromerob1/weather-predictor.git
   cd weather-predictor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the project:
   ```bash
   npm start
   ```

---

## Usage
1. To predict the weather for a specific day:
   - Use the `getWeatherPredictionByDay(day)` function.
2. Example output:
   ```json
   {
     "day": 1,
     "condition": "Rainy",
     "perimeter": 1500
   }
   ```

---

## Folder Structure
```plaintext
src/
├── config/           # Configuration files and constants
├── controllers/      # Handles API requests
├── interfaces/       # TypeScript interfaces and types
├── middlewares/      # Middleware functions (if any)
├── routes/           # API routes
├── services/         # Business logic (weather prediction)
├── utils/            # Helper functions
```

---

## Key Concepts
1. **Planetary Positions**:
   - Calculated using radius, angular speed, and time (days).
   - Formula:
     ```math
     x = r \cdot \cos(\theta), \quad y = r \cdot \sin(\theta)
     ```
     Where \(\theta\) is the angular displacement in degrees.

2. **Geometric Alignment**:
   - Drought: All planets and the sun are aligned.
   - Rainy: Perimeter of the triangle formed by planets is maximized.
   - Optimal: Planets align but not with the sun.

---

## Contact
- **Author**: Andrés Romero
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **GitHub**: [aromerob1](https://github.com/aromerob1)
