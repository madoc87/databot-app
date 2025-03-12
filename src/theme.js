import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    custom: {
      // strikethrough: '#828282'
      strikethrough: '#828282',
      chartLabel: '#828282',      // cor dos labels no gráfico pizza (tema light)
      legendText: '#828282'       // cor do texto da legenda (tema light)
    }
    // Outras customizações para o tema light
  },
  typography: {
    chart: {
      barValueSize: 15,          // tamanho da fonte dos valores nas barras
      pieValueSize: 14,          // tamanho da fonte dos valores na pizza
      legendSize: 14             // tamanho da fonte das legendas
    }
  }
});



export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    custom: {
      // strikethrough: '#808080'
      strikethrough: '#c1c1c1',
      chartLabel: '#ffffff',      // cor dos labels no gráfico pizza (tema dark)
      legendText: '#7a7a7a'       // cor do texto da legenda (tema dark)
    }
    // Outras customizações para o tema dark
  },
  typography: {
    chart: {
      barValueSize: 15,          // tamanho da fonte dos valores nas barras
      pieValueSize: 14,          // tamanho da fonte dos valores na pizza
      legendSize: 14             // tamanho da fonte das legendas
    }
  }
});
