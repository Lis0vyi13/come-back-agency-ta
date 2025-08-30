import { render, screen } from "@testing-library/react";
import HourlyChart, { ChartDataItem } from "./HourlyChart";
import "@testing-library/jest-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe("HourlyChart", () => {
  const mockData: ChartDataItem[] = [
    { time: "10:00", temp: 20, date: "30.08.2025" },
    { time: "11:00", temp: 21, date: "30.08.2025" },
    { time: "12:00", temp: 22, date: "30.08.2025" },
  ];

  it("renders loading state", () => {
    render(<HourlyChart data={[]} loading />);
    expect(screen.getByText(/loading forecast/i)).toBeInTheDocument();
  });

  it("renders no data message", () => {
    render(<HourlyChart data={[]} />);
    expect(screen.getByText(/no forecast data available/i)).toBeInTheDocument();
  });

  it("renders chart when data is provided", () => {
    render(<HourlyChart data={mockData} />);
    expect(screen.getByText(/hourly forecast/i)).toBeInTheDocument();
  });
});
