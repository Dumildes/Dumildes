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
    },
    charCount: {
      textAlign: 'right',
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      marginTop: theme.spacing(0.5)
    }
  })
);

interface FormData {
  tipoOcorrencia: {
    automedicacao: boolean;
    farmacodependencia: boolean;
    erroTerapeutico: boolean;
    campanhaVacinacao: boolean;
  };
  breveDescricao: string;
  prazoManifestacao: {
    horaInicio: string;
    diaInicio: string;
    mesInicio: string;
    anoInicio: string;
    diaFim: string;
    mesFim: string;
    anoFim: string;
  };
}

export default function DescricaoEfeitosIndesejaveis() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    tipoOcorrencia: {
      automedicacao: false,
      farmacodependencia: false,
      erroTerapeutico: false,
      campanhaVacinacao: false
    },
    breveDescricao: '',
    prazoManifestacao: {
      horaInicio: '',
      diaInicio: '',
      mesInicio: '',
      anoInicio: '',
      diaFim: '',
      mesFim: '',
      anoFim: ''
    }
  });

  const handleCheckboxChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      tipoOcorrencia: {
        ...prev.tipoOcorrencia,
        [field]: e.target.checked
      }
    }));
  };

  const handleDescricaoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      breveDescricao: e.target.value
    }));
  };

  const handlePrazoChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      prazoManifestacao: {
        ...prev.prazoManifestacao,
        [field]: e.target.value
      }
    }));
  };

  useEffect(() => {
    dispatch({
      type: 'descricaoEfeitosIndesejaveis',
      payload: { descricaoEfeitosIndesejaveis: formData }
    });
  }, [formData, dispatch]);

  return (
    <Box className={classes.formContainer}>

      {/* Tipo de Ocorrência */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Tipo de ocorrência:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.checkboxGroup}>
              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.tipoOcorrencia.automedicacao}
                      onChange={handleCheckboxChange('automedicacao')}
                      color="primary"
                    />
                  }
                  label="Automedicação"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.tipoOcorrencia.farmacodependencia}
                      onChange={handleCheckboxChange('farmacodependencia')}
                      color="primary"
                    />
                  }
                  label="Farmacodependência"
                />
              </div>
              
              <div className={classes.checkboxRow}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.tipoOcorrencia.erroTerapeutico}
                      onChange={handleCheckboxChange('erroTerapeutico')}
                      color="primary"
                    />
                  }
                  label="Erro terapêutico"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.tipoOcorrencia.campanhaVacinacao}
                      onChange={handleCheckboxChange('campanhaVacinacao')}
                      color="primary"
                    />
                  }
                  label="Campanha de vacinação"
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Breve Descrição */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Breve descrição do efeito
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              label="Breve descrição do efeito indesejável"
              placeholder="Descreva detalhadamente o efeito observado..."
              fullWidth
              name="breveDescricao"
              variant="outlined"
              onChange={handleDescricaoChange}
              value={formData.breveDescricao}
            />
            <Typography className={classes.charCount}>
              {formData.breveDescricao.length} caracteres
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Prazo de Manifestação */}
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" className={classes.sectionTitle}>
          Prazo de manifestação:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{ marginBottom: 16 }}>
              Início:
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              label="Hora"
              fullWidth
              size="small"
              name="horaInicio"
              variant="outlined"
              type="time"
              InputLabelProps={{ shrink: true }}
              onChange={handlePrazoChange('horaInicio')}
              value={formData.prazoManifestacao.horaInicio}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Dia"
              fullWidth
              size="small"
              name="diaInicio"
              variant="outlined"
              type="number"
              inputProps={{ min: 1, max: 31 }}
              onChange={handlePrazoChange('diaInicio')}
              value={formData.prazoManifestacao.diaInicio}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Mês"
              fullWidth
              size="small"
              name="mesInicio"
              variant="outlined"
              type="number"
              inputProps={{ min: 1, max: 12 }}
              onChange={handlePrazoChange('mesInicio')}
              value={formData.prazoManifestacao.mesInicio}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Ano"
              fullWidth
              size="small"
              name="anoInicio"
              variant="outlined"
              type="number"
              inputProps={{ min: 1900, max: 2100 }}
              onChange={handlePrazoChange('anoInicio')}
              value={formData.prazoManifestacao.anoInicio}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" style={{ marginTop: 16, marginBottom: 16 }}>
              Até:
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Dia"
              fullWidth
              size="small"
              name="diaFim"
              variant="outlined"
              type="number"
              inputProps={{ min: 1, max: 31 }}
              onChange={handlePrazoChange('diaFim')}
              value={formData.prazoManifestacao.diaFim}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Mês"
              fullWidth
              size="small"
              name="mesFim"
              variant="outlined"
              type="number"
              inputProps={{ min: 1, max: 12 }}
              onChange={handlePrazoChange('mesFim')}
              value={formData.prazoManifestacao.mesFim}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Ano"
              fullWidth
              size="small"
              name="anoFim"
              variant="outlined"
              type="number"
              inputProps={{ min: 1900, max: 2100 }}
              onChange={handlePrazoChange('anoFim')}
              value={formData.prazoManifestacao.anoFim}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}