import React, { createContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

export const CustomThemeContext = createContext({
  currentTheme: 'light',
  setTheme: null,
});

export const CustomThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  const theme = useMemo(() => (themeName === 'light' ? lightTheme : darkTheme), [themeName]);

  const contextValue = useMemo(
    () => ({
      currentTheme: themeName,
      setTheme: setThemeName,
    }),
    [themeName]
  );

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};
