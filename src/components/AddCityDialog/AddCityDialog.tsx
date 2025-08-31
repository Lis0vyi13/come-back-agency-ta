"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import type { City, CitySuggestionResponse } from "@/types/city.types";

import styles from "./AddCityDialog.module.scss";

type Props = {
  onAdd: (city: City) => void;
};

const AddCityDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<CitySuggestionResponse[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [triggerWeather, { isFetching: isFetchingWeather }] = useLazyGetCityWeatherQuery();
  const [searchCities, { isFetching: isFetchingCities }] = useLazySearchCitiesQuery();

  useEffect(() => {
    if (cityName.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(() => {
      searchCities(cityName)
        .unwrap()
        .then((res) => {
          const result = res.map((c) => ({ name: c.name, state: c.state }));

          setSearchResults(result);
        })
        .catch(() => setSearchResults([]));
    }, 400);

    return () => clearTimeout(handler);
  }, [cityName, searchCities]);

  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setCityName("");
    setError("");
    setSearchResults([]);
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
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
          handleClose();
        }
      } catch (err) {
        const fetchError = err as FetchBaseQueryError;
        setError(
          "status" in fetchError && fetchError.status === 404
            ? "City not found"
            : "An error occurred. Please try again.",
        );
      }
    },
    [cityName, onAdd, triggerWeather, handleClose],
  );

  return (
    <>
      <Button fullWidth startIcon={<Add />} color="primary" onClick={() => setOpen(true)}>
        Add city
      </Button>

      <Dialog
        disableRestoreFocus
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "calc(100% - 24px)", sm: "400px" },
              borderRadius: 2,
            },
          },
        }}
      >
        <DialogTitle>New city</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent className={styles.dialogContent}>
            <Autocomplete
              freeSolo
              fullWidth
              loading={isFetchingCities}
              options={searchResults.map((c) => `${c.name}, ${c.state || ""}`)}
              onInputChange={(_, value) => setCityName(value)}
              filterOptions={(options) => options}
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
            <Button onClick={handleClose}>Cancel</Button>
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
