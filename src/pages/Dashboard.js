// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartDataLabels);

const Dashboard = () => {
  const { id } = useParams();
  const [campanha, setCampanha] = useState(null);
  const [chartType, setChartType] = useState('bar');

  // Tamanhos do gráfico
  const chartWidth = 600;
  const chartHeight = 350;

  useEffect(() => {
    api.get(`/api/campanhas/${id}`)
      .then(response => setCampanha(response.data))
      .catch(error => console.error('Erro ao buscar campanha:', error));
  }, [id]);

  if (!campanha) {
    return <Typography>Carregando campanha...</Typography>;
  }

  // Cálculo do total de respostas e porcentagem
  const totalRespostas = 
    Number(campanha.vendido_manual) + 
    Number(campanha.vendido_ia) +
    Number(campanha.trocar_depois) + 
    Number(campanha.confirmar) + 
    Number(campanha.outros);

  const calcPercent = (value) => totalRespostas 
    ? ((Number(value) / totalRespostas) * 100).toFixed(2) 
    : 0;

  // Dados comuns para ambos os gráficos
  const data = {
    labels: [
      'Vendido Manual', 
      'Vendido IA', 
      'Trocar Depois', 
      'Confirmar', 
      'Outros'
    ],
    datasets: [
      {
        // Aqui o label do dataset pode ser qualquer coisa – para pizza ele não é utilizado na legenda
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

  // Configuração comum (tooltip e interações)
  const commonOptions = {
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const rawValue = [
              campanha.vendido_manual,
              campanha.vendido_ia,
              campanha.trocar_depois,
              campanha.confirmar,
              campanha.outros
            ][context.dataIndex];
            const percent = totalRespostas 
              ? ((Number(rawValue) / totalRespostas) * 100).toFixed(2) 
              : 0;
            return `${context.label}: ${context.parsed.y}% (${rawValue}) - ${percent}%`;
          }
        }
      }
    }
  };

  // Opções específicas para gráfico de pizza – adiciona a legenda customizada
  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          // Gera os itens da legenda a partir dos labels e das cores do dataset
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            if (chart.data.labels.length && dataset) {
              return chart.data.labels.map((label, index) => ({
                text: label,
                fillStyle: dataset.backgroundColor[index],
                strokeStyle: dataset.backgroundColor[index],
                lineWidth: 1,
                hidden: isNaN(dataset.data[index]) || chart.getDatasetMeta(0).data[index].hidden,
                index: index,
              }));
            }
            return [];
          },
        },
      },
      // Se desejar manter os datalabels no gráfico de pizza, mantenha ou ajuste conforme necessidade
      datalabels: {
        formatter: (value, context) => {
          const rawValue = [
            campanha.vendido_manual,
            campanha.vendido_ia,
            campanha.trocar_depois,
            campanha.confirmar,
            campanha.outros
          ][context.dataIndex];
          const percent = totalRespostas 
            ? ((Number(rawValue) / totalRespostas) * 100).toFixed(2)
            : 0;
          // Retorna um array para gerar duas linhas (bruto e percentual)
          return [rawValue, percent + '%'];
        },
        color: '#fff', // Cor alterada para cinza conforme sua alteração
        font: {
          weight: 'bold'
        }
      }
    },
  };

  // Opções para gráfico de barras (mantendo os datalabels para barras também)
  const barOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        labels: {
          raw: {
            display: true,
            anchor: 'end',
            align: 'end',
            formatter: (value, context) => {
              const rawValue = [
                campanha.vendido_manual,
                campanha.vendido_ia,
                campanha.trocar_depois,
                campanha.confirmar,
                campanha.outros
              ][context.dataIndex];
              return rawValue;
            },
            color: '#7a7a7a',
            font: { weight: 'bold' }
          },
          percent: {
            display: true,
            anchor: 'center',
            align: 'center',
            formatter: (value, context) => {
              const rawValue = [
                campanha.vendido_manual,
                campanha.vendido_ia,
                campanha.trocar_depois,
                campanha.confirmar,
                campanha.outros
              ][context.dataIndex];
              const percent = totalRespostas 
                ? ((Number(rawValue) / totalRespostas) * 100).toFixed(2)
                : 0;
              return percent + '%';
            },
            color: '#fff',
            font: { weight: 'normal' }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + '%',
        }
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
          <Bar data={data} options={barOptions} />
        ) : (
          <Pie data={data} options={pieOptions} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
