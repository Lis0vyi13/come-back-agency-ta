"use client";

import { useState } from "react";
import { Container, Typography, Grid, Box, Skeleton } from "@mui/material";
import { Search } from "@mui/icons-material";

import { AddCityDialog } from "../components/AddCityDialog";
import { Input } from "@/components/ui/Input";
import { CityCard } from "@/components/CityCard";

import { useCities } from "@/hooks/useCities";

import styles from "./page.module.scss";

const renderSkeletons = Array.from({ length: 6 }).map((_, index) => (
  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
    <Skeleton variant="rectangular" sx={{ borderRadius: 2, height: 200 }} />
  </Grid>
));

export default function HomePage() {
  const { cities, addCity, deleteCity, refreshCity, loadingCityId, isLoadingInitial } = useCities();
  const [searchQuery, setSearchQuery] = useState("");

  const handleFindCity = (query: string) => setSearchQuery(query);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCities = filteredCities.map((city, index) => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={city.id}>
      <CityCard
        city={city}
        onDelete={deleteCity}
        onRefresh={refreshCity}
        isLoading={city.id === loadingCityId}
        index={index}
      />
    </Grid>
  ));

  return (
    <Container component="section" maxWidth="md" className={styles.container}>
      <Box className={styles.dashboardBlock}>
        <Box component="header" mb={4}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            columnGap={2}
            className={styles.header}
          >
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Weather App
            </Typography>
            <Box className={styles.addButton}>
              <AddCityDialog onAdd={addCity} />
            </Box>
          </Grid>

          <Input
            onChange={(e) => handleFindCity(e.target.value)}
            size="large"
            startAdornment={<Search />}
            placeholder="Search..."
            fullWidth
          />
        </Box>

        <Grid container spacing={3}>
          {isLoadingInitial ? renderSkeletons : renderCities}

          {!isLoadingInitial && filteredCities.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" color="text.secondary" align="center">
                Cities not found 😢
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
