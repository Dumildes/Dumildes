import { Box, Grid, Typography, Paper, FormControlLabel, Checkbox } from "@material-ui/core";
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
    },
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1)
    },
    checkboxRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(2)
    }
  })
);

interface FormData {
  // Dados da Unidade de Saúde
  unidadeSanitaria: string;
  servico: string;
  localidade: string;
  tipoInformacao: 'inicial' | 'complementar' | '';

  // Dados do Paciente
  nomeApelido: string;
  idade: string;
  sexo: string;
  peso: string;
  altura: string;

  // Gestante (exclusivo)
  gestante: 'sim' | 'nao' | '';

  // Raça (exclusivo)
  raca: 'negra' | 'branca' | 'outras' | '';

  // Antecedentes (múltiplos)
  antecedentes: {
    medicos: boolean;
    serologicos: boolean;
    psiquiatricos: boolean;
    cirurgicos: boolean;
    abusosDependencia: boolean;
    reacoesAnteriores: boolean;
    alergiasConhecidas: boolean;
    outrosDetalhes: string;
  };

  // Contato
  endereco: string;
  telefone: string;
  email: string;
}

export default function DadosUnidadeSaudePaciente() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    unidadeSanitaria: '',
    servico: '',
    localidade: '',
    tipoInformacao: '',
    nomeApelido: '',
    idade: '',
    sexo: '',
    peso: '',
    altura: '',
    gestante: '',
    raca: '',
    antecedentes: {
      medicos: false,
      serologicos: false,
      psiquiatricos: false,
      cirurgicos: false,
      abusosDependencia: false,
      reacoesAnteriores: false,
      alergiasConhecidas: false,
      outrosDetalhes: ''
    },
    endereco: '',
    telefone: '',
    email: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckboxChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      antecedentes: {
        ...prev.antecedentes,
        [field]: e.target.checked
      }
    }));
  };

  const handleExclusiveChange = (field: 'gestante' | 'raca' | 'tipoInformacao', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] === value ? '' : value
    }));
  };

  const handleAntecedenteTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      antecedentes: {
        ...prev.antecedentes,
        outrosDetalhes: e.target.value
      }
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'dadosUnidadeSaudePaciente',
      payload: { dadosUnidadeSaudePaciente: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box className={classes.formContainer}>

      {/* Dados da Unidade de Saúde */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Dados da Unidade de Saúde
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Unidade sanitária"
              fullWidth
              size="small"
              name="unidadeSanitaria"
              variant="outlined"
              onChange={handleChange}
              value={formData.unidadeSanitaria}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Serviço"
              fullWidth
              size="small"
              name="servico"
              variant="outlined"
              onChange={handleChange}
              value={formData.servico}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Localidade"
              fullWidth
              size="small"
              name="localidade"
              variant="outlined"
              onChange={handleChange}
              value={formData.localidade}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Tipo de informação:
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.tipoInformacao === 'inicial'}
                    onChange={() => handleExclusiveChange('tipoInformacao', 'inicial')}
                    color="primary"
                  />
                }
                label="Inicial"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.tipoInformacao === 'complementar'}
                    onChange={() => handleExclusiveChange('tipoInformacao', 'complementar')}
                    color="primary"
                  />
                }
                label="Complementar"
              />
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Dados do Paciente */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Dados do Paciente
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Nome e Apelido"
              fullWidth
              size="small"
              name="nomeApelido"
              variant="outlined"
              onChange={handleChange}
              value={formData.nomeApelido}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Idade"
              fullWidth
              size="small"
              name="idade"
              variant="outlined"
              type="number"
              onChange={handleChange}
              value={formData.idade}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Sexo"
              fullWidth
              size="small"
              name="sexo"
              variant="outlined"
              onChange={handleChange}
              value={formData.sexo}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Peso (kg)"
              fullWidth
              size="small"
              name="peso"
              variant="outlined"
              type="number"
              onChange={handleChange}
              value={formData.peso}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Altura (cm)"
              fullWidth
              size="small"
              name="altura"
              variant="outlined"
              type="number"
              onChange={handleChange}
              value={formData.altura}
            />
          </Grid>

          {/* Gestante */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Gestante:
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.gestante === 'sim'}
                    onChange={() => handleExclusiveChange('gestante', 'sim')}
                    color="primary"
                  />
                }
                label="Sim"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.gestante === 'nao'}
                    onChange={() => handleExclusiveChange('gestante', 'nao')}
                    color="primary"
                  />
                }
                label="Não"
              />
            </div>
          </Grid>

          {/* Raça */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" style={{ marginBottom: 8 }}>
              Raça:
            </Typography>
            <div className={classes.checkboxRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.raca === 'negra'}
                    onChange={() => handleExclusiveChange('raca', 'negra')}
                    color="primary"
                  />
                }
                label="Negra"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.raca === 'branca'}
                    onChange={() => handleExclusiveChange('raca', 'branca')}
                    color="primary"
                  />
                }
                label="Branca"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.raca === 'outras'}
                    onChange={() => handleExclusiveChange('raca', 'outras')}
                    color="primary"
                  />
                }
                label="Outras"
              />
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Antecedentes */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Antecedentes
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.checkboxGroup}>
              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.antecedentes.medicos}
                      onChange={handleCheckboxChange('medicos')}
                      color="primary"
                    />
                  }
                  label="Médicos, Serológicos, Psiquiátricos"
                />
              </div>

              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.antecedentes.cirurgicos}
                      onChange={handleCheckboxChange('cirurgicos')}
                      color="primary"
                    />
                  }
                  label="Cirúrgicos"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.antecedentes.abusosDependencia}
                      onChange={handleCheckboxChange('abusosDependencia')}
                      color="primary"
                    />
                  }
                  label="De abuso ou dependência"
                />
              </div>

              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.antecedentes.reacoesAnteriores}
                      onChange={handleCheckboxChange('reacoesAnteriores')}
                      color="primary"
                    />
                  }
                  label="Reacções anteriores ao medicamento ou outros"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.antecedentes.alergiasConhecidas}
                      onChange={handleCheckboxChange('alergiasConhecidas')}
                      color="primary"
                    />
                  }
                  label="Alergias conhecidas"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <TextField
              multiline
              rows={3}
              label="Outros detalhes"
              placeholder="Descreva outros antecedentes relevantes..."
              fullWidth
              name="outrosDetalhes"
              variant="outlined"
              onChange={handleAntecedenteTextChange}
              value={formData.antecedentes.outrosDetalhes}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Dados de Contato */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Dados de Contato
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Endereço"
              fullWidth
              size="small"
              name="endereco"
              variant="outlined"
              onChange={handleChange}
              value={formData.endereco}
            />
          </Grid>

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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
        </Grid>
      </Paper>
    </Box>
  );
}