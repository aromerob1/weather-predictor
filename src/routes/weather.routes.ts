import express from 'express';
import { getWeatherByDay, getWeatherForNumberOfYears } from '../controllers/weather.controllers';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Weather Predictor API');
});

// Day routes
router.get('/day/:day', getWeatherByDay);

// Years routes
router.get('/years/:years', getWeatherForNumberOfYears);

export default router;
