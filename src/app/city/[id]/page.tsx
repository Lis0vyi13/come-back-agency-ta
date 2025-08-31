import { notFound } from "next/navigation";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import { type ChartDataItem, HourlyChart } from "@/components/HourlyChart";

import type { HourlyForecastItem } from "@/types/weather.types";
import type { City } from "@/types/city.types";
import { weatherApi } from "@/store/features";
import { store as createStore } from "@/store";

import styles from "./CityDetailsPage.module.scss";

interface Props {
  params: Promise<{ id: string }>;
}

const CityDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const store = createStore();

  const cityWeatherResult = await store.dispatch(weatherApi.endpoints.getCityWeather.initiate(id));

  if (!cityWeatherResult.data) notFound();
  const cityWeather: City = cityWeatherResult.data;

  const forecastResult = await store.dispatch(
    weatherApi.endpoints.getCityHourlyForecast.initiate(id),
  );

  const forecast: HourlyForecastItem[] = forecastResult.data?.list || [];

  const chartData: ChartDataItem[] = forecast.map((item, index) => {
    const [datePart, timePart] = item.dt_txt.split(" ");
    const hours = timePart.split(":")[0];
    return {
      time: `${hours}:00`,
      temp: item.main.temp,
      date: datePart.split("-").reverse().join("."),
      _index: index,
    };
  });

  const weatherStats = [
    { label: "Humidity", value: `${cityWeather.humidity}%` },
    { label: "Wind", value: `${cityWeather.windSpeed} m/s` },
    { label: "Pressure", value: `${cityWeather.pressure} hPa` },
  ];

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper className={styles.paper}>
        <Grid container spacing={2} flexDirection="column">
          <Grid sx={{ xs: 12 }}>
            <Typography fontWeight={600} variant="h4">
              {cityWeather.name} Weather
            </Typography>
          </Grid>

          <Grid container sx={{ xs: 12 }} className={styles.gridRow}>
            <Grid sx={{ xs: 6 }}>
              <Typography variant="h3" className={styles.weatherTemp}>
                {cityWeather.temp}°C
              </Typography>
              <Typography className={styles.weatherCondition} color="text.secondary">
                {cityWeather.condition}
              </Typography>
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <Box
                component="img"
                src={`https://openweathermap.org/img/wn/${cityWeather.icon}@4x.png`}
                alt={cityWeather.condition}
                className={styles.weatherIcon}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {weatherStats.map((stat) => (
              <Grid key={stat.label} sx={{ xs: 4 }}>
                <Typography color="text.secondary">{stat.label}</Typography>
                <Typography fontWeight="bold">{stat.value}</Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Paper>

      {chartData.length > 0 ? (
        <HourlyChart data={chartData} loading={false} />
      ) : (
        <Typography sx={{ mt: 3 }} color="text.secondary">
          No forecast data available 😢
        </Typography>
      )}
    </Container>
  );
};

export default CityDetailsPage;
