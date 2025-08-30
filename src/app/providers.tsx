"use client";

import theme from "@/lib/theme";
import { AppStore, store } from "@/store/store";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { useRef } from "react";
import { Provider } from "react-redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <Provider store={storeRef.current}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Provider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
