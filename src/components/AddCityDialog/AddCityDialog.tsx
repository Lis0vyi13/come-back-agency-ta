"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Button } from "../ui/Button";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useLazyGetCityWeatherQuery, useLazySearchCitiesQuery } from "@/store/features";
import type { City } from "@/types/city.types";

import styles from "./AddCityDialog.module.scss";

type Props = {
  onAdd: (city: City) => void;
};

const AddCityDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [triggerWeather, { isFetching: isFetchingWeather }] = useLazyGetCityWeatherQuery();
  const [searchCities, { data: cities = [], isFetching: isFetchingCities }] =
    useLazySearchCitiesQuery();

  useEffect(() => {
    if (cityName.trim().length > 1) {
      const timeout = setTimeout(async () => {
        await searchCities(cityName).unwrap();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [cityName, searchCities]);

  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      const result = await triggerWeather(cityName).unwrap();
      if (result) {
        onAdd(result);
        setCityName("");
        setOpen(false);
      }
    } catch (err) {
      const error = err as FetchBaseQueryError;
      setError(
        "status" in error && error.status === 404
          ? "City not found"
          : "An error occurred. Please try again.",
      );
    }
  };

  return (
    <>
      <Button fullWidth startIcon={<Add />} color="primary" onClick={() => setOpen(true)}>
        Add city
      </Button>

      <Dialog disableRestoreFocus open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New city</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent className={styles.dialogContent}>
            <Autocomplete
              freeSolo
              fullWidth
              loading={isFetchingCities}
              options={cities.map((c) => c.name + (c.country ? `, ${c.country}` : ""))}
              onInputChange={(_, value) => setCityName(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Name of the city"
                  inputRef={inputRef}
                  autoFocus
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "var(--gray)",
                    },
                  }}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isFetchingCities ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />

            {error && (
              <Typography variant="body2" color="error" mt={1}>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button color="primary" type="submit" variant="contained" disabled={isFetchingWeather}>
              {isFetchingWeather ? "Loading..." : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddCityDialog;
