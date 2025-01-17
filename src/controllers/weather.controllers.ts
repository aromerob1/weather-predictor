import { Request, Response } from "express";
import { getWeatherPredictionByDay, getWeatherPredictionsByNumberOfYears } from "../services/weather.service";

export const getWeatherByDay = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the day from the request parameters
    const day = parseInt(req.params.day, 10);

    if (isNaN(day) || day < 0) {
      res.status(400).json({ error: "Invalid day parameter" });
      return;
    }

    // Call the service to get the prediction
    const prediction = await getWeatherPredictionByDay(day);

    res.status(200).json(prediction);
  } catch (error) {
    console.error("Error fetching weather prediction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWeatherForNumberOfYears = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the years from the request parameters
        const years = parseInt(req.params.years, 10);
    
        if (isNaN(years) || years < 0) {
        res.status(400).json({ error: "Invalid years parameter" });
        return;
        }
    
        // Call the service to get the predictions
        const predictions = await getWeatherPredictionsByNumberOfYears(years);
    
        res.status(200).json(predictions);
    } catch (error) {
        console.error("Error fetching weather predictions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    };
