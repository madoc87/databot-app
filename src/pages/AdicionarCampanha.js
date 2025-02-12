import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../api'; // Importa a instância centralizada
import { Button, TextField, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdicionarCampanha = () => {
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState('');
  const [numeroClientes, setNumeroClientes] = useState('');
  const [numeroTelefones, setNumeroTelefones] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [totalStatus, setTotalStatus] = useState(0);
  //   const [dataFim, setDataFim] = useState(''); //Adicionar data de fim da campanha
  // Campos para os status (quantidade de cada status)
  const [statusVendidoManual, setStatusVendidoManual] = useState('');
  const [statusVendidoIA, setStatusVendidoIA] = useState('');
  const [statusTrocarDepois, setStatusTrocarDepois] = useState('');
  const [statusConfirmar, setStatusConfirmar] = useState('');
  const [statusOutros, setStatusOutros] = useState('');

  const navigate = useNavigate();

  // Atualiza o totalStatus sempre que algum campo de status for alterado
  useEffect(() => {
    const somaStatus =
      Number(statusVendidoManual) +
      Number(statusVendidoIA) +
      Number(statusTrocarDepois) +
      Number(statusConfirmar) +
      Number(statusOutros);
    setTotalStatus(somaStatus);
  }, [statusVendidoManual, statusVendidoIA, statusTrocarDepois, statusConfirmar, statusOutros]);

  const handleSubmit = async (e) => {
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
      outros: statusOutros,
      total_status: totalStatus,
    };


    try {
      // await axios.post('http://localhost:5000/api/campanhas', campanha);
      await api.post('/api/campanhas', campanha);
      alert('Campanha cadastrada!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
    }
  };

  return (
    <Box sx={{ 
            maxWidth: 500, 
            margin: 'auto', 
            padding: '2rem',
            bgcolor: 'background.default',  // utiliza o fundo definido no tema
            color: 'text.primary',         // utiliza a cor de texto definida no tema
        }}>
      <Typography variant="h5" gutterBottom>Adicionar Campanha</Typography>
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
          Status dos Clientes (Total {totalStatus})
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
          Salvar Campanha
        </Button>
      </form>
    </Box>
  );
};

export default AdicionarCampanha;
