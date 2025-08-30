import { TextField, TextFieldProps, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";

type TextFieldVariants = "outlined" | "filled" | "standard";

const CustomInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "var(--gray)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  "& .MuiFilledInput-root": {
    borderRadius: 12,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#e8e8e8",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
}));

interface CustomInputProps<Variant extends TextFieldVariants = "outlined">
  extends Omit<TextFieldProps, "variant" | "slotProps"> {
  label?: string;
  placeholder?: string;
  variant?: Variant;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = ({
  label,
  placeholder,
  variant = "outlined",
  startAdornment,
  endAdornment,
  size = "medium",
  ...props
}: CustomInputProps) => {
  return (
    <CustomInput
      variant={variant}
      label={label}
      placeholder={placeholder}
      fullWidth
      size={size}
      slotProps={{
        input: {
          startAdornment: startAdornment && (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ),
          endAdornment: endAdornment && (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
};

export default Input;
