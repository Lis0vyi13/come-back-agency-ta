"use client";

import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import styles from "./HourlyChart.module.scss";

export interface ChartDataItem {
  time: string;
  temp: number;
  date: string;
}

interface HourlyChartProps {
  data: ChartDataItem[];
  loading?: boolean;
}

const HourlyChart = ({ data, loading }: HourlyChartProps) => {
  if (loading) {
    return (
      <Box className={styles.loaderBlock}>
        <Typography>Loading forecast...</Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography sx={{ mt: 3 }} color="text.secondary">
        No forecast data available 😢
      </Typography>
    );
  }

  return (
    <Paper className={styles.chartPaper}>
      <Typography variant="h6" gutterBottom>
        Hourly Forecast
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis unit="°C" />
            <Tooltip
              formatter={(value: number) => [`${value}°C`, "Temperature"]}
              labelFormatter={(label, payload) =>
                payload && payload[0] ? `${payload[0].payload.date} ${label}` : label
              }
            />
            <Line type="monotone" dataKey="temp" stroke="#1976d2" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default HourlyChart;
