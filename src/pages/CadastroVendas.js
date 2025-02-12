import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  Typography, 
  Grid, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  Radio, 
  FormControlLabel,
  Snackbar,
  Menu,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import api from '../api'; // Importa a instância centralizada

const CadastroVendas = () => {
  // Preenche a data com a data atual
  const today = new Date().toISOString().split('T')[0];
  const [dataVenda, setDataVenda] = useState(today);
  const initialVendaForm = {
    status: '',
    cliente: '',
    telefone: '',
    dia: '',
    periodo: '',
    pagamento: '',
    end: '', // Será mapeado para o campo "endereco" no backend
    cpf: '',
    email: '',
    observacao: ''
  };

  const [vendaForm, setVendaForm] = useState(initialVendaForm);
  const [sales, setSales] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [groupedView, setGroupedView] = useState(false);
  // Estados para o menu de seleção das opções do "riscado"
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeCardKey, setActiveCardKey] = useState(null);

  // Busca as vendas do dia selecionado (ou todas em modo agrupado)
  useEffect(() => {
    if (groupedView) {
      api.get('/api/vendas')
        .then(response => setSales(response.data))
        .catch(error => console.error(error));
    } else {
      if (dataVenda) {
        api.get(`/api/vendas?data=${dataVenda}`)
          .then(response => setSales(response.data))
          .catch(error => console.error(error));
      } else {
        setSales([]);
      }
    }
  }, [dataVenda, groupedView]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendaForm(prev => ({ ...prev, [name]: value }));
  };

  // Formata o campo "Dia": converte "2302" para "23/02"
  const handleDiaBlur = () => {
    if (vendaForm.dia && vendaForm.dia.length === 4 && !vendaForm.dia.includes('/')) {
      const formatted = vendaForm.dia.slice(0, 2) + '/' + vendaForm.dia.slice(2);
      setVendaForm(prev => ({ ...prev, dia: formatted }));
    }
  };

  // Cadastra ou atualiza a venda. Note que os campos "riscado" e "mensagem" são definidos:
  // em nova venda, ambos são zerados; em edição, o valor atual é mantido.
  const handleAddOrUpdateVenda = (e) => {
    e.preventDefault();
    if (!dataVenda) {
      alert("Selecione a data da venda primeiro.");
      return;
    }
    if (editingIndex !== null) {
      const updatedVenda = {
        ...vendaForm,
        cliente: `Cliente ${editingIndex + 1}: ${vendaForm.cliente}`,
        riscado: sales[editingIndex].riscado || 0,
        mensagem: sales[editingIndex].mensagem || null
      };
      api.put(`/api/vendas/${vendaForm.id}`, { ...updatedVenda, data_venda: dataVenda })
        .then(response => {
          const updatedSales = sales.map((sale, index) =>
            index === editingIndex ? updatedVenda : sale
          );
          setSales(updatedSales);
        })
        .catch(error => console.error(error));
      setEditingIndex(null);
    } else {
      const novaVenda = {
        ...vendaForm,
        cliente: `Cliente ${sales.length + 1}: ${vendaForm.cliente}`,
        riscado: 0,
        mensagem: null
      };
      api.post('/api/vendas', { ...novaVenda, data_venda: dataVenda })
        .then(response => {
          novaVenda.id = response.data.id;
          setSales(prev => [...prev, novaVenda]);
        })
        .catch(error => console.error(error));
    }
    setVendaForm(initialVendaForm);
  };

  const handleEditVenda = (index) => {
    let selectedVenda = sales[index];
    let nomeCliente = selectedVenda.cliente;
    const prefixo = `Cliente ${index + 1}: `;
    if (nomeCliente.startsWith(prefixo)) {
      nomeCliente = nomeCliente.slice(prefixo.length);
    }
    setVendaForm({ ...selectedVenda, cliente: nomeCliente });
    setEditingIndex(index);
  };

  // Ao clicar no botão de "riscado", se a venda já estiver marcada, remove o efeito;
  // caso contrário, abre um menu para que o usuário selecione a mensagem.
  const handleToggleStyle = (key, event) => {
    const sale = sales.find(s => s.id === key);
    if (sale && sale.riscado) {
      // Desmarcar: atualiza o registro no backend para remover o toggle
      api.put(`/api/vendas/${sale.id}`, { ...sale, riscado: 0, mensagem: null })
        .then(response => {
          const updatedSales = sales.map(s => s.id === sale.id ? { ...s, riscado: 0, mensagem: null } : s);
          setSales(updatedSales);
        })
        .catch(error => console.error(error));
    } else {
      // Abrir o menu para selecionar a mensagem
      setActiveCardKey(key);
      setMenuAnchorEl(event.currentTarget);
    }
  };

  // Trata a seleção de uma opção do menu, atualizando o registro no backend
  const handleSelectOption = (option) => {
    if (activeCardKey != null) {
      const sale = sales.find(s => s.id === activeCardKey);
      if (sale) {
        api.put(`/api/vendas/${sale.id}`, { ...sale, riscado: 1, mensagem: option })
          .then(response => {
            const updatedSales = sales.map(s => s.id === sale.id ? { ...s, riscado: 1, mensagem: option } : s);
            setSales(updatedSales);
          })
          .catch(error => console.error(error));
      }
    }
    setMenuAnchorEl(null);
    setActiveCardKey(null);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveCardKey(null);
  };

  const handleCopyVenda = (venda) => {
    const vendaText = 
`Status: ${venda.status}
${venda.cliente}
Telefone: ${venda.telefone}
Dia: ${venda.dia}
Periodo: ${venda.periodo}
Pagamento: ${venda.pagamento}
End: ${venda.end}
CPF: ${venda.cpf}
E-mail: ${venda.email}
${venda.observacao ? 'Observação: ' + venda.observacao : ''}`;
    navigator.clipboard.writeText(vendaText)
      .then(() => setSnackbarOpen(true))
      .catch(err => console.error("Erro ao copiar:", err));
  };

  // Agrupa as vendas pelo campo "data_venda"
  const getGroupedSales = () => {
    return sales.reduce((groups, sale) => {
      const data = sale.data_venda;
      if (!groups[data]) groups[data] = [];
      groups[data].push(sale);
      return groups;
    }, {});
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: '2rem' }}>
      <Typography variant="h5" gutterBottom>Cadastro de Vendas</Typography>
      
      {/* Campo de data já preenchido com a data atual */}
      {!groupedView && (
        <TextField
          label="Data da Venda"
          type="date"
          value={dataVenda}
          onChange={(e) => setDataVenda(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          sx={{ fontSize: '14px' }}
        />
      )}

      <form onSubmit={handleAddOrUpdateVenda}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={editingIndex !== null ? `Cliente ${editingIndex + 1}` : `Cliente ${sales.length + 1}`}
              name="cliente"
              value={vendaForm.cliente}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={vendaForm.status}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ fontSize: '14px' }}
            >
              <MenuItem value="Vendido por IA">Vendido por IA</MenuItem>
              <MenuItem value="Vendido Manualmente">Vendido Manualmente</MenuItem>
              <MenuItem value="Conf Dados">Conf Dados</MenuItem>
              <MenuItem value="Conf Dia/Periodo">Conf Dia/Periodo</MenuItem>
              <MenuItem value="Conf Pagamento">Conf Pagamento</MenuItem>
              <MenuItem value="Trocar depois">Trocar depois</MenuItem>
              <MenuItem value="Já Trocou">Já Trocou</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefone"
              name="telefone"
              type="tel"
              value={vendaForm.telefone}
              onChange={handleInputChange}
              fullWidth
              required
              placeholder="+55..."
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dia"
              name="dia"
              value={vendaForm.dia}
              onChange={handleInputChange}
              onBlur={handleDiaBlur}
              fullWidth
              required
              placeholder="Ex: 2302"
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth required>
              <FormLabel component="legend" sx={{ fontSize: '14px' }}>Periodo</FormLabel>
              <RadioGroup row name="periodo" value={vendaForm.periodo} onChange={handleInputChange}>
                <FormControlLabel value="Manhã" control={<Radio />} label="Manhã" />
                <FormControlLabel value="Tarde" control={<Radio />} label="Tarde" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth required>
              <FormLabel component="legend" sx={{ fontSize: '14px' }}>Pagamento</FormLabel>
              <RadioGroup row name="pagamento" value={vendaForm.pagamento} onChange={handleInputChange}>
                <FormControlLabel value="Dinheiro" control={<Radio />} label="Dinheiro" />
                <FormControlLabel value="PIX" control={<Radio />} label="PIX" />
                <FormControlLabel value="Debito" control={<Radio />} label="Debito" />
                <FormControlLabel value="Cartão 1x" control={<Radio />} label="Cartão 1x" />
                <FormControlLabel value="Cartão 2x" control={<Radio />} label="Cartão 2x" />
                <FormControlLabel value="Cartão 3x" control={<Radio />} label="Cartão 3x" />
                <FormControlLabel value="Outro" control={<Radio />} label="Outro" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="End"
              name="end"
              value={vendaForm.end}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CPF"
              name="cpf"
              value={vendaForm.cpf}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={vendaForm.email}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Observação"
              name="observacao"
              value={vendaForm.observacao}
              onChange={handleInputChange}
              fullWidth
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              {editingIndex !== null ? "Atualizar Venda" : "Adicionar Venda"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ marginTop: '1rem' }}>
        <Button variant="outlined" onClick={() => setGroupedView(prev => !prev)}>
          {groupedView ? "Ver Vendas do Dia Selecionado" : "Ver Vendas Agrupadas"}
        </Button>
      </Box>

      {/* Se não houver vendas no dia selecionado, exibe mensagem informativa */}
      {!groupedView && sales.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Nenhuma venda cadastrada ainda.
        </Typography>
      )}

      <Box sx={{ marginTop: '2rem' }}>
        <Typography variant="h6" gutterBottom>Vendas Cadastradas</Typography>
        {groupedView ? (
          Object.entries(getGroupedSales())
            .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
            .map(([data_venda, vendas]) => (
              <Box key={data_venda} sx={{ marginBottom: '2rem' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{data_venda}</Typography>
                {vendas.map((venda, index) => {
                  const key = venda.id ? venda.id : index;
                  return (
                    <Card key={key} sx={{ marginTop: '1rem', position: 'relative', padding: '1rem' }}>
                      {venda.riscado ? (
                        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                          {venda.mensagem}
                        </Typography>
                      ) : null}
                      <CardContent sx={venda.riscado ? { textDecoration: 'line-through', color: 'gray' } : {}}>
                        <Typography variant="subtitle1">{venda.cliente}</Typography>
                        <Typography>Status: {venda.status}</Typography>
                        <Typography>Telefone: {venda.telefone}</Typography>
                        <Typography>Dia: {venda.dia}</Typography>
                        <Typography>Periodo: {venda.periodo}</Typography>
                        <Typography>Pagamento: {venda.pagamento}</Typography>
                        <Typography>End: {venda.end}</Typography>
                        <Typography>CPF: {venda.cpf}</Typography>
                        <Typography>E-mail: {venda.email}</Typography>
                        {venda.observacao && (
                          <Typography variant="body2" color="textSecondary">
                            Observação: {venda.observacao}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ position: 'absolute', top: 0, right: 0, gap: 1 }}>
                        <Tooltip title="Editar venda">
                          <IconButton onClick={() => handleEditVenda(sales.findIndex(s => s.id === venda.id))}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={venda.riscado ? "Desmarcar venda lançada" : "Marcar venda como lançada"}>
                          <IconButton onClick={(e) => handleToggleStyle(venda.id, e)}>
                            <FormatStrikethroughIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copiar dados da venda">
                          <IconButton onClick={() => handleCopyVenda(venda)}>
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>
            ))
        ) : (
          sales.map((venda, index) => {
            const key = venda.id ? venda.id : index;
            return (
              <Card key={key} sx={{ marginTop: '1rem', position: 'relative', padding: '1rem' }}>
                {venda.riscado ? (
                  <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                    {venda.mensagem}
                  </Typography>
                ) : null}
                <CardContent sx={venda.riscado ? { textDecoration: 'line-through', color: 'gray' } : {}}>
                  <Typography variant="subtitle1">{venda.cliente}</Typography>
                  <Typography>Status: {venda.status}</Typography>
                  <Typography>Telefone: {venda.telefone}</Typography>
                  <Typography>Dia: {venda.dia}</Typography>
                  <Typography>Periodo: {venda.periodo}</Typography>
                  <Typography>Pagamento: {venda.pagamento}</Typography>
                  <Typography>End: {venda.end}</Typography>
                  <Typography>CPF: {venda.cpf}</Typography>
                  <Typography>E-mail: {venda.email}</Typography>
                  {venda.observacao && (
                    <Typography variant="body2" color="textSecondary">
                      Observação: {venda.observacao}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ position: 'absolute', top: 0, right: 0, gap: 1 }}>
                  <Tooltip title="Editar venda">
                    <IconButton onClick={() => handleEditVenda(sales.findIndex(s => s.id === venda.id))}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={venda.riscado ? "Desmarcar venda lançada" : "Marcar venda como lançada"}>
                    <IconButton onClick={(e) => handleToggleStyle(venda.id, e)}>
                      <FormatStrikethroughIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copiar dados da venda">
                    <IconButton onClick={() => handleCopyVenda(venda)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            );
          })
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Dados copiados para o clipboard!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {["Lançado no sistema", "Env para Jessica", "Env para Ana", "Env para outro"].map(option => (
          <MenuItem key={option} onClick={() => handleSelectOption(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CadastroVendas; 