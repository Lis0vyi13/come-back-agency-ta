"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Paper } from "@mui/material";
import { useLazyGetCityHourlyForecastQuery, useGetCityWeatherQuery } from "@/store/features";
import { useParams } from "next/navigation";
import { HourlyChart } from "@/components/HourlyChart";

import type { HourlyForecastItem } from "@/types/weather.types";

import styles from "./CityDetailPage.module.scss";

const Loader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
    <CircularProgress />
  </Box>
);

const CityNotFoundMessage = () => (
  <Typography sx={{ mt: 6 }} color="text.secondary" align="center">
    City not found 😢
  </Typography>
);

const CityDetailPage = () => {
  const { id } = useParams();
  const [forecast, setForecast] = useState<HourlyForecastItem[]>([]);
  const [trigger, { isFetching }] = useLazyGetCityHourlyForecastQuery();

  const { data: cityWeather, isLoading: isLoadingCity } = useGetCityWeatherQuery(id as string, {
    skip: !id,
  });

  useEffect(() => {
    if (!id) return;

    trigger(id as string)
      .unwrap()
      .then((data) => {
        const today = new Date().getDate();
        const todayForecast = data.list.filter(
          (item) => new Date(item.dt * 1000).getDate() === today,
        );
        setForecast(todayForecast);
      })
      .catch((err) => console.error(err));
  }, [id, trigger]);

  const chartData = forecast.map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.getHours() + ":00",
      temp: item.main.temp,
      date: date.toLocaleDateString(),
    };
  });

  if (isLoadingCity) {
    return <Loader />;
  }

  if (!cityWeather) {
    return <CityNotFoundMessage />;
  }

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
            <Grid sx={{ xs: 6, sm: 6 }}>
              <Typography variant="h3" className={styles.weatherTemp}>
                {cityWeather.temp}°C
              </Typography>
              <Typography className={styles.weatherCondition} color="text.secondary">
                {cityWeather.condition}
              </Typography>
            </Grid>

            <Grid sx={{ xs: 6, sm: 6 }}>
              <Box
                component="img"
                src={`https://openweathermap.org/img/wn/${cityWeather.icon}@4x.png`}
                alt={cityWeather.condition}
                className={styles.weatherIcon}
              />
            </Grid>
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
      </Paper>

      {isFetching && <Loader />}

      {!isFetching && forecast.length > 0 && <HourlyChart data={chartData} loading={isFetching} />}

      {!isFetching && forecast.length === 0 && (
        <Typography sx={{ mt: 3 }} color="text.secondary">
          No forecast data available 😢
        </Typography>
      )}
    </Container>
  );
};

export default CityDetailPage;
