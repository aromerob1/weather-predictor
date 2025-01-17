import { Request, Response } from "express";
import { getWeatherPredictionByDay, getWeatherPredictionsByNumberOfYears } from "../services/weather.service";

export const getWeatherByDay = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el día de los parámetros de la solicitud
    const day = parseInt(req.params.day, 10);

    if (isNaN(day) || day < 0) {
      res.status(400).json({ error: "Invalid day parameter" });
      return;
    }

    // Llamar al servicio para obtener la predicción
    const prediction = await getWeatherPredictionByDay(day);

    // Responder con el resultado
    res.status(200).json(prediction);
  } catch (error) {
    console.error("Error fetching weather prediction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWeatherForNumberOfYears = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtener el número de años de los parámetros de la solicitud
        const years = parseInt(req.params.years, 10);
    
        if (isNaN(years) || years < 0) {
        res.status(400).json({ error: "Invalid years parameter" });
        return;
        }
    
        // Llamar al servicio para obtener las predicciones
        const predictions = await getWeatherPredictionsByNumberOfYears(years);
    
        // Responder con el resultado
        res.status(200).json(predictions);
    } catch (error) {
        console.error("Error fetching weather predictions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    };
