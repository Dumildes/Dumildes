// StepInformacoesUnificado.tsx
import { Box, Grid, Typography, FormControlLabel, Checkbox, Paper, Button, IconButton } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';

const useStyles = makeStyles({
  gridContainer: {
    marginBottom: 24 // Adiciona espaço entre as linhas
  },
  gridItem: {
    margin: 8,
    paddingRight: 16 // Adiciona espaçamento horizontal entre itens
  },
  paper: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  },
  formBox: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    position: 'relative'
  },
  sectionTitle: {
    margin: 15,
    marginBottom: 30,
    marginTop: 30,
    fontWeight: 600
  },
  mainTitle: {
    margin: 15,
    marginBottom: 20,
    fontWeight: 600
  },
  checkboxTitle: {
    marginBottom: 8,
    fontWeight: 600
  },
  addButton: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#f44336'
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 40
  },
  itemNumber: {
    fontWeight: 600,
    color: '#1976d2'
  }
});

interface MedicamentoFormData {
  id: string;
  nome: string;
  dosagem: string;
  formaFarmaceutica: string;
  fabricante: string;
  enderecoFabricante: string;
  lote: string;
  dataFabrico: string;
  dataValidade: string;
  tipoAnalise: string;
}

interface TecnologiaFormData {
  id: string;
  nome: string;
  fabricante: string;
  enderecoFabricante: string;
  lote: string;
  dataFabrico: string;
  dataValidade: string;
  tipoAnalise: string;
}

