export interface HeadacheStats {
  occurrences: number;
  meanDuration: number | null;
  mostCommonIntensity: string | number | null;
  meanRemedies: {
    name: string;
    mean_quantity: number;
  }[];
  mostCommonRemedyResult: string | null;
  mostCommonSide: string | null;
  mostCommonSideName: string | null;
  meanTemperature: number | null;
  meanApparentTemperature: number | null;
  meanUvIndex: number | null;
  meanShortwaveRadiation: number | null;
  meanMinTemperature: number | null;
  meanMaxTemperature: number | null;
  meanApparentMinTemperature: number | null;
  meanApparentMaxTemperature: number | null;
}

export interface Remedy {
  id: string;
  name: string;
}

export interface HeadacheRemedy {
  id: string;
  quantity: number;
  result: string;
  remedy: Remedy;
}

export interface Food {
  id: string;
  name: string;
}

export interface Drink {
  id: string;
  name: string;
}

export interface HeadacheLog {
  id: string;
  startTimestamp: string | Date;
  endTimestamp: string | Date;
  intensity: number;
  intensityName: string;
  side: string;
  pressureOrSqueezing: boolean;
  throbbingOrPulsating: boolean;
  stabbing: boolean;
  nauseaVomiting: boolean;
  lightSensitivity: boolean;
  noiseSensitivity: boolean;
  sleepRank: number;
  durationInSeconds: number;
  weather: {
    id: string;
    minTemperature: number;
    maxTemperature: number;
    apparentMinTemperature: number;
    apparentMaxTemperature: number;
    uvIndex: number;
    shortwaveRadiation: number;
    temperature: number;
    apparentTemperature: number;
  };
  remedies: HeadacheRemedy[];
  foods: Food[];
  drinks: Drink[];
}
