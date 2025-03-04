import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    custom: {
      strikethrough: '#828282'
    }
    // Outras customizações para o tema light
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    custom: {
      strikethrough: '#808080'
    }
    // Outras customizações para o tema dark
  },
});
