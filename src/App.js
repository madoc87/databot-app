import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CustomThemeProvider, CustomThemeContext } from './ThemeContext';
import { Box, Button, Switch, useTheme, GlobalStyles } from '@mui/material';
import { useContext } from 'react';

import CampanhasList from './pages/CampanhasList';
import AdicionarCampanha from './pages/AdicionarCampanha';
import Dashboard from './pages/Dashboard';
import CadastroVendas from './pages/CadastroVendas';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Add from '@mui/icons-material/Add';



function AppContent() {

  const theme = useTheme(); // Acessa o tema atual

  // Utiliza o contexto para alternar o tema
  const { currentTheme, setTheme } = useContext(CustomThemeContext);

  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
  <>
    <GlobalStyles styles={{
      body: { 
        backgroundColor: theme.palette.background.default, 
        margin: 0, 
        padding: 0 
      }
    }} />

    <Router>

      <Box 
        component="nav"
        sx={{
          padding: '1rem',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper', // Usa a cor do fundo definida no tema para o menu
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <Button size='small' variant="outlined" startIcon={<HomeOutlinedIcon  />} component={Link} to="/" sx={{ marginRight: '1rem' }}>Campanhas</Button>
          
          <Button size='small' variant="outlined" startIcon={<Add />} component={Link} to="/adicionar" sx={{ marginRight: '1rem' }}>Adicionar Campanha</Button>
          <Button size='small' variant="outlined" component={Link} to="/vendas" sx={{ marginRight: '1rem' }}>Cadastro de Vendas</Button>
        </div>

        <Box
        sx={{
          color: 'text.primary', // utiliza a cor de texto definida no tema
        }}
        >
          <Switch checked={currentTheme === 'dark'} onChange={toggleTheme} />
          <span>{currentTheme === 'light' ? 'Light' : 'Dark'}</span>
        </Box>
      </Box>

        

      <Routes>
        <Route path="/" element={<CampanhasList />} />
        <Route path="/adicionar" element={<AdicionarCampanha />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/vendas" element={<CadastroVendas />} />
      </Routes>
    </Router>
    </>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;