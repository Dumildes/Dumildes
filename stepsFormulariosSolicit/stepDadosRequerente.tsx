import { Box, Grid, Typography, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useState, useEffect, ChangeEvent } from 'react';

const useStyles = makeStyles({
  gridItem: { margin: 8 }
});

interface FormData {
  nome: string;
  dataNascimento: string;
  genero: string;
  numeroRegistro: string;
  endereco: string;
  telefone: string;
  email: string;
  // Campos específicos para cada tipo
  nif?: string;
  licencaComercial?: string;
  alvara?: string;
  registroComercial?: string;
  nomeRepresentante?: string;
}

interface Props {
  tipoSolicitante: string;
}

export default function StepDadosRequerente({ tipoSolicitante }: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    dataNascimento: '',
    genero: '',
    numeroRegistro: '',
    endereco: '',
    telefone: '',
    email: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const renderCamposEspecificos = () => {
    switch (tipoSolicitante) {
      case 'distribuidor':
        return (
          <>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="NIF"
                fullWidth
                size="small"
                name="nif"
                variant="outlined"
                onChange={handleChange}
                value={formData.nif || ''}
              />
            </Grid>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Licença Comercial"
                fullWidth
                size="small"
                name="licencaComercial"
                variant="outlined"
                onChange={handleChange}
                value={formData.licencaComercial || ''}
              />
            </Grid>
          </>
        );

      case 'importador':
        return (
          <>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="NIF"
                fullWidth
                size="small"
                name="nif"
                variant="outlined"
                onChange={handleChange}
                value={formData.nif || ''}
              />
            </Grid>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Alvará"
                fullWidth
                size="small"
                name="alvara"
                variant="outlined"
                onChange={handleChange}
                value={formData.alvara || ''}
              />
            </Grid>
          </>
        );

      case 'pessoaColetiva':
        return (
          <>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Registro Comercial"
                fullWidth
                size="small"
                name="registroComercial"
                variant="outlined"
                onChange={handleChange}
                value={formData.registroComercial || ''}
              />
            </Grid>
            <Grid xs={12} md item className={classes.gridItem}>
              <TextField
                required
                type="text"
                label="Nome do Representante Legal"
                fullWidth
                size="small"
                name="nomeRepresentante"
                variant="outlined"
                onChange={handleChange}
                value={formData.nomeRepresentante || ''}
              />
            </Grid>
          </>
        );

      case 'pessoaSingular':
        return (
          <Grid xs={12} md item className={classes.gridItem}>
            <TextField
              required
              type="text"
              label="NIF"
              fullWidth
              size="small"
              name="nif"
              variant="outlined"
              onChange={handleChange}
              value={formData.nif || ''}
            />
          </Grid>
        );

      default:
        return null;
    }
  };

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
        {renderCamposEspecificos()}
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

      <Grid container>
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
    </Box>
  );
}