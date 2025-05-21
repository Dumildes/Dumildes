import { Box, Grid, Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  gridItem: { margin: 8 }
});

export default function StepInformacoesMedicamento() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        <Grid xs={12} md item className={classes.gridItem}>
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

        <Grid xs={12} md item className={classes.gridItem}>
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
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
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

        <Grid xs={12} md item className={classes.gridItem}>
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
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
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
            onChange={handleChange}
            value={formData.dataFabrico}
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
            onChange={handleChange}
            value={formData.dataValidade}
          />
        </Grid>
      </Grid>
    </Box>
  );
}