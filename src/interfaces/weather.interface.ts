export interface WeatherConditions {
    day: number;
    condition: 'Sequía' | 'Presión y temperatura óptimas' | 'Lluvia' | 'Normalidad';
    perimeter?: number;
}

export interface WeatherYearsPredictions {
    rainyDays: number;
    droughtDays: number;
    optimalDays: number;
    mostRainyDay?: number;
}