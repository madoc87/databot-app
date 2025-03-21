import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const FormCampanha = () => {
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

  // Se existir um id, buscamos os dados para edição
  useEffect(() => {
    if (id) {
      api.get(`/api/campanhas/${id}`)
        .then((response) => {
          const campanha = response.data;
          setNome(campanha.nome || '');
          setCusto(campanha.custo_por_cliente || '');
          setNumeroClientes(campanha.numero_clientes || '');
          setNumeroTelefones(campanha.numero_telefones || '');
          // Caso o campo data_inicio venha com o formato ISO, pegamos apenas a parte da data
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
    }
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
      outros: statusOutros,
    };

    if (id) {
      // Modo edição: atualiza os dados da campanha
      api.put(`/api/campanhas/${id}`, campanha)
        .then(() => {
          alert('Campanha atualizada com sucesso!');
          navigate('/');
        })
        .catch((error) => {
          console.error('Erro ao atualizar a campanha:', error);
        });
    } else {
      // Modo adição: cria uma nova campanha
      api.post('/api/campanhas', campanha)
        .then(() => {
          alert('Campanha criada com sucesso!');
          navigate('/');
        })
        .catch((error) => {
          console.error('Erro ao criar a campanha:', error);
        });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      <Typography variant="h5" gutterBottom color="text.primary">
        {id ? "Editar Campanha" : "Adicionar Campanha"}
      </Typography>
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

        <Typography variant="subtitle1" color="text.primary" sx={{ marginTop: '1rem' }}>
          Status dos Clientes (
          {
          Number(statusVendidoManual) + 
          Number(statusVendidoIA) + 
          Number(statusTrocarDepois) + 
          Number(statusConfirmar) + 
          Number(statusOutros)
          }
          )
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
          {id ? "Salvar Alterações" : "Salvar Campanha"}
        </Button>
      </form>
    </Box>
  );
};

export default FormCampanha; 