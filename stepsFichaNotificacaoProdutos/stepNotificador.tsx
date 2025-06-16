import { Box, Grid, Typography, Paper } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      padding: theme.spacing(2)
    },
    paper: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3)
    },
    mainTitle: {
      marginBottom: theme.spacing(3),
      fontWeight: 500
    },
    sectionTitle: {
      marginBottom: theme.spacing(2),
      fontWeight: 500
    }
  })
);

interface FormData {
  nomeApelidoNotificador: string;
  categoriaProfissional: string;
  telefone: string;
  email: string;
  dataNotificacao: string;
}

export default function Notificador() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    nomeApelidoNotificador: '',
    categoriaProfissional: '',
    telefone: '',
    email: '',
    dataNotificacao: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'dadosNotificador',
      payload: { dadosNotificador: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box className={classes.formContainer}>

      {/* Dados do Notificador */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Dados do Notificador
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Nome e apelido do notificador"
              fullWidth
              size="small"
              name="nomeApelidoNotificador"
              variant="outlined"
              onChange={handleChange}
              value={formData.nomeApelidoNotificador}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Categoria profissional"
              fullWidth
              size="small"
              name="categoriaProfissional"
              variant="outlined"
              onChange={handleChange}
              value={formData.categoriaProfissional}
              placeholder="Ex: Médico, Farmacêutico, Enfermeiro"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Telefone"
              fullWidth
              size="small"
              name="telefone"
              variant="outlined"
              type="tel"
              onChange={handleChange}
              value={formData.telefone}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Email"
              fullWidth
              size="small"
              name="email"
              variant="outlined"
              type="email"
              onChange={handleChange}
              value={formData.email}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              label="Data da notificação"
              fullWidth
              size="small"
              name="dataNotificacao"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              value={formData.dataNotificacao}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}