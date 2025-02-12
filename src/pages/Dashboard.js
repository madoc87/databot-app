// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../api';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement);

const Dashboard = () => {
  const { id } = useParams();
  const [campanha, setCampanha] = useState(null);
  const [chartType, setChartType] = useState('bar');

  // Variáveis para tamanho do gráfico
  const chartWidth = 600;  // Alterar largura do grafico
  const chartHeight = 350; // Alterar altura do grafico

  useEffect(() => {
    // axios.get(`http://localhost:5000/api/campanhas/${id}`)
    api.get(`/api/campanhas/${id}`)
      .then(response => setCampanha(response.data))
      .catch(error => console.error('Erro ao buscar campanha:', error));
  }, [id]);

  if (!campanha) {
    return <Typography>Carregando campanha...</Typography>;
  }

  const totalRespostas = Number(campanha.vendido_manual) + Number(campanha.vendido_ia) +
    Number(campanha.trocar_depois) + Number(campanha.confirmar) + Number(campanha.outros);

  const calcPercent = (value) => totalRespostas ? ((Number(value) / totalRespostas) * 100).toFixed(2) : 0;

  const data = {
    labels: ['Vendido Manual', 'Vendido IA', 'Trocar Depois', 'Confirmar', 'Outros'],
    datasets: [
      {
        label: 'Percentual de Respostas (%)',
        data: [
          calcPercent(campanha.vendido_manual),
          calcPercent(campanha.vendido_ia),
          calcPercent(campanha.trocar_depois),
          calcPercent(campanha.confirmar),
          calcPercent(campanha.outros),
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  const handleChartType = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Opções para ambos os tipos de gráfico (exibindo tooltips com as informações)
  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      },
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  return (
    <Box sx={{ padding: '2rem', bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard da Campanha: {campanha.nome}
      </Typography>
      <Paper sx={{ padding: '1rem', marginBottom: '2rem' }}>
        <Typography>
          <strong>Data da Campanha:</strong> {new Date(campanha.data_inicio).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Número de Clientes:</strong> {campanha.numero_clientes}
        </Typography>
        <Typography>
          <strong>Número de Telefones:</strong> {campanha.numero_telefones}
        </Typography>
        <Typography>
          <strong>Total de Respostas:</strong> {totalRespostas}
        </Typography>
      </Paper>
      
      <Box sx={{ marginBottom: '1rem' }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartType}
          aria-label="Tipo de gráfico"
        >
          <ToggleButton value="bar" aria-label="Gráfico de barras">
            Barras
          </ToggleButton>
          <ToggleButton value="pie" aria-label="Gráfico de pizza">
            Pizza
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ width: chartWidth, height: chartHeight, margin: 'auto' }}>
        {chartType === 'bar' ? (
          <Bar data={data} options={chartOptions} />
        ) : (
          <Pie data={data} options={chartOptions} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
