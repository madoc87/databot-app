import React, { createContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

export const CustomThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [currentTheme, setTheme] = useState('dark');

  const theme = useMemo(() => (currentTheme === 'light' ? lightTheme : darkTheme), [currentTheme]);

  return (
    <CustomThemeContext.Provider value={{ currentTheme, setTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;
