export type City = {
  id: number;
  name: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
};

export type CitySuggestion = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

export type CitySuggestionResponse = {
  name: string;
  state: string;
};
