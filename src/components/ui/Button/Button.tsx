import { memo, ReactNode } from "react";
import { Button as MuiButton, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomButton = styled(MuiButton)(() => ({
  borderRadius: 10,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: "6px 16px",
  fontSize: "16px",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  "& .MuiButton-startIcon": {
    marginRight: "4px",
  },
  "& .MuiButton-endIcon": {
    marginLeft: "4px",
  },
}));

interface CustomButtonProps extends ButtonProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const Button = memo(({ startIcon, endIcon, children, ...props }: CustomButtonProps) => {
  return (
    <CustomButton
      variant="contained"
      color="inherit"
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </CustomButton>
  );
});

export default Button;
