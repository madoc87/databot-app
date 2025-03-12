// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton, useTheme, Grid } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Legend, ChartDataLabels);


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartDataLabels);

const Dashboard = () => {
  const { id } = useParams();
  const [campanha, setCampanha] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const theme = useTheme();

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

//totalRespostas 
const custoTotal = "R$ " + (campanha.numero_telefones * 0.1).toFixed(2); 

//Num respostas / num total de disparos * 100
const percRespostas = ((totalRespostas / campanha.numero_telefones) * 100).toFixed(1)+" %";


//Num vendas / num total de disparos * 100
const conversaoDisp = (((campanha.vendido_manual + campanha.vendido_ia) / campanha.numero_telefones) * 100).toFixed(1)+" %";


//Num vendas / num total de respostas * 100
const conversaoResp = (((campanha.vendido_manual + campanha.vendido_ia) / totalRespostas) * 100).toFixed(1)+" %";


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

  // Opções específicas para gráfico de barras
  const barOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: theme.palette.custom.legendText,
          font: {
            size: theme.typography.chart.legendSize
          }
        }
      },
      datalabels: {
        labels: {
          percent: {
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
              const percent = totalRespostas 
                ? ((Number(rawValue) / totalRespostas) * 100).toFixed(2)
                : 0;
              return percent + '%';
            },
            color: '#7a7a7a', //Cores dos numeros percentuais do grafico de barras
            font: { 
              size: theme.typography.chart.barValueSize,
              weight: 'bold' 
            }
          },
          raw: {
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
              return rawValue;
            },
            color: theme.palette.custom.chartLabel, //Cores dos numeros brutos de dentro das barras do grafico
            font: { 
              size: theme.typography.chart.barValueSize,
              weight: 'normal' 
            }
          }
        }
      }
    }
  };

  // Opções específicas para gráfico de pizza
  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: theme.palette.custom.legendText,
          font: {
            size: theme.typography.chart.legendSize
          }
        }
      },
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
          return [rawValue, percent + '%'];
        },
        color: theme.palette.custom.chartLabel,
        font: {
          size: theme.typography.chart.pieValueSize,
          weight: 'bold'
        }
      }
    }
  };

  const espacamentoLinhas = 1;

  return (
    <Box sx={{ padding: '2rem', bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard da Campanha: {campanha.nome}
      </Typography>
      
      <Paper sx={{ padding: '1rem', marginBottom: '2rem' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Data da Campanha:</strong> {new Date(campanha.data_inicio).toLocaleDateString()}
            </Typography>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Número de Clientes:</strong> {campanha.numero_clientes}
            </Typography>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Número de Telefones:</strong> {campanha.numero_telefones}
            </Typography>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Total de Respostas:</strong> {totalRespostas}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Custo Total (R$ 0,10/disparo):</strong> {custoTotal}
            </Typography>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Percentual de Respostas (Respostas/Disparos):</strong> {percRespostas}
            </Typography>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Taxa de Conversão (Vendas/Disparos):</strong> {conversaoDisp}
            </Typography>
            <Typography sx={{ mb: espacamentoLinhas }}>
              <strong>Taxa de Conversão (Vendas/Respostas):</strong> {conversaoResp}
            </Typography>
          </Grid>
        </Grid>
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
