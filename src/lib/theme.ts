"use client";

import { createTheme } from "@mui/material";

declare module "@mui/material/TextField" {
  interface TextFieldPropsSizeOverrides {
    large: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiTextField: {
      variants: [
        {
          props: { size: "large" },
          style: {
            "& .MuiInputBase-root": {
              height: 46,
              padding: "0 16px",
            },
            "& .MuiInputBase-input": {
              padding: "14px 0",
            },
          },
        },
      ],
    },
  },
});

export default theme;
