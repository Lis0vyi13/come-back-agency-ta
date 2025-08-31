import { useCallback } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { Button } from "../ui/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "motion/react";

import type { City } from "@/types/city.types";

import styles from "./CityCard.module.scss";

interface CardProps {
  city: City;
  onDelete: (id: number) => void;
  onRefresh: (id: number) => void;
  isLoading?: boolean;
  index: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, delay: custom * 0.13 },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const CityCard = ({ city, onDelete, onRefresh, isLoading, index }: CardProps) => {
  const handleRefresh = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRefresh(city.id);
    },
    [city.id, onRefresh],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(city.id);
    },
    [city.id, onDelete],
  );

  return (
    <AnimatePresence>
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={index}
      >
        <Card className={styles.card}>
          <Link href={`/city/${city.name.toLowerCase()}`} className={styles.cardLink}>
            <CardContent className={styles.cardContent}>
              <Grid
                wrap="nowrap"
                sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                container
              >
                <Typography variant="h6" gutterBottom>
                  {city.name}
                </Typography>
                <Box sx={{ mt: -1.5, mr: -0.5 }}>
                  <Image
                    src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
                    alt={city.condition}
                    title={city.condition}
                    width={50}
                    height={50}
                  />
                </Box>
              </Grid>
              <Typography variant="h4" fontWeight="bold">
                {city.temp}°C
              </Typography>

              <Typography
                sx={{ textTransform: "capitalize" }}
                variant="body2"
                color="text.secondary"
              >
                {city.condition}
              </Typography>
            </CardContent>
          </Link>

          <CardActions className={styles.cardActions}>
            <Button
              disabled={isLoading}
              size="small"
              startIcon={!isLoading && <RefreshIcon />}
              onClick={handleRefresh}
              fullWidth
            >
              {isLoading ? <CircularProgress color="primary" size={28} /> : "Refresh"}
            </Button>
            <Button color="error" size="small" onClick={handleDelete} fullWidth>
              <DeleteIcon /> Delete
            </Button>
          </CardActions>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default CityCard;
