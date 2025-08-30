import { renderHook, act, waitFor } from "@testing-library/react";
import { useCities } from "./useCities";
import type { City } from "@/types/city.types";
import "@testing-library/jest-dom";

const mockTrigger = jest.fn();

jest.mock("@/store/features", () => ({
  useLazyGetCityWeatherQuery: () => [mockTrigger],
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("useCities hook", () => {
  const mockCity: City = {
    id: 1,
    name: "Kyiv",
    temp: 20,
    condition: "clear sky",
    icon: "01d",
    humidity: 50,
    windSpeed: 3,
    pressure: 1012,
  };

  it("initial state is correct", async () => {
    const { result } = renderHook(() => useCities());
    await waitFor(() => expect(result.current.isLoadingInitial).toBe(false));

    expect(result.current.cities).toEqual([]);
    expect(result.current.loadingCityId).toBeNull();
  });

  it("loads cities from localStorage on mount", async () => {
    localStorage.setItem("cities", JSON.stringify(["Kyiv"]));
    mockTrigger.mockReturnValue({ unwrap: () => Promise.resolve(mockCity) });

    const { result } = renderHook(() => useCities());

    await waitFor(() => {
      expect(result.current.cities).toEqual([mockCity]);
    });

    expect(mockTrigger).toHaveBeenCalledWith("Kyiv");
    expect(result.current.cities).toEqual([mockCity]);
    expect(result.current.isLoadingInitial).toBe(false);
  });

  it("addCity adds a city if not exists", () => {
    const { result } = renderHook(() => useCities());
    act(() => {
      result.current.addCity(mockCity);
    });
    expect(result.current.cities).toEqual([mockCity]);
  });

  it("addCity does not add duplicate city", () => {
    const { result } = renderHook(() => useCities());
    act(() => {
      result.current.addCity(mockCity);
      result.current.addCity(mockCity);
    });
    expect(result.current.cities.length).toBe(1);
  });

  it("deleteCity removes city by id", () => {
    const { result } = renderHook(() => useCities());
    act(() => {
      result.current.addCity(mockCity);
      result.current.deleteCity(1);
    });
    expect(result.current.cities).toEqual([]);
  });

  it("refreshCity updates city and sets loadingCityId", async () => {
    const updatedCity = { ...mockCity, temp: 25 };
    mockTrigger.mockReturnValue({ unwrap: () => Promise.resolve(updatedCity) });

    const { result } = renderHook(() => useCities());
    act(() => result.current.addCity(mockCity));

    await act(async () => {
      await result.current.refreshCity(1);
    });

    expect(result.current.cities[0].temp).toBe(25);
    expect(result.current.loadingCityId).toBeNull();
  });

  it("refreshCity does nothing if city not found", async () => {
    const { result } = renderHook(() => useCities());
    await act(async () => {
      await result.current.refreshCity(123);
    });
    expect(result.current.cities).toEqual([]);
  });
});
