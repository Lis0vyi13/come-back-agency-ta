import { render, screen, fireEvent } from "@testing-library/react";
import CityCard from "./CityCard";
import "@testing-library/jest-dom";
import type { City } from "@/types/city.types";
import { JSX } from "@emotion/react/jsx-runtime";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: JSX.IntrinsicElements["img"]) => {
    return <img alt={props.alt || "image"} {...props} />;
  },
}));

describe("CityCard", () => {
  const city: City = {
    id: 1,
    name: "Kyiv",
    temp: 21,
    condition: "clear sky",
    icon: "01d",
    humidity: 50,
    windSpeed: 3.5,
    pressure: 1012,
  };

  const onDeleteMock = jest.fn();
  const onRefreshMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders city name, temperature, condition and icon", () => {
    render(<CityCard city={city} onDelete={onDeleteMock} onRefresh={onRefreshMock} index={0} />);

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
    expect(screen.getByText(/21°C/i)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();

    const img = screen.getByRole("img", { name: /clear sky/i }) as HTMLImageElement;
    expect(img.src).toContain("01d@2x.png");
  });

  it("calls onRefresh when Refresh button is clicked", () => {
    render(<CityCard city={city} onDelete={onDeleteMock} onRefresh={onRefreshMock} index={0} />);

    fireEvent.click(screen.getByText("Refresh"));
    expect(onRefreshMock).toHaveBeenCalledWith(city.id);
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(<CityCard city={city} onDelete={onDeleteMock} onRefresh={onRefreshMock} index={0} />);

    fireEvent.click(screen.getByText(/Delete/i));
    expect(onDeleteMock).toHaveBeenCalledWith(city.id);
  });

  it("shows loading spinner when isLoading is true", () => {
    render(
      <CityCard
        city={city}
        onDelete={onDeleteMock}
        onRefresh={onRefreshMock}
        isLoading
        index={0}
      />,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    const refreshButton = screen.getAllByRole("button")[0];
    expect(refreshButton).toBeInTheDocument();

    expect(refreshButton).toBeDisabled();
  });
});
