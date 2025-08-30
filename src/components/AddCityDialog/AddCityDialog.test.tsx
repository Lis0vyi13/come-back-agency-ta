import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCityDialog from "./AddCityDialog";
import * as api from "@/store/features";
import "@testing-library/jest-dom";

jest.mock("@/store/features");

describe("AddCityDialog", () => {
  const onAddMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    const getCityWeatherTriggerMock = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: 1,
        name: "Kyiv",
        temp: 21,
        condition: "clear sky",
        icon: "01d",
        humidity: 50,
        windSpeed: 3.5,
        pressure: 1012,
      }),
    });

    const searchCitiesTriggerMock = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue([
        { name: "Kyiv", country: "UA" },
        { name: "Kyiv", country: "US" },
      ]),
    });

    (api.useLazyGetCityWeatherQuery as jest.Mock).mockReturnValue([
      getCityWeatherTriggerMock,
      { isFetching: false },
    ]);

    (api.useLazySearchCitiesQuery as jest.Mock).mockReturnValue([
      searchCitiesTriggerMock,
      { data: [], isFetching: false },
    ]);
  });

  it("renders Add city button", () => {
    render(<AddCityDialog onAdd={onAddMock} />);
    expect(screen.getByText(/Add city/i)).toBeInTheDocument();
  });

  it("opens dialog when button is clicked", () => {
    render(<AddCityDialog onAdd={onAddMock} />);
    fireEvent.click(screen.getByText(/Add city/i));
    expect(screen.getByText(/New city/i)).toBeInTheDocument();
  });

  it("focuses input when dialog opens", async () => {
    render(<AddCityDialog onAdd={onAddMock} />);
    fireEvent.click(screen.getByText(/Add city/i));
    const input = screen.getByPlaceholderText(/Name of the city/i);
    await waitFor(() => {
      expect(document.activeElement).toBe(input);
    });
  });

  it("shows error when submitting empty input", async () => {
    render(<AddCityDialog onAdd={onAddMock} />);
    fireEvent.click(screen.getByText(/Add city/i));
    fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));
    expect(await screen.findByText(/Please enter a city name/i)).toBeInTheDocument();
  });

  it("calls onAdd when city is added", async () => {
    const triggerMock = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: 1,
        name: "Kyiv",
        temp: 21,
        condition: "clear sky",
        icon: "01d",
        humidity: 50,
        windSpeed: 3.5,
        pressure: 1012,
      }),
    });
    (api.useLazyGetCityWeatherQuery as jest.Mock).mockReturnValue([
      triggerMock,
      { isFetching: false },
    ]);

    render(<AddCityDialog onAdd={onAddMock} />);
    fireEvent.click(screen.getByText(/Add city/i));

    fireEvent.change(screen.getByPlaceholderText(/Name of the city/i), {
      target: { value: "Kyiv" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));

    await waitFor(() => {
      expect(triggerMock).toHaveBeenCalledWith("Kyiv");
      expect(onAddMock).toHaveBeenCalledWith(expect.objectContaining({ name: "Kyiv" }));
    });
  });

  it("shows loading indicators for cities and button", async () => {
    const searchCitiesTriggerMock = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue([]),
    });

    const getCityWeatherTriggerMock = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        id: 1,
        name: "Kyiv",
        temp: 21,
        condition: "clear sky",
        icon: "01d",
        humidity: 50,
        windSpeed: 3.5,
        pressure: 1012,
      }),
    });

    (api.useLazySearchCitiesQuery as jest.Mock).mockReturnValue([
      searchCitiesTriggerMock,
      { data: [], isFetching: true },
    ]);

    (api.useLazyGetCityWeatherQuery as jest.Mock).mockReturnValue([
      getCityWeatherTriggerMock,
      { isFetching: true },
    ]);

    render(<AddCityDialog onAdd={onAddMock} />);
    fireEvent.click(screen.getByText(/Add city/i));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Loading/i })).toBeDisabled();
  });

  it("handles server errors", async () => {
    const triggerMock = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ status: 404 }),
    });
    (api.useLazyGetCityWeatherQuery as jest.Mock).mockReturnValue([
      triggerMock,
      { isFetching: false },
    ]);

    render(<AddCityDialog onAdd={onAddMock} />);
    fireEvent.click(screen.getByText(/Add city/i));

    fireEvent.change(screen.getByPlaceholderText(/Name of the city/i), {
      target: { value: "UnknownCity" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Add$/i }));

    expect(await screen.findByText(/City not found/i)).toBeInTheDocument();
  });
});
