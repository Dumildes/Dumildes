import { Box, Grid, Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  gridItem: { margin: 8 }
});

export default function StepDadosRequerente() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    genero: '',
    numeroRegistro: '',
    endereco: '',
    telefone: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'dadosSolicitante',
      payload: { dadosSolicitante: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box>
      <Typography variant="h5" style={{ margin: 15 }}>
        DADOS DO SOLICITANTE
      </Typography>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Nome Completo"
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
            type="date"
            label="Data de Nascimento"
            fullWidth
            size="small"
            name="dataNascimento"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={formData.dataNascimento}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Número de Registro"
            fullWidth
            size="small"
            name="numeroRegistro"
            variant="outlined"
            onChange={handleChange}
            value={formData.numeroRegistro}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="email"
            label="Email"
            fullWidth
            size="small"
            name="email"
            variant="outlined"
            onChange={handleChange}
            value={formData.email}
          />
        </Grid>
      </Grid>

      <Grid container>
        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="text"
            label="Endereço"
            fullWidth
            size="small"
            name="endereco"
            variant="outlined"
            onChange={handleChange}
            value={formData.endereco}
          />
        </Grid>

        <Grid xs={12} md item className={classes.gridItem}>
          <TextField
            required
            type="tel"
            label="Telefone"
            fullWidth
            size="small"
            name="telefone"
            variant="outlined"
            onChange={handleChange}
            value={formData.telefone}
          />
        </Grid>
      </Grid>
    </Box>
  );
}