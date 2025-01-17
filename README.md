# Weather Predictor

_A TypeScript-based system that predicts weather conditions using planetary alignments, including droughts, rainy periods, and optimal weather conditions for the next 10 years._

---

## Features
- Predicts **drought periods** when all planets align with the sun.
- Identifies **rainy periods**, including the day of maximum rainfall, using geometric calculations.
- Detects **optimal weather conditions** when planets align but not with the sun.
- Calculates **planetary positions** and uses the perimeter of the triangle formed by planets to predict rainfall.
- **Database integration** to optimize the speed of queries, ensuring efficient weather predictions even for large datasets.

---

## Technologies Used
- **TypeScript**: For strongly typed JavaScript development.
- **Node.js**: Backend runtime for building scalable applications.
- **SQLite**: Lightweight database for storing precomputed results to optimize query performance.
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

### 1. Weather Conditions for a Specific amount of Years
This endpoint provides weather conditions for a given amount of years.

#### Endpoint:
```
GET http://localhost:3000/api/weather/years/:years
```

Replace `:years` with the specific amount of years you want to query.

#### Example Request:
To get weather statistics for `10` years:
```
GET http://localhost:3000/api/weather/years/10
```

#### Example Response:
```json
{
  "droughtDays": 41,
  "rainyDays": 846,
  "mostRainyDay": 72,
  "optimalDays": 41
}
```

---

### 2. Weather Prediction for a Specific Day
This endpoint predicts the weather for a given day.

#### Endpoint:
```
GET http://localhost:3000/api/weather/day/:day
```

Replace `:day` with the specific day number you want to predict.

#### Example Request:
To predict the weather for day `1`:
```
GET http://localhost:3000/api/weather/day/1
```

#### Example Response:
```json
{
  "day": 1,
  "condition": "Sequía",
  "perimeter": 1500
}
```

---

## Database Integration
The system uses a SQLite database to store precomputed weather predictions and conditions. This approach ensures that queries are optimized and results are retrieved quickly, even when working with large datasets or predicting conditions for multiple years.

- **Database File**: The SQLite database (`weather.db`) is automatically created during the first run.
- **Optimization**: By storing and indexing predictions, the API avoids recalculating values on every request, significantly reducing processing time.

---

## Folder Structure
```plaintext
src/
├── config/           # Configuration files and constants
├── controllers/      # Handles API requests
├── database/         # Database config and management
├── interfaces/       # TypeScript interfaces and types
├── middlewares/      # Middleware functions
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
     Where `θ` is the angular displacement in degrees.

2. **Geometric Alignment**:
   - Drought: All planets and the sun are aligned.
   - Rainy: Perimeter of the triangle formed by planets is maximized.
   - Optimal: Planets align but not with the sun.

---

## Contact
- **Author**: Andrés Romero
- **Email**: [andresfeliperom@hotmail.com](mailto:andresfeliperom@hotmail.com)
- **GitHub**: [aromerob1](https://github.com/aromerob1)