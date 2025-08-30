import { notFound } from "next/navigation";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import { HourlyChart } from "@/components/HourlyChart";

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

  const today = new Date().getDate();
  const todayForecast = forecast.filter((item) => new Date(item.dt * 1000).getDate() === today);

  const chartData = todayForecast.map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.getHours() + ":00",
      temp: item.main.temp,
      date: date.toLocaleDateString(),
    };
  });

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
            <Grid sx={{ xs: 4 }}>
              <Typography color="text.secondary">Humidity</Typography>
              <Typography fontWeight="bold">{cityWeather.humidity}%</Typography>
            </Grid>
            <Grid sx={{ xs: 4 }}>
              <Typography color="text.secondary">Wind</Typography>
              <Typography fontWeight="bold">{cityWeather.windSpeed} m/s</Typography>
            </Grid>
            <Grid sx={{ xs: 4 }}>
              <Typography color="text.secondary">Pressure</Typography>
              <Typography fontWeight="bold">{cityWeather.pressure} hPa</Typography>
            </Grid>
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