export default function StepInformacoesUnificado() {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Estados para checkboxes
  const [isMedicamentoSelected, setIsMedicamentoSelected] = useState(false);
  const [isTecnologiaSelected, setIsTecnologiaSelected] = useState(false);

  // Estados para arrays de formulários
  const [medicamentos, setMedicamentos] = useState<MedicamentoFormData[]>([]);
  const [tecnologias, setTecnologias] = useState<TecnologiaFormData[]>([]);

  // Função para criar novo medicamento vazio
  const createEmptyMedicamento = (): MedicamentoFormData => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    nome: '',
    dosagem: '',
    formaFarmaceutica: '',
    fabricante: '',
    enderecoFabricante: '',
    lote: '',
    dataFabrico: '',
    dataValidade: '',
    tipoAnalise: ''
  });

  // Função para criar nova tecnologia vazia
  const createEmptyTecnologia = (): TecnologiaFormData => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    nome: '',
    fabricante: '',
    enderecoFabricante: '',
    lote: '',
    dataFabrico: '',
    dataValidade: '',
    tipoAnalise: ''
  });

  // Handlers para adicionar novos itens
  const handleAddMedicamento = () => {
    setMedicamentos(prev => [...prev, createEmptyMedicamento()]);
  };

  const handleAddTecnologia = () => {
    setTecnologias(prev => [...prev, createEmptyTecnologia()]);
  };

  // Handlers para remover itens
  const handleRemoveMedicamento = (id: string) => {
    setMedicamentos(prev => prev.filter(item => item.id !== id));
  };

  const handleRemoveTecnologia = (id: string) => {
    setTecnologias(prev => prev.filter(item => item.id !== id));
  };

  // Handlers para campos dos formulários
  const handleMedicamentoChange = (id: string, field: string, value: string) => {
    setMedicamentos(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleTecnologiaChange = (id: string, field: string, value: string) => {
    setTecnologias(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Handlers para checkboxes modificados para serem mutuamente exclusivos
  const handleMedicamentoCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsMedicamentoSelected(isChecked);
    
    // Se marcando Medicamento, desmarcar Tecnologia
    if (isChecked) {
      setIsTecnologiaSelected(false);
      setTecnologias([]);
      // Adicionar primeiro medicamento se não houver nenhum
      if (medicamentos.length === 0) {
        setMedicamentos([createEmptyMedicamento()]);
      }
    } else {
      // Se desmarcando Medicamento, limpar seus dados
      setMedicamentos([]);
    }
  };

  const handleTecnologiaCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsTecnologiaSelected(isChecked);
    
    // Se marcando Tecnologia, desmarcar Medicamento
    if (isChecked) {
      setIsMedicamentoSelected(false);
      setMedicamentos([]);
      // Adicionar primeira tecnologia se não houver nenhuma
      if (tecnologias.length === 0) {
        setTecnologias([createEmptyTecnologia()]);
      }
    } else {
      // Se desmarcando Tecnologia, limpar seus dados
      setTecnologias([]);
    }
  };

  // Efeitos para dispatch
  useEffect(() => {
    dispatch({
      type: 'dadosMedicamento',
      payload: { dadosMedicamento: isMedicamentoSelected && medicamentos.length > 0 ? medicamentos : null }
    });
  }, [medicamentos, dispatch, isMedicamentoSelected]);

  useEffect(() => {
    dispatch({
      type: 'dadosTecnologiaSaude',
      payload: { dadosTecnologiaSaude: isTecnologiaSelected && tecnologias.length > 0 ? tecnologias : null }
    });
  }, [tecnologias, dispatch, isTecnologiaSelected]);

  return (
    <Box>
      <Paper className={classes.paper}>
        <Typography variant="h6">
          Tipo de Produto
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={isMedicamentoSelected}
              onChange={handleMedicamentoCheckboxChange}
              name="medicamentoCheckbox"
              color="primary"
            />
          }
          label="Medicamento"
        />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isTecnologiaSelected}
                onChange={handleTecnologiaCheckboxChange}
                name="tecnologiaCheckbox"
                color="primary"
              />
            }
            label="Tecnologia de Saúde"
          />
        </Box>
      </Paper>

      {/* Seção de Medicamentos */}
      {isMedicamentoSelected && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className={classes.sectionTitle}>
              INFORMAÇÕES DOS MEDICAMENTOS
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMedicamento}
              className={classes.addButton}
            >
              Adicionar Medicamento
            </Button>
          </Box>

          {medicamentos.map((medicamento, index) => (
            <Box key={medicamento.id} className={classes.formBox}>
              {medicamentos.length > 1 && (
                <IconButton
                  className={classes.deleteButton}
                  onClick={() => handleRemoveMedicamento(medicamento.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}

              <Box className={classes.itemHeader}>
                <Typography variant="subtitle1" className={classes.itemNumber}>
                  Medicamento {index + 1}
                </Typography>
              </Box>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Nome do Medicamento"
                    fullWidth
                    size="small"
                    name="nome"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'nome', e.target.value)}
                    value={medicamento.nome}
                  />
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Dosagem"
                    fullWidth
                    size="small"
                    name="dosagem"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'dosagem', e.target.value)}
                    value={medicamento.dosagem}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Forma Farmacêutica"
                    fullWidth
                    size="small"
                    name="formaFarmaceutica"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'formaFarmaceutica', e.target.value)}
                    value={medicamento.formaFarmaceutica}
                  />
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Fabricante"
                    fullWidth
                    size="small"
                    name="fabricante"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'fabricante', e.target.value)}
                    value={medicamento.fabricante}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md={4} item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Lote"
                    fullWidth
                    size="small"
                    name="lote"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'lote', e.target.value)}
                    value={medicamento.lote}
                  />
                </Grid>

                <Grid xs={12} md={4} item className={classes.gridItem}>
                  <TextField
                    required
                    type="date"
                    label="Data de Fabricação"
                    fullWidth
                    size="small"
                    name="dataFabrico"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'dataFabrico', e.target.value)}
                    value={medicamento.dataFabrico}
                  />
                </Grid>

                <Grid xs={12} md={4} item className={classes.gridItem}>
                  <TextField
                    required
                    type="date"
                    label="Data de Validade"
                    fullWidth
                    size="small"
                    name="dataValidade"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'dataValidade', e.target.value)}
                    value={medicamento.dataValidade}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    type="text"
                    label="Endereço do Fabricante"
                    fullWidth
                    size="small"
                    name="enderecoFabricante"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'enderecoFabricante', e.target.value)}
                    value={medicamento.enderecoFabricante}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    type="text"
                    label="Tipo de Análise"
                    fullWidth
                    size="small"
                    name="tipoAnalise"
                    variant="outlined"
                    onChange={(e) => handleMedicamentoChange(medicamento.id, 'tipoAnalise', e.target.value)}
                    value={medicamento.tipoAnalise}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      {/* Seção de Tecnologias de Saúde */}
      {isTecnologiaSelected && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className={classes.sectionTitle}>
              INFORMAÇÕES DAS TECNOLOGIAS DE SAÚDE
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTecnologia}
              className={classes.addButton}
            >
              Adicionar Tecnologia
            </Button>
          </Box>

          {tecnologias.map((tecnologia, index) => (
            <Box key={tecnologia.id} className={classes.formBox}>
              {tecnologias.length > 1 && (
                <IconButton
                  className={classes.deleteButton}
                  onClick={() => handleRemoveTecnologia(tecnologia.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}

              <Box className={classes.itemHeader}>
                <Typography variant="subtitle1" className={classes.itemNumber}>
                  Tecnologia de Saúde {index + 1}
                </Typography>
              </Box>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Nome do Produto"
                    fullWidth
                    size="small"
                    name="nome"
                    variant="outlined"
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'nome', e.target.value)}
                    value={tecnologia.nome}
                  />
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Fabricante"
                    fullWidth
                    size="small"
                    name="fabricante"
                    variant="outlined"
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'fabricante', e.target.value)}
                    value={tecnologia.fabricante}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Endereço do Fabricante"
                    fullWidth
                    size="small"
                    name="enderecoFabricante"
                    variant="outlined"
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'enderecoFabricante', e.target.value)}
                    value={tecnologia.enderecoFabricante}
                  />
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="text"
                    label="Lote"
                    fullWidth
                    size="small"
                    name="lote"
                    variant="outlined"
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'lote', e.target.value)}
                    value={tecnologia.lote}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="date"
                    label="Data de Fabricação"
                    fullWidth
                    size="small"
                    name="dataFabrico"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'dataFabrico', e.target.value)}
                    value={tecnologia.dataFabrico}
                  />
                </Grid>

                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    required
                    type="date"
                    label="Data de Validade"
                    fullWidth
                    size="small"
                    name="dataValidade"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'dataValidade', e.target.value)}
                    value={tecnologia.dataValidade}
                  />
                </Grid>
              </Grid>

              <Grid container className={classes.gridContainer}>
                <Grid xs={12} md item className={classes.gridItem}>
                  <TextField
                    type="text"
                    label="Tipo de Análise"
                    fullWidth
                    size="small"
                    name="tipoAnalise"
                    variant="outlined"
                    onChange={(e) => handleTecnologiaChange(tecnologia.id, 'tipoAnalise', e.target.value)}
                    value={tecnologia.tipoAnalise}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}