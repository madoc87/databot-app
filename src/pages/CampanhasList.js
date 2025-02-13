// frontend/src/pages/CampanhasList.js
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Button, Typography, Box, Paper,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';

const CampanhasList = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState(null);
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

  const handleOpenDeleteDialog = (campanha) => {
    setSelectedCampanha(campanha);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCampanha(null);
  };

  const handleConfirmDelete = () => {
    if (selectedCampanha) {
      console.log("Tentando deletar campanha com id:", selectedCampanha.id);
      api.delete(`/api/campanhas/${selectedCampanha.id}`)
        .then((response) => {
          console.log("Resposta da exclusão:", response);
          // Atualiza a lista removendo a campanha apagada
          setCampanhas(prev => prev.filter(c => c.id !== selectedCampanha.id));
          handleCloseDeleteDialog();
        })
        .catch((error) => {
          console.error('Erro ao apagar campanha:', error);
          handleCloseDeleteDialog();
        });
    }
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
              <Button 
                variant="outlined" 
                onClick={() => handleEdit(c.id)} 
                sx={{ marginRight: '1rem' }}
              >
                Editar Dados
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => handleOpenDeleteDialog(c)}
              >
                Apagar Campanha
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

      {/* Diálogo de confirmação para apagar campanha */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja apagar a campanha "{selectedCampanha?.nome}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Apagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampanhasList;
