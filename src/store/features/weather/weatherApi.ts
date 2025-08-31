import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { City, CitySuggestion } from "@/types/city.types";
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
      query: (cityName) =>
        `${DATA}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`,
      transformResponse: (res: OpenWeatherResponse): City => ({
        id: res.id,
        name: res.name,
        temp: Math.round(res.main.temp),
        condition: res.weather[0].description,
        icon: res.weather[0].icon,
        humidity: res.main.humidity,
        windSpeed: res.wind.speed,
        pressure: res.main.pressure,
      }),
    }),

    getCityHourlyForecast: builder.query<HourlyForecastResponse, string>({
      query: (cityName) =>
        `${DATA}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`,
    }),

    searchCities: builder.query<{ name: string; state: string }[], string>({
      query: (cityName) =>
        `${GEO}/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`,
      transformResponse: (res: CitySuggestion[]) => {
        const seen = new Set<string>();
        return res
          .map((c) => ({
            name: c.name,
            state: c.state,
          }))
          .filter((c) => {
            const key = `${c.name}, ${c.state}`;
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
