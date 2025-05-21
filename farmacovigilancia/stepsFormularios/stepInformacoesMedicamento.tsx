import { Box, Grid, Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const useStyles = makeStyles({
  gridItem: { margin: 8 }
});

interface FormData {
  nome: string;
  dosagem: string;
  formaFarmaceutica: string;
  fabricante: string;
  enderecoFabricante: string;
  lote: string;
  dataFabrico: string;
  dataValidade: string;
  tiposAnalise: {
    inspecaoFisica: boolean;
    desintegracao: boolean;
    cromatografia: boolean;
    outro: boolean;
  };
  outroTipoAnalise: string;
}

export default function StepInformacoesMedicamento() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    dosagem: '',
    formaFarmaceutica: '',
    fabricante: '',
    enderecoFabricante: '',
    lote: '',
    dataFabrico: '',
    dataValidade: '',
    tiposAnalise: {
      inspecaoFisica: false,
      desintegracao: false,
      cromatografia: false,
      outro: false
    },
    outroTipoAnalise: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        tiposAnalise: {
          ...prev.tiposAnalise,
          [e.target.name]: e.target.checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  useEffect(() => {
    dispatch({
      type: 'dadosMedicamento',
      payload: { dadosMedicamento: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box>
      <Typography variant="h5" style={{ margin: 15 }}>
        INFORMAÇÕES DO MEDICAMENTO
      </Typography>

      <Grid container>
        <Grid xs={12} md={6} item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Nome do Medicamento"
            fullWidth
            size="small"
            name="nome"
            variant="outlined"
            onChange={handleChange}
            value={formData.nome}
          />
        </Grid>

        <Grid xs={12} md={3} item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Dosagem"
            fullWidth
            size="small"
            name="dosagem"
            variant="outlined"
            onChange={handleChange}
            value={formData.dosagem}
          />
        </Grid>

        <Grid xs={12} md={3} item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Forma Farmacêutica"
            fullWidth
            size="small"
            name="formaFarmaceutica"
            variant="outlined"
            onChange={handleChange}
            value={formData.formaFarmaceutica}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={12} md={6} item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Fabricante"
            fullWidth
            size="small"
            name="fabricante"
            variant="outlined"
            onChange={handleChange}
            value={formData.fabricante}
          />
        </Grid>

        <Grid xs={12} md={6} item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Endereço do Fabricante"
            fullWidth
            size="small"
            name="enderecoFabricante"
            variant="outlined"
            onChange={handleChange}
            value={formData.enderecoFabricante}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={12} md={4} item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Lote"
            fullWidth
            size="small"
            name="lote"
            variant="outlined"
            onChange={handleChange}
            value={formData.lote}
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
            onChange={handleChange}
            value={formData.dataFabrico}
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
            onChange={handleChange}
            value={formData.dataValidade}
          />
        </Grid>
      </Grid>

      <Box style={{ margin: 15 }}>
        <Typography variant="subtitle1" style={{ marginBottom: 10 }}>
          Tipo de Análise Solicitada
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.tiposAnalise.inspecaoFisica}
                onChange={handleChange}
                name="inspecaoFisica"
              />
            }
            label="Inspeção Física e Visual"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.tiposAnalise.desintegracao}
                onChange={handleChange}
                name="desintegracao"
              />
            }
            label="Desintegração"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.tiposAnalise.cromatografia}
                onChange={handleChange}
                name="cromatografia"
              />
            }
            label="Cromatografia em Camada Fina"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.tiposAnalise.outro}
                onChange={handleChange}
                name="outro"
              />
            }
            label="Outro"
          />
        </FormGroup>

        {formData.tiposAnalise.outro && (
          <TextField
            type="text"
            label="Especifique outro tipo de análise"
            fullWidth
            size="small"
            name="outroTipoAnalise"
            variant="outlined"
            onChange={handleChange}
            value={formData.outroTipoAnalise}
            style={{ marginTop: 10 }}
          />
        )}
      </Box>
    </Box>
  );
}