// frontend/src/pages/CampanhasList.js
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper } from '@mui/material';

const CampanhasList = () => {
  const [campanhas, setCampanhas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get('http://localhost:5000/api/campanhas')
    api.get('/api/campanhas')
      .then((response) => setCampanhas(response.data))
      .catch((error) => console.error('Erro ao buscar campanhas:', error));
  }, []);

  const handleDashboard = (id) => {
    navigate(`/dashboard/${id}`);
  };

  const handleEdit = (id) => {
    // Aqui você pode redirecionar para uma página de edição, por exemplo:
    alert('Editar campanha ' + id);
  };

  return (
    <Box
      sx={{
        padding: '2rem',
        bgcolor: 'background.default',  // utiliza o fundo definido no tema
        color: 'text.primary',         // utiliza a cor de texto definida no tema
        minHeight: '100vh'             // garante que o fundo cubra a tela inteira
      }}
    >
      <Typography variant="h4" gutterBottom>Campanhas</Typography>
      {campanhas.length === 0 ? (
        <Paper sx={{ padding: '1rem', marginBottom: '1rem' }}>
          <Typography>Nenhuma campanha cadastrada.</Typography>
          <Button variant="contained" component={Link} to="/adicionar" sx={{ marginTop: '1rem' }}>
            Adicionar Campanha
          </Button>
        </Paper>
      ) : (
        campanhas.map(c => (
          <Paper key={c.id} sx={{ padding: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h6">{c.nome}</Typography>
            <Typography>Data: {new Date(c.data_inicio).toLocaleDateString()}</Typography>
            <Typography>Número de Clientes: {c.numero_clientes}</Typography>
            <Typography>Número de Telefones: {c.numero_telefones}</Typography>
            <Box sx={{ marginTop: '1rem' }}>
              <Button 
                variant="contained" 
                onClick={() => handleDashboard(c.id)} 
                sx={{ marginRight: '1rem' }}
              >
                Carregar Dashboard
              </Button>
              <Button variant="outlined" onClick={() => handleEdit(c.id)}>
                Editar Dados
              </Button>
            </Box>
          </Paper>
        ))
      )}
      {campanhas.length > 0 && (
        <Button variant="contained" component={Link} to="/adicionar">
          Adicionar Nova Campanha
        </Button>
      )}
    </Box>
  );
};

export default CampanhasList;
