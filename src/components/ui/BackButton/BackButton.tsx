"use client";

import { useRouter } from "next/navigation";
import { Button } from "../Button";
import { ArrowBack } from "@mui/icons-material";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      startIcon={<ArrowBack />}
      variant="contained"
      color="primary"
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
};

export default BackButton;
