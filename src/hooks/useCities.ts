"use client";

import { useEffect, useState } from "react";
import { useLazyGetCityWeatherQuery } from "@/store/features";

import type { City } from "@/types/city.types";

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [trigger] = useLazyGetCityWeatherQuery();
  const [loadingCityId, setLoadingCityId] = useState<number | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cities");
    if (saved) {
      const cityNames: string[] = JSON.parse(saved);

      Promise.all(
        cityNames.map(async (name) => {
          try {
            return await trigger(name).unwrap();
          } catch {
            console.warn(`City "${name}" not found or API error`);
            return null;
          }
        }),
      ).then((results) => {
        const validCities = results.filter((city): city is City => city !== null);

        setCities(validCities);
        setIsLoadingInitial(false);
      });
    } else {
      setIsLoadingInitial(false);
    }
  }, [trigger]);

  useEffect(() => {
    const names = cities.map((c) => c.name);
    localStorage.setItem("cities", JSON.stringify(names));
  }, [cities]);

  const addCity = (city: City) => {
    setCities((prev) => {
      if (prev.some((c) => c.id === city.id)) {
        return prev;
      }
      return [...prev, city];
    });
  };

  const deleteCity = (id: number) => {
    setCities((prev) => prev.filter((city) => city.id !== id));
  };

  const refreshCity = async (id: number) => {
    const city = cities.find((c) => c.id === id);
    if (!city) return;

    setLoadingCityId(id);
    try {
      const updatedCity = await trigger(city.name).unwrap();
      setCities((prev) => prev.map((c) => (c.id === id ? { ...updatedCity, id } : c)));
    } catch {
      console.error(`Failed to refresh city with id ${id}`);
    } finally {
      setLoadingCityId(null);
    }
  };

  return { cities, addCity, deleteCity, refreshCity, loadingCityId, isLoadingInitial };
};
