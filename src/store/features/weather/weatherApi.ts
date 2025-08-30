import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { City, CitySuggestion, CitySuggestionResponse } from "@/types/city.types";
import type { HourlyForecastResponse, OpenWeatherResponse } from "@/types/weather.types";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_URL;
const DATA = "data/2.5";
const GEO = "geo/1.0";

const fetchFn = typeof fetch !== "undefined" ? fetch : () => Promise.resolve(new Response());

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, fetchFn }),
  endpoints: (builder) => ({
    getCityWeather: builder.query<City, string>({
      query: (cityName: string) => `${DATA}/weather?q=${cityName}&appid=${API_KEY}&units=metric`,
      transformResponse: (response: OpenWeatherResponse): City => ({
        id: response.id,
        name: response.name,
        temp: Math.round(response.main.temp),
        condition: response.weather[0].description,
        icon: response.weather[0].icon,
        humidity: response.main.humidity,
        windSpeed: response.wind.speed,
        pressure: response.main.pressure,
      }),
    }),
    getCityHourlyForecast: builder.query<HourlyForecastResponse, string>({
      query: (cityName) => `${DATA}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`,
    }),
    searchCities: builder.query<CitySuggestionResponse[], string>({
      query: (cityName) => `${GEO}/direct?q=${cityName}&limit=5&appid=${API_KEY}`,
      transformResponse: (response: CitySuggestion[]): CitySuggestionResponse[] => {
        const seen = new Set<string>();
        return response
          .map((city) => ({
            name: city.name,
            country: city.country,
          }))
          .filter((city) => {
            const key = `${city.name},${city.country}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
      },
    }),
  }),
});

export const {
  useGetCityWeatherQuery,
  useLazyGetCityWeatherQuery,
  useGetCityHourlyForecastQuery,
  useLazyGetCityHourlyForecastQuery,
  useLazySearchCitiesQuery,
} = weatherApi;
