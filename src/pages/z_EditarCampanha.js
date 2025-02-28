import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';

const EditarCampanha = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState('');
  const [numeroClientes, setNumeroClientes] = useState('');
  const [numeroTelefones, setNumeroTelefones] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [statusVendidoManual, setStatusVendidoManual] = useState('');
  const [statusVendidoIA, setStatusVendidoIA] = useState('');
  const [statusTrocarDepois, setStatusTrocarDepois] = useState('');
  const [statusConfirmar, setStatusConfirmar] = useState('');
  const [statusOutros, setStatusOutros] = useState('');

  useEffect(() => {
    // Busca os dados da campanha a ser editada
    api.get(`/api/campanhas/${id}`)
      .then((response) => {
        const campanha = response.data;
        setNome(campanha.nome || '');
        setCusto(campanha.custo_por_cliente || '');
        setNumeroClientes(campanha.numero_clientes || '');
        setNumeroTelefones(campanha.numero_telefones || '');
        // Se o campo data_inicio for um ISO string, pegue apenas a parte da data
        setDataInicio(campanha.data_inicio ? campanha.data_inicio.split('T')[0] : '');
        setStatusVendidoManual(campanha.vendido_manual || '');
        setStatusVendidoIA(campanha.vendido_ia || '');
        setStatusTrocarDepois(campanha.trocar_depois || '');
        setStatusConfirmar(campanha.confirmar || '');
        setStatusOutros(campanha.outros || '');
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados da campanha:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const campanha = {
      nome,
      custo_por_cliente: custo,
      numero_clientes: numeroClientes,
      numero_telefones: numeroTelefones,
      data_inicio: dataInicio,
      vendido_manual: statusVendidoManual,
      vendido_ia: statusVendidoIA,
      trocar_depois: statusTrocarDepois,
      confirmar: statusConfirmar,
      outros: statusOutros
    };

    api.put(`/api/campanhas/${id}`, campanha)
      .then(() => {
        alert('Campanha atualizada com sucesso!');
        navigate('/');
      })
      .catch((error) => {
        console.error('Erro ao atualizar a campanha:', error);
      });
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Editar Campanha</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome da Campanha"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Custo da mensagem por Cliente"
          value={custo}
          onChange={(e) => setCusto(Number(e.target.value))}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value={0.35}>Marketing (R$ 0,35)</MenuItem>
          <MenuItem value={0.06}>Utility (R$ 0,06)</MenuItem>
          <MenuItem value={0.18}>Authentication (R$ 0,18)</MenuItem>
        </TextField>
        <TextField
          label="Número de Clientes"
          type="number"
          value={numeroClientes}
          onChange={(e) => setNumeroClientes(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Número de Telefones"
          type="number"
          value={numeroTelefones}
          onChange={(e) => setNumeroTelefones(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Data da Campanha"
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <Typography variant="subtitle1" sx={{ marginTop: '1rem' }}>
          Status dos Clientes
        </Typography>
        <TextField
          label="Vendido Manual"
          type="number"
          value={statusVendidoManual}
          onChange={(e) => setStatusVendidoManual(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Vendido IA"
          type="number"
          value={statusVendidoIA}
          onChange={(e) => setStatusVendidoIA(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Trocar depois"
          type="number"
          value={statusTrocarDepois}
          onChange={(e) => setStatusTrocarDepois(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Confirmar"
          type="number"
          value={statusConfirmar}
          onChange={(e) => setStatusConfirmar(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Outros"
          type="number"
          value={statusOutros}
          onChange={(e) => setStatusOutros(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Salvar Alterações
        </Button>
      </form>
    </Box>
  );
};

export default EditarCampanha; 