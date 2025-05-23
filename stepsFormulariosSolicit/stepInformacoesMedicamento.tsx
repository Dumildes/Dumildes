// StepInformacoesUnificado.tsx
import { Box, Grid, Typography, FormControlLabel, Checkbox, Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
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
  }
});

interface MedicamentoFormData {
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

  // Estados para formulários
  const [medicamentoData, setMedicamentoData] = useState<MedicamentoFormData>({
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

  const [tecnologiaData, setTecnologiaData] = useState<TecnologiaFormData>({
    nome: '',
    fabricante: '',
    enderecoFabricante: '',
    lote: '',
    dataFabrico: '',
    dataValidade: '',
    tipoAnalise: ''
  });

  // Handlers para campos dos formulários
  const handleMedicamentoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMedicamentoData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTecnologiaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTecnologiaData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handlers para checkboxes modificados para serem mutuamente exclusivos
  const handleMedicamentoCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsMedicamentoSelected(isChecked);
    
    // Se marcando Medicamento, desmarcar Tecnologia
    if (isChecked) {
      setIsTecnologiaSelected(false);
      
      // Limpar dados de Tecnologia ao desmarcar
      setTecnologiaData({
        nome: '',
        fabricante: '',
        enderecoFabricante: '',
        lote: '',
        dataFabrico: '',
        dataValidade: '',
        tipoAnalise: ''
      });
    }

    // Se desmarcando Medicamento, limpar seus dados
    if (!isChecked) {
      setMedicamentoData({
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
    }
  };

  const handleTecnologiaCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsTecnologiaSelected(isChecked);
    
    // Se marcando Tecnologia, desmarcar Medicamento
    if (isChecked) {
      setIsMedicamentoSelected(false);
      
      // Limpar dados de Medicamento ao desmarcar
      setMedicamentoData({
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
    }

    // Se desmarcando Tecnologia, limpar seus dados
    if (!isChecked) {
      setTecnologiaData({
        nome: '',
        fabricante: '',
        enderecoFabricante: '',
        lote: '',
        dataFabrico: '',
        dataValidade: '',
        tipoAnalise: ''
      });
    }
  };

  // Efeitos para dispatch
  useEffect(() => {
    dispatch({
      type: 'dadosMedicamento',
      payload: { dadosMedicamento: isMedicamentoSelected ? medicamentoData : null }
    });
  }, [medicamentoData, dispatch, isMedicamentoSelected]);

  useEffect(() => {
    dispatch({
      type: 'dadosTecnologiaSaude',
      payload: { dadosTecnologiaSaude: isTecnologiaSelected ? tecnologiaData : null }
    });
  }, [tecnologiaData, dispatch, isTecnologiaSelected]);

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

      {/* Seção de Medicamento */}
      {isMedicamentoSelected && (
        <Box className={classes.formBox}>
          <Typography variant="h6" className={classes.sectionTitle}>
            INFORMAÇÕES DO MEDICAMENTO
          </Typography>

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
                onChange={handleMedicamentoChange}
                value={medicamentoData.nome}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.dosagem}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.formaFarmaceutica}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.fabricante}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.lote}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.dataFabrico}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.dataValidade}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.enderecoFabricante}
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
                onChange={handleMedicamentoChange}
                value={medicamentoData.tipoAnalise}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Seção de Tecnologia de Saúde */}
      {isTecnologiaSelected && (
        <Box className={classes.formBox}>
          <Typography variant="h6" className={classes.sectionTitle}>
            INFORMAÇÕES DA TECNOLOGIA DE SAÚDE
          </Typography>

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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.nome}
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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.fabricante}
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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.enderecoFabricante}
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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.lote}
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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.dataFabrico}
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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.dataValidade}
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
                onChange={handleTecnologiaChange}
                value={tecnologiaData.tipoAnalise}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}